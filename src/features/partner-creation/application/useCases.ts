import { requireOrganizationContextAccess } from "../../partner-context/application/requireOrganizationContextAccess";
import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import { PartnerCreationService, PartnerCodeAllocationService } from "../domain/services";
import { PartnerFactory } from "../domain/partnerFactory";
import { LeadId, MembershipId, OrganizationId, PartnerId, WorkspaceId } from "../domain/valueObjects";
import { partnerEvent } from "../domain/events";
import type { DomainEventDispatcher } from "../ports/DomainEventDispatcher";
import type { QualifiedLeadReader } from "../ports/QualifiedLeadReader";
import type {
  InitialMembershipRepository,
  PartnerCodeSequenceRepository,
  PartnerCreationIdempotencyRepository,
  PartnerRepository
} from "../ports/repositories";
import type { WorkspaceProvisioner } from "../../workspace/application/services/WorkspaceProvisioner";
import type { TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";

export type PartnerApplicationErrorCode = "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "PRECONDITION" | "PERSISTENCE";
export class PartnerApplicationError extends Error {
  constructor(message: string, readonly code: PartnerApplicationErrorCode) { super(message); }
}

export type PartnerApplicationDependencies = {
  transactions: TransactionRunner;
  partners: PartnerRepository;
  codes: PartnerCodeSequenceRepository;
  workspaceProvisioner: WorkspaceProvisioner;
  memberships: InitialMembershipRepository;
  idempotency: PartnerCreationIdempotencyRepository;
  qualifiedLeads: QualifiedLeadReader;
  events: DomainEventDispatcher;
};

export interface CreatePartnerInput {
  context: ResolvedOrganizationContext;
  partnerId: string;
  leadId: string;
  workspaceId: string;
  workspaceMemberId: string;
  membershipId: string;
  correlationId: string;
  eventId: string;
  occurredAt: Date;
}
export interface PartnerOutput { id: string; code: string; leadId: string; organizationId: string; workspaceId: string; membershipId: string; status: string; }

function requireAccess(context: ResolvedOrganizationContext, capability: "partner.create" | "partner.read") {
  try { requireOrganizationContextAccess(context, capability); }
  catch { throw new PartnerApplicationError("Access denied.", "FORBIDDEN"); }
}

function mapInfrastructureError(error: unknown): PartnerApplicationError {
  if (error instanceof PartnerApplicationError) return error;
  return new PartnerApplicationError("Partner Creation infrastructure is unavailable.", "PERSISTENCE");
}

function toOutput(partner: { id: { value: string }; code: { value: string }; leadId: { value: string }; organizationId: { value: string }; primaryWorkspaceId: { value: string }; initialOwnerMembershipId: { value: string }; status: string }): PartnerOutput {
  return { id: partner.id.value, code: partner.code.value, leadId: partner.leadId.value, organizationId: partner.organizationId.value, workspaceId: partner.primaryWorkspaceId.value, membershipId: partner.initialOwnerMembershipId.value, status: partner.status };
}

export class CreatePartnerUseCase {
  constructor(private readonly deps: PartnerApplicationDependencies) {}

  async execute(input: CreatePartnerInput): Promise<PartnerOutput> {
    requireAccess(input.context, "partner.create");
    let result: { partner: ReturnType<typeof PartnerFactory.create>; created: boolean };
    
    try { 
      result = await this.deps.transactions.run(async (transaction) => {
        const existingByCorrelation = await this.deps.idempotency.find(input.correlationId, transaction);
        if (existingByCorrelation) {
          const existing = await this.deps.partners.findById(existingByCorrelation, transaction);
          if (!existing) throw new PartnerApplicationError("Partner conversion record is inconsistent.", "PERSISTENCE");
          if (existing.organizationId.value !== input.context.organization.id) throw new PartnerApplicationError("Partner not found.", "NOT_FOUND");
          return { partner: existing, created: false };
        }
        
        const existingByLead = await this.deps.partners.findByLeadId(input.leadId, transaction);
        if (existingByLead) {
          new PartnerCreationService().validateIdempotency(existingByLead.correlationId, input.correlationId);
          throw new PartnerApplicationError("A Partner already exists for this Lead.", "CONFLICT");
        }
        
        if (!await this.deps.qualifiedLeads.isQualified({ leadId: input.leadId, organizationId: input.context.organization.id }, transaction)) {
          throw new PartnerApplicationError("Lead is not qualified for Partner Creation.", "PRECONDITION");
        }
        
        const sequence = await this.deps.codes.allocate(transaction);
        
        const partner = PartnerFactory.create({
          id: PartnerId.create(input.partnerId),
          code: new PartnerCodeAllocationService().allocate(sequence),
          leadId: LeadId.create(input.leadId),
          organizationId: OrganizationId.create(input.context.organization.id),
          primaryWorkspaceId: WorkspaceId.create(input.workspaceId),
          initialOwnerMembershipId: MembershipId.create(input.membershipId),
          createdAt: input.occurredAt,
          correlationId: input.correlationId,
        });

        partner.recordEvent(partnerEvent("PartnerCreationStarted", partner.id.value, `${input.eventId}:started`, input.occurredAt, input.correlationId));
        partner.recordEvent(partnerEvent("PartnerCodeAssigned", partner.id.value, `${input.eventId}:code`, input.occurredAt, input.correlationId));
        
        await this.deps.partners.save(partner, transaction);

        await this.deps.memberships.saveOwner({
          membershipId: partner.initialOwnerMembershipId.value,
          partnerId: partner.id.value,
        }, transaction);
        partner.recordEvent(partnerEvent("InitialMembershipCreated", partner.id.value, `${input.eventId}:membership`, input.occurredAt, input.correlationId));
        
        await this.deps.workspaceProvisioner.provision({
          workspaceId: input.workspaceId,
          workspaceMemberId: input.workspaceMemberId,
          partnerId: partner.id.value,
          organizationId: partner.organizationId.value,
          initialOwnerMembershipId: partner.initialOwnerMembershipId.value,
          name: partner.code.value,
          metadata: {
            eventId: `${input.eventId}:workspace`,
            occurredAt: input.occurredAt,
            correlationId: input.correlationId,
            actorId: input.context.actor.user.id,
          },
        }, transaction);

        partner.recordEvent(partnerEvent("WorkspaceCreated", partner.id.value, `${input.eventId}:workspace`, input.occurredAt, input.correlationId));
        await this.deps.idempotency.save(input.correlationId, partner.id.value, transaction);
        partner.recordEvent(partnerEvent("PartnerCreated", partner.id.value, input.eventId, input.occurredAt, input.correlationId));
        partner.recordEvent(partnerEvent("PartnerCreationCompleted", partner.id.value, `${input.eventId}:completed`, input.occurredAt, input.correlationId));
        
        return { partner, created: true };
      }); 
    } catch (error) { 
      throw mapInfrastructureError(error); 
    }
    
    if (result.created) {
      try { await this.deps.events.dispatch(result.partner.pullDomainEvents()); }
      catch (error) { throw mapInfrastructureError(error); }
    }
    
    return toOutput(result.partner);
  }
}

export class GetPartnerUseCase {
  constructor(private readonly deps: PartnerApplicationDependencies) {}
  async execute(input: { context: ResolvedOrganizationContext; partnerId: string }): Promise<PartnerOutput> {
    requireAccess(input.context, "partner.read");
    const partner = await this.deps.transactions.run((transaction) => this.deps.partners.findById(input.partnerId, transaction));
    if (!partner || partner.organizationId.value !== input.context.organization.id) throw new PartnerApplicationError("Partner not found.", "NOT_FOUND");
    return toOutput(partner);
  }
}

export class GetPartnerByLeadUseCase {
  constructor(private readonly deps: PartnerApplicationDependencies) {}
  async execute(input: { context: ResolvedOrganizationContext; leadId: string }): Promise<PartnerOutput> {
    requireAccess(input.context, "partner.read");
    const partner = await this.deps.transactions.run((transaction) => this.deps.partners.findByLeadId(input.leadId, transaction));
    if (!partner || partner.organizationId.value !== input.context.organization.id) throw new PartnerApplicationError("Partner not found.", "NOT_FOUND");
    return toOutput(partner);
  }
}
