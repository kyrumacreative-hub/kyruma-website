import assert from "node:assert/strict";
import test from "node:test";
import { LeadFactory } from "../domain/leadFactory";
import { LeadStatus } from "../domain/valueObjects";
import type { LeadAggregate } from "../domain/lead";
import type { LeadDomainEvent } from "../domain/events";
import {
  ApplicationDomainError,
  ApplicationInfrastructureError,
  ChangeLeadOwnerUseCase,
  CompleteQualificationUseCase,
  CreateLeadUseCase,
  CreatePartnerUseCase,
  StartDiscoveryUseCase,
} from "./useCases";
import type { DomainEventDispatcher } from "../ports/DomainEventDispatcher";
import type { LeadRepository } from "../ports/LeadRepository";
import type { OwnershipRecord, OwnershipRepository } from "../ports/OwnershipRepository";
import type { QualificationRecord, QualificationRepository } from "../ports/QualificationRepository";
import type { TransactionRunner } from "../ports/TransactionRunner";

const input = {
  id: "lead-1", organizationId: "org-1", ownerId: "user-1", primaryContactId: "contact-1",
  origin: "manual", createdAt: new Date("2026-08-05"), createdBy: "user-1",
};
const operation = { eventId: "event-1", occurredAt: new Date("2026-08-05") };
const allowed = { allowed: true };

class MemoryLeadRepository implements LeadRepository {
  lead: LeadAggregate | null = null;
  active: LeadAggregate | null = null;
  async save(lead: LeadAggregate): Promise<void> { this.lead = lead; this.active = lead; }
  async findById(id: string): Promise<LeadAggregate | null> { return this.lead?.id.value === id ? this.lead : null; }
  async findByOrganization(organizationId: string): Promise<LeadAggregate[]> { return this.lead?.organizationId.value === organizationId ? [this.lead] : []; }
  async findActiveByOrganization(): Promise<LeadAggregate | null> { return this.active; }
  async exists(id: string): Promise<boolean> { return (await this.findById(id)) !== null; }
  async update(lead: LeadAggregate): Promise<void> { this.lead = lead; }
}

class MemoryOwnershipRepository implements OwnershipRepository {
  records: OwnershipRecord[] = [];
  async save(record: OwnershipRecord): Promise<void> { this.records.push(record); }
  async findCurrentOwner(leadId: string): Promise<OwnershipRecord | null> { return this.records.find((record) => record.leadId === leadId && record.active) ?? null; }
  async findHistory(leadId: string): Promise<OwnershipRecord[]> { return this.records.filter((record) => record.leadId === leadId); }
}

class MemoryQualificationRepository implements QualificationRepository {
  records: QualificationRecord[] = [];
  statusWhenSaved: string | undefined;
  constructor(private readonly leads: MemoryLeadRepository) {}
  async save(record: QualificationRecord): Promise<void> { this.statusWhenSaved = this.leads.lead?.status.value; this.records.push(record); }
  async findLatest(leadId: string): Promise<QualificationRecord | null> { return this.records.filter((record) => record.leadId === leadId).at(-1) ?? null; }
}

function transactionHarness() {
  let committed = false;
  const runner: TransactionRunner = {
    run: async (work) => {
      const value = await work({});
      committed = true;
      return value;
    },
  };
  return { runner, wasCommitted: () => committed };
}

function dispatcherHarness(wasCommitted: () => boolean) {
  const received: LeadDomainEvent[][] = [];
  const dispatcher: DomainEventDispatcher = {
    dispatch: async (events) => {
      assert.equal(wasCommitted(), true, "events must be dispatched after the transaction commits");
      received.push([...events]);
    },
  };
  return { dispatcher, received };
}

test("CreateLead persists before dispatching its typed events", async () => {
  const leads = new MemoryLeadRepository();
  const transactions = transactionHarness();
  const events = dispatcherHarness(transactions.wasCommitted);
  const outcome = await new CreateLeadUseCase(transactions.runner, leads, events.dispatcher).execute(input, allowed, operation);

  assert.deepEqual(outcome, { id: "lead-1", status: "identified" });
  assert.equal(leads.lead?.id.value, "lead-1");
  assert.deepEqual(events.received[0].map((event) => event.type), ["LeadCreated", "OwnerAssigned"]);
});

