import assert from "node:assert/strict";
import test from "node:test";
import { effectiveCapabilities } from "../../identity/domain/capabilities";
import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import { LeadFactory } from "../domain/leadFactory";
import { LeadStatus } from "../domain/valueObjects";
import type { LeadAggregate } from "../domain/lead";
import {
  ArchiveLeadUseCase, GetDiscoveryStatusUseCase, GetLeadUseCase, GetOwnershipHistoryUseCase,
  ReactivateLeadUseCase, StartQualificationUseCase, UpdateLeadUseCase,
} from "./completionUseCases";
import { ApplicationError } from "./useCases";
import type { AuditContextRecorder, LeadAuditContext } from "../ports/AuditContextRecorder";
import type { DiscoveryReadRepository } from "../ports/DiscoveryReadRepository";
import type { DomainEventDispatcher } from "../ports/DomainEventDispatcher";
import type { LeadRepository } from "../ports/LeadRepository";
import type { OwnershipRepository } from "../ports/OwnershipRepository";
import type { QualificationStatusRepository } from "../ports/QualificationStatusRepository";
import type { TransactionRunner } from "../ports/TransactionRunner";

const input = { id: "lead-1", organizationId: "org-1", ownerId: "user-1", primaryContactId: "contact-1", origin: "manual", createdAt: new Date("2026-08-05"), createdBy: "user-1" };
const operation = { eventId: "event-8a", occurredAt: new Date("2026-08-05") };

function context(organizationId = "org-1"): ResolvedOrganizationContext {
  const membership = { id: "membership-1", userId: "user-1", role: "admin" as const, status: "active" as const, scope: { organizationId } };
  return { contextKey: `user-1:membership-1:${organizationId}`, actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "admin@example.com" }, memberships: [membership] }, membership, organization: { id: organizationId, displayName: "Organization" }, capabilities: effectiveCapabilities("admin"), allowedVisibilities: ["internal", "shared", "partner_private", "public_link"] };
}

class Leads implements LeadRepository {
  lead: LeadAggregate | null = LeadFactory.create(input);
  async save(lead: LeadAggregate): Promise<void> { this.lead = lead; }
  async findById(id: string): Promise<LeadAggregate | null> { return this.lead?.id.value === id ? this.lead : null; }
  async findByOrganization(org: string): Promise<LeadAggregate[]> { return this.lead?.organizationId.value === org ? [this.lead] : []; }
  async findActiveByOrganization(org: string): Promise<LeadAggregate | null> { return this.lead?.organizationId.value === org && this.lead.status.value !== "archived" ? this.lead : null; }
  async exists(id: string): Promise<boolean> { return Boolean(await this.findById(id)); }
  async update(lead: LeadAggregate): Promise<void> { this.lead = lead; }
}
class Audit implements AuditContextRecorder { entries: LeadAuditContext[] = []; async record(entry: LeadAuditContext): Promise<void> { this.entries.push(entry); } }
const runner: TransactionRunner = { run: async (work) => work({}) };
const events: DomainEventDispatcher = { dispatch: async () => undefined };
const discovery: DiscoveryReadRepository = { getStatus: async (leadId) => ({ leadId, status: "completed", version: 1 }) };
const qualifications: QualificationStatusRepository = { getStatus: async (leadId) => ({ leadId, status: "none" }) };
const ownership: OwnershipRepository = {
  save: async () => undefined,
  findCurrentOwner: async () => null,
  findHistory: async (leadId) => [{ leadId, ownerId: "user-1", assignedBy: "admin-1", assignedAt: operation.occurredAt, active: true }],
};

test("reads a Lead through the application boundary and records audit context", async () => {
  const leads = new Leads(); const audit = new Audit();
  const value = await new GetLeadUseCase(runner, leads, audit).execute({ leadId: "lead-1" }, context(), operation);
  assert.equal(value.organizationId, "org-1");
  assert.equal(audit.entries[0]?.membershipId, "membership-1");
});

test("updates the approved mutable primary Contact through the Aggregate", async () => {
  const leads = new Leads();
  await new UpdateLeadUseCase(runner, leads, events, new Audit()).execute({ leadId: "lead-1", primaryContactId: "contact-2" }, context(), operation);
  assert.equal(leads.lead?.primaryContactId.value, "contact-2");
});

