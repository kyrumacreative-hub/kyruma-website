import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import { LeadQualificationService, type DomainOperationMetadata } from "../domain/services";
import type { LeadDomainEvent } from "../domain/events";
import type { AuditContextRecorder } from "../ports/AuditContextRecorder";
import type { DiscoveryReadRepository, DiscoveryStatusView } from "../ports/DiscoveryReadRepository";
import type { DomainEventDispatcher } from "../ports/DomainEventDispatcher";
import type { LeadRepository } from "../ports/LeadRepository";
import type { OwnershipRecord, OwnershipRepository } from "../ports/OwnershipRepository";
import type { QualificationStatusRepository } from "../ports/QualificationStatusRepository";
import type { TransactionRunner } from "../ports/TransactionRunner";
import { LeadAuthorizationGuards } from "./LeadAuthorizationGuards";
import { ApplicationError, result, toApplicationError, type LeadResult } from "./useCases";

export interface LeadDetails extends LeadResult {
  organizationId: string;
  ownerId: string;
  primaryContactId: string;
  origin: string;
  createdAt: Date;
  archivedAt?: Date;
  archivedBy?: string;
  archiveReason?: string;
}

export interface GetLeadInput { leadId: string; }
export interface UpdateLeadInput { leadId: string; primaryContactId: string; }
export interface ArchiveLeadInput { leadId: string; reason: string; }
export interface ReactivateLeadInput { leadId: string; reason: string; }
export interface GetOwnershipHistoryInput { leadId: string; }
export interface GetDiscoveryStatusInput { leadId: string; }
export interface StartQualificationInput { leadId: string; hasCompletedDiscovery: boolean; }

function details(lead: {
  id: { value: string }; status: { value: string }; organizationId: { value: string }; ownerId: { value: string };
  primaryContactId: { value: string }; origin: { value: string }; createdAt: Date; archivedAt?: Date; archivedBy?: string; archiveReason?: string;
}): LeadDetails {
  return {
    ...result(lead), organizationId: lead.organizationId.value, ownerId: lead.ownerId.value,
    primaryContactId: lead.primaryContactId.value, origin: lead.origin.value, createdAt: lead.createdAt,
    archivedAt: lead.archivedAt, archivedBy: lead.archivedBy, archiveReason: lead.archiveReason,
  };
}

async function dispatchAfterCommit(dispatcher: DomainEventDispatcher, events: readonly LeadDomainEvent[]): Promise<void> {
  try { await dispatcher.dispatch(events); } catch { throw new ApplicationError("Lead events could not be dispatched.", "LEAD_EVENT_DISPATCH_FAILED"); }
}

export class GetLeadUseCase {
  constructor(private readonly transactions: TransactionRunner, private readonly leads: LeadRepository, private readonly audit: AuditContextRecorder, private readonly guards = new LeadAuthorizationGuards()) {}
  async execute(input: GetLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadDetails> {
    const audit = this.guards.read(context, operation.occurredAt);
    try {
      return await this.transactions.run(async (transaction) => {
        const lead = await this.leads.findById(input.leadId, transaction);
        if (!lead) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, lead.organizationId.value);
        await this.audit.record(audit, transaction);
        return details(lead);
      });
    } catch (error) { return toApplicationError(error); }
  }
}

/** The only mutable Lead field approved by the existing Aggregate is its primary Contact. */
export class UpdateLeadUseCase {
  constructor(private readonly transactions: TransactionRunner, private readonly leads: LeadRepository, private readonly events: DomainEventDispatcher, private readonly audit: AuditContextRecorder, private readonly guards = new LeadAuthorizationGuards()) {}
  async execute(input: UpdateLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.update(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        aggregate.changePrimaryContact({ contactId: input.primaryContactId, eventId: operation.eventId, occurredAt: operation.occurredAt });
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) { return toApplicationError(error); }
  }
}

export class ArchiveLeadUseCase {
  constructor(private readonly transactions: TransactionRunner, private readonly leads: LeadRepository, private readonly events: DomainEventDispatcher, private readonly audit: AuditContextRecorder, private readonly guards = new LeadAuthorizationGuards()) {}
  async execute(input: ArchiveLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.archive(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        aggregate.archive({ eventId: operation.eventId, occurredAt: operation.occurredAt, actorId: context.actor.user.id, reason: input.reason });
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) { return toApplicationError(error); }
  }
}