test("CreateLead rejects a duplicate active Organization inside the transaction", async () => {
  const leads = new MemoryLeadRepository();
  leads.active = LeadFactory.create(input);
  const transactions = transactionHarness();
  const events = dispatcherHarness(transactions.wasCommitted);
  await assert.rejects(
    () => new CreateLeadUseCase(transactions.runner, leads, events.dispatcher).execute(input, allowed, operation),
    ApplicationDomainError,
  );
  assert.equal(events.received.length, 0);
});

test("ChangeLeadOwner persists ownership history and the Aggregate atomically", async () => {
  const leads = new MemoryLeadRepository();
  leads.lead = LeadFactory.create(input);
  const ownership = new MemoryOwnershipRepository();
  const transactions = transactionHarness();
  const events = dispatcherHarness(transactions.wasCommitted);
  const outcome = await new ChangeLeadOwnerUseCase(transactions.runner, leads, ownership, events.dispatcher).execute(
    { leadId: "lead-1", ownerId: "user-2", assignedBy: "admin-1", reason: "capacity" }, allowed, operation,
  );

  assert.equal(outcome.status, "identified");
  assert.equal(leads.lead?.ownerId.value, "user-2");
  assert.equal(ownership.records[0]?.reason, "capacity");
  assert.equal(events.received[0][0]?.type, "OwnerChanged");
});

test("StartDiscovery transitions the Aggregate only through the Application Layer", async () => {
  const leads = new MemoryLeadRepository();
  leads.lead = LeadFactory.create(input);
  const transactions = transactionHarness();
  const events = dispatcherHarness(transactions.wasCommitted);
  const outcome = await new StartDiscoveryUseCase(transactions.runner, leads, events.dispatcher).execute({ leadId: "lead-1" }, allowed, operation);

  assert.equal(outcome.status, "discovery_in_progress");
  assert.equal(events.received[0][0]?.type, "DiscoveryStarted");
});

test("CompleteQualification persists its decision before qualifying the Lead", async () => {
  const leads = new MemoryLeadRepository();
  leads.lead = LeadFactory.create(input);
  leads.lead.transitionTo(LeadStatus.create("discovery_in_progress"));
  leads.lead.transitionTo(LeadStatus.create("discovery_completed"));
  const qualifications = new MemoryQualificationRepository(leads);
  const transactions = transactionHarness();
  const events = dispatcherHarness(transactions.wasCommitted);
  const outcome = await new CompleteQualificationUseCase(transactions.runner, leads, qualifications, events.dispatcher).execute(
    { leadId: "lead-1", hasCompletedDiscovery: true, qualification: { id: "qualification-1", leadId: "lead-1", decision: "approved", reason: "fit", decidedBy: "user-1", decidedAt: operation.occurredAt } },
    allowed,
    operation,
  );

  assert.equal(qualifications.statusWhenSaved, "discovery_completed");
  assert.equal(outcome.status, "qualified");
  assert.deepEqual(events.received[0].map((event) => event.type), ["QualificationStarted", "QualificationCompleted"]);
});

test("CreatePartner only accepts a qualified Lead and dispatches after commit", async () => {
  const leads = new MemoryLeadRepository();
  leads.lead = LeadFactory.create(input);
  leads.lead.transitionTo(LeadStatus.create("discovery_in_progress"));
  leads.lead.transitionTo(LeadStatus.create("discovery_completed"));
  leads.lead.transitionTo(LeadStatus.create("qualified"));
  const transactions = transactionHarness();
  const events = dispatcherHarness(transactions.wasCommitted);
  const outcome = await new CreatePartnerUseCase(transactions.runner, leads, events.dispatcher).execute({ leadId: "lead-1", partnerId: "partner-1" }, allowed, operation);

  assert.equal(outcome.status, "partner_created");
  assert.equal(events.received[0][0]?.type, "PartnerCreated");
});

test("infrastructure failures are mapped instead of leaking from a use case", async () => {
  const transactions: TransactionRunner = { run: async () => { throw new Error("database unavailable"); } };
  const events: DomainEventDispatcher = { dispatch: async () => undefined };
  await assert.rejects(
    () => new CreateLeadUseCase(transactions, new MemoryLeadRepository(), events).execute(input, allowed, operation),
    ApplicationInfrastructureError,
  );
});