test("archives and explicitly reactivates a Lead without losing archive metadata", async () => {
  const leads = new Leads();
  await new ArchiveLeadUseCase(runner, leads, events, new Audit()).execute({ leadId: "lead-1", reason: "not now" }, context(), operation);
  assert.equal(leads.lead?.status.value, "archived");
  assert.equal(leads.lead?.archiveReason, "not now");
  await new ReactivateLeadUseCase(runner, leads, events, new Audit()).execute({ leadId: "lead-1", reason: "new opportunity" }, context(), operation);
  assert.equal(leads.lead?.status.value, "identified");
  assert.equal(leads.lead?.archiveReason, "not now");
});

test("blocks reactivation if another active Lead exists for the Organization", async () => {
  const leads = new Leads();
  await new ArchiveLeadUseCase(runner, leads, events, new Audit()).execute({ leadId: "lead-1", reason: "pause" }, context(), operation);
  leads.findActiveByOrganization = async () => LeadFactory.create({ ...input, id: "lead-2" });
  await assert.rejects(
    () => new ReactivateLeadUseCase(runner, leads, events, new Audit()).execute({ leadId: "lead-1", reason: "resume" }, context(), operation),
    (error: unknown) => error instanceof ApplicationError && error.code === "DUPLICATE_ACTIVE_LEAD",
  );
});

test("reads Ownership history and Discovery status through read ports", async () => {
  const leads = new Leads(); const audit = new Audit();
  const history = await new GetOwnershipHistoryUseCase(runner, leads, ownership, audit).execute({ leadId: "lead-1" }, context(), operation);
  const status = await new GetDiscoveryStatusUseCase(runner, leads, discovery, audit).execute({ leadId: "lead-1" }, context(), operation);
  assert.equal(history.length, 1);
  assert.equal(status.status, "completed");
});

test("starts Qualification only when Discovery is completed and no qualification is open", async () => {
  const leads = new Leads();
  leads.lead?.transitionTo(LeadStatus.create("discovery_in_progress"));
  leads.lead?.transitionTo(LeadStatus.create("discovery_completed"));
  const value = await new StartQualificationUseCase(runner, leads, discovery, qualifications, events, new Audit()).execute({ leadId: "lead-1", hasCompletedDiscovery: true }, context(), operation);
  assert.equal(value.status, "discovery_completed");
});

test("rejects an open Qualification and cross-Organization reads", async () => {
  const leads = new Leads();
  leads.lead?.transitionTo(LeadStatus.create("discovery_in_progress"));
  leads.lead?.transitionTo(LeadStatus.create("discovery_completed"));
  const open: QualificationStatusRepository = { getStatus: async (leadId) => ({ leadId, status: "open" }) };
  await assert.rejects(
    () => new StartQualificationUseCase(runner, leads, discovery, open, events, new Audit()).execute({ leadId: "lead-1", hasCompletedDiscovery: true }, context(), operation),
    (error: unknown) => error instanceof ApplicationError && error.code === "QUALIFICATION_ALREADY_OPEN",
  );
  await assert.rejects(
    () => new GetLeadUseCase(runner, leads, new Audit()).execute({ leadId: "lead-1" }, context("org-2"), operation),
    (error: unknown) => error instanceof ApplicationError && error.code === "LEAD_CONTEXT_MISMATCH",
  );
});

test("does not dispatch archive events when the transactional write fails", async () => {
  const leads = new Leads();
  leads.update = async () => { throw new Error("write failed"); };
  let dispatched = false;
  const failingEvents: DomainEventDispatcher = { dispatch: async () => { dispatched = true; } };
  await assert.rejects(
    () => new ArchiveLeadUseCase(runner, leads, failingEvents, new Audit()).execute({ leadId: "lead-1", reason: "pause" }, context(), operation),
    (error: unknown) => error instanceof ApplicationError && error.code === "LEAD_INFRASTRUCTURE_ERROR",
  );
  assert.equal(dispatched, false);
});