export class ReactivateLeadUseCase {
  constructor(private readonly transactions: TransactionRunner, private readonly leads: LeadRepository, private readonly events: DomainEventDispatcher, private readonly audit: AuditContextRecorder, private readonly guards = new LeadAuthorizationGuards()) {}
  async execute(input: ReactivateLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.reactivate(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        if (await this.leads.findActiveByOrganization(aggregate.organizationId.value, transaction)) {
          throw new ApplicationError("An active Lead already exists for this Organization.", "DUPLICATE_ACTIVE_LEAD");
        }
        aggregate.reactivate({ eventId: operation.eventId, occurredAt: operation.occurredAt, actorId: context.actor.user.id, reason: input.reason });
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) { return toApplicationError(error); }
  }
}

export class GetOwnershipHistoryUseCase {
  constructor(private readonly transactions: TransactionRunner, private readonly leads: LeadRepository, private readonly ownership: OwnershipRepository, private readonly audit: AuditContextRecorder, private readonly guards = new LeadAuthorizationGuards()) {}
  async execute(input: GetOwnershipHistoryInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<readonly OwnershipRecord[]> {
    const audit = this.guards.read(context, operation.occurredAt);
    try {
      return await this.transactions.run(async (transaction) => {
        const lead = await this.leads.findById(input.leadId, transaction);
        if (!lead) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, lead.organizationId.value);
        const history = await this.ownership.findHistory(input.leadId, transaction);
        await this.audit.record(audit, transaction);
        return history;
      });
    } catch (error) { return toApplicationError(error); }
  }
}

export class GetDiscoveryStatusUseCase {
  constructor(private readonly transactions: TransactionRunner, private readonly leads: LeadRepository, private readonly discovery: DiscoveryReadRepository, private readonly audit: AuditContextRecorder, private readonly guards = new LeadAuthorizationGuards()) {}
  async execute(input: GetDiscoveryStatusInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<DiscoveryStatusView> {
    const audit = this.guards.read(context, operation.occurredAt);
    try {
      return await this.transactions.run(async (transaction) => {
        const lead = await this.leads.findById(input.leadId, transaction);
        if (!lead) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, lead.organizationId.value);
        const status = await this.discovery.getStatus(input.leadId, transaction);
        if (!status) throw new ApplicationError("Discovery not found.", "DISCOVERY_NOT_FOUND");
        await this.audit.record(audit, transaction);
        return status;
      });
    } catch (error) { return toApplicationError(error); }
  }
}

export class StartQualificationUseCase {
  constructor(private readonly transactions: TransactionRunner, private readonly leads: LeadRepository, private readonly discovery: DiscoveryReadRepository, private readonly qualifications: QualificationStatusRepository, private readonly events: DomainEventDispatcher, private readonly audit: AuditContextRecorder, private readonly guards = new LeadAuthorizationGuards()) {}
  async execute(input: StartQualificationInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult> {
    const audit = this.guards.startQualification(context, operation.occurredAt);
    try {
      const lead = await this.transactions.run(async (transaction) => {
        const aggregate = await this.leads.findById(input.leadId, transaction);
        if (!aggregate) throw new ApplicationError("Lead not found.", "LEAD_NOT_FOUND");
        this.guards.assertLeadOrganization(context, aggregate.organizationId.value);
        const discovery = await this.discovery.getStatus(input.leadId, transaction);
        if (!input.hasCompletedDiscovery || discovery?.status !== "completed") {
          throw new ApplicationError("Qualification requires a completed Discovery.", "DISCOVERY_NOT_COMPLETED");
        }
        if ((await this.qualifications.getStatus(input.leadId, transaction)).status === "open") {
          throw new ApplicationError("A Qualification is already open for this Lead.", "QUALIFICATION_ALREADY_OPEN");
        }
        new LeadQualificationService().start(aggregate, true, operation);
        await this.leads.update(aggregate, transaction);
        await this.audit.record(audit, transaction);
        return aggregate;
      });
      await dispatchAfterCommit(this.events, lead.pullDomainEvents());
      return result(lead);
    } catch (error) { return toApplicationError(error); }
  }
}
