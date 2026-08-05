import {
  DuplicateActiveLeadError,
  InvalidLeadStateError,
} from "../domain/errors";
import { eventMetadata, type LeadDomainEvent } from "../domain/events";
import {
  LeadCreationService,
  LeadOwnershipService,
  LeadQualificationService,
  type DomainOperationMetadata,
} from "../domain/services";
import type { CreateLeadInput } from "../domain/types";
import { LeadStatus } from "../domain/valueObjects";
import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import { LeadAuthorizationGuards, LeadContextMismatchError } from "./LeadAuthorizationGuards";
import type { AuditContextRecorder } from "../ports/AuditContextRecorder";
import type { DomainEventDispatcher } from "../ports/DomainEventDispatcher";
import type { LeadRepository } from "../ports/LeadRepository";
import type { OwnershipRecord, OwnershipRepository } from "../ports/OwnershipRepository";
import type { QualificationRecord, QualificationRepository } from "../ports/QualificationRepository";
import type { TransactionRunner } from "../ports/TransactionRunner";

/** Application-layer errors are safe to expose to adapters; infrastructure errors never leak. */
export class ApplicationError extends Error {
  readonly code: string;
  constructor(message: string, code = "LEAD_APPLICATION_ERROR") {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
  }
}

export class ApplicationDomainError extends ApplicationError {
  constructor(message: string) { super(message, "LEAD_DOMAIN_ERROR"); this.name = "ApplicationDomainError"; }
}

export class ApplicationInfrastructureError extends ApplicationError {
  constructor() { super("Lead Lifecycle operation could not be completed.", "LEAD_INFRASTRUCTURE_ERROR"); this.name = "ApplicationInfrastructureError"; }
}

export interface LeadResult { id: string; status: string; }
export interface ChangeLeadOwnerInput {
  leadId: string;
  ownerId: string;
  assignedBy: string;
  reason: string;
}
export interface StartDiscoveryInput { leadId: string; }
export interface CompleteQualificationInput {
  leadId: string;
  qualification: QualificationRecord;
  hasCompletedDiscovery: boolean;
}
export interface CreatePartnerInput { leadId: string; partnerId: string; }

function result(lead: { id: { value: string }; status: { value: string } }): LeadResult {
  return { id: lead.id.value, status: lead.status.value };
}

function toApplicationError(error: unknown): never {
  if (error instanceof ApplicationError) throw error;
  if (error instanceof DuplicateActiveLeadError || error instanceof InvalidLeadStateError) {
    throw new ApplicationDomainError(error.message);
  }
  if (error instanceof LeadContextMismatchError) {
    throw new ApplicationError(error.message, error.code);
  }
  throw new ApplicationInfrastructureError();
}

async function dispatchAfterCommit(dispatcher: DomainEventDispatcher, events: readonly LeadDomainEvent[]): Promise<void> {
  try {
    await dispatcher.dispatch(events);
  } catch {
    throw new ApplicationInfrastructureError();
  }
}

export class CreateLeadUseCase {
  constructor(
    private readonly transactions: TransactionRunner,
    private readonly leads: LeadRepository,
    private readonly events: DomainEventDispatcher,
    private readonly audit: AuditContextRecorder,
    private readonly guards = new LeadAuthorizationGuards(),
  ) {}

  async execute(input: CreateLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.create(context, operation.occurredAt);
    this.guards.assertLeadOrganization(context, input.organizationId);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        if (await this.leads.findActiveByOrganization(input.organizationId, transaction)) {
          throw new DuplicateActiveLeadError("An active Lead already exists.");
        }
        const aggregate = new LeadCreationService().create(input, operation);
        await this.leads.save(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) {
      return toApplicationError(error);
    }
  }
}

export class ChangeLeadOwnerUseCase {
  constructor(
    private readonly transactions: TransactionRunner,
    private readonly leads: LeadRepository,
    private readonly ownership: OwnershipRepository,
    private readonly events: DomainEventDispatcher,
    private readonly audit: AuditContextRecorder,
    private readonly guards = new LeadAuthorizationGuards(),
  ) {}

  async execute(input: ChangeLeadOwnerInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.changeOwner(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        new LeadOwnershipService().reassign(aggregate, input.ownerId, input.reason, operation);
        const ownership: OwnershipRecord = {
          leadId: input.leadId,
          ownerId: input.ownerId,
          assignedBy: input.assignedBy,
          assignedAt: operation.occurredAt,
          reason: input.reason,
          active: true,
        };
        await this.ownership.save(ownership, transaction);
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) {
      return toApplicationError(error);
    }
  }
}

export class StartDiscoveryUseCase {
  constructor(
    private readonly transactions: TransactionRunner,
    private readonly leads: LeadRepository,
    private readonly events: DomainEventDispatcher,
    private readonly audit: AuditContextRecorder,
    private readonly guards = new LeadAuthorizationGuards(),
  ) {}

  async execute(input: StartDiscoveryInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.startDiscovery(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        aggregate.transitionTo(LeadStatus.create("discovery_in_progress"));
        aggregate.recordEvent({ ...eventMetadata({ eventId: operation.eventId, aggregateId: aggregate.id.value, occurredAt: operation.occurredAt }), type: "DiscoveryStarted" });
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) {
      return toApplicationError(error);
    }
  }
}

export class CompleteQualificationUseCase {
  constructor(
    private readonly transactions: TransactionRunner,
    private readonly leads: LeadRepository,
    private readonly qualifications: QualificationRepository,
    private readonly events: DomainEventDispatcher,
    private readonly audit: AuditContextRecorder,
    private readonly guards = new LeadAuthorizationGuards(),
  ) {}

  async execute(input: CompleteQualificationInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.completeQualification(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        new LeadQualificationService().start(aggregate, input.hasCompletedDiscovery, operation);
        // PD-005: the decision is durable before the Aggregate becomes qualified.
        await this.qualifications.save(input.qualification, transaction);
        aggregate.transitionTo(LeadStatus.create("qualified"));
        aggregate.recordEvent({ ...eventMetadata({ eventId: `${operation.eventId}:completed`, aggregateId: aggregate.id.value, occurredAt: operation.occurredAt }), type: "QualificationCompleted" });
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) {
      return toApplicationError(error);
    }
  }
}

export class CreatePartnerUseCase {
  constructor(
    private readonly transactions: TransactionRunner,
    private readonly leads: LeadRepository,
    private readonly events: DomainEventDispatcher,
    private readonly audit: AuditContextRecorder,
    private readonly guards = new LeadAuthorizationGuards(),
  ) {}

  async execute(input: CreatePartnerInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.createPartner(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        aggregate.transitionTo(LeadStatus.create("partner_created"));
        aggregate.recordEvent({ ...eventMetadata({ eventId: operation.eventId, aggregateId: aggregate.id.value, occurredAt: operation.occurredAt }), type: "PartnerCreated", partnerId: input.partnerId });
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) {
      return toApplicationError(error);
    }
  }
}
