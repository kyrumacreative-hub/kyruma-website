import assert from "node:assert/strict";
import test from "node:test";
import {
  InvalidDomainEventError,
  InvalidLeadOriginError,
  InvalidLeadStateError,
  MissingOrganizationError,
  MissingOwnerError,
  MissingPrimaryContactError,
} from "./errors";
import { eventMetadata } from "./events";
import { LeadFactory } from "./leadFactory";
import { LeadCreationService, LeadOwnershipService, LeadQualificationService } from "./services";
import { LeadOrigin, LeadStatus } from "./valueObjects";
import { LeadMapper } from "../infrastructure/persistence/leadMapper";
import { PersistenceAdapterNotConfiguredError, PostgresLeadRepositoryAdapter } from "../infrastructure/persistence/repositories/PostgresLeadRepositoryAdapter";
import type { TransactionRunner } from "../ports/TransactionRunner";

const input = { id: "lead-1", organizationId: "org-1", ownerId: "user-1", primaryContactId: "contact-1", origin: "manual", createdAt: new Date("2026-08-05"), createdBy: "user-1" };

test("factory creates the only valid initial Lead state", () => {
  const lead = LeadFactory.create(input);
  assert.equal(lead.status.value, "identified");
  assert.equal(lead.organizationId.value, "org-1");
  assert.equal(lead.origin.value, "manual");
  assert.equal(lead.createdBy, "user-1");
});

test("factory rejects missing Organization, Owner and Contact", () => {
  assert.throws(() => LeadFactory.create({ ...input, organizationId: "" }), MissingOrganizationError);
  assert.throws(() => LeadFactory.create({ ...input, ownerId: "" }), MissingOwnerError);
  assert.throws(() => LeadFactory.create({ ...input, primaryContactId: "" }), MissingPrimaryContactError);
});

test("value objects reject invalid origin and state", () => {
  assert.throws(() => LeadOrigin.create(""), InvalidLeadOriginError);
  assert.throws(() => LeadStatus.create("not-a-lead-status"), InvalidLeadStateError);
});

test("creation service records typed events with required metadata", () => {
  const lead = new LeadCreationService().create(input, { eventId: "event-1", occurredAt: new Date("2026-08-05") });
  const events = lead.pullDomainEvents();

  assert.deepEqual(events.map((event) => event.type), ["LeadCreated", "OwnerAssigned"]);
  assert.equal(events[0].eventId, "event-1");
  assert.equal(events[0].aggregateId, "lead-1");
  assert.equal(events[0].aggregateType, "Lead");
  assert.equal(events[0].version, 1);
  assert.equal(lead.pullDomainEvents().length, 0);
});

test("ownership service changes Owner and rejects invalid reassignment", () => {
  const lead = LeadFactory.create(input);
  const service = new LeadOwnershipService();

  service.reassign(lead, "user-2", "capacity", { eventId: "event-2", occurredAt: new Date("2026-08-05") });
  assert.equal(lead.ownerId.value, "user-2");
  assert.equal(lead.pullDomainEvents()[0].type, "OwnerChanged");
  assert.throws(() => service.reassign(lead, "user-2", "", { eventId: "event-3", occurredAt: new Date() }), InvalidLeadStateError);
});

test("qualification service requires a completed Discovery", () => {
  const lead = LeadFactory.create(input);
  const service = new LeadQualificationService();

  assert.throws(() => service.start(lead, false, { eventId: "event-4", occurredAt: new Date() }), InvalidLeadStateError);
  service.start(lead, true, { eventId: "event-5", occurredAt: new Date("2026-08-05") });
  assert.equal(lead.pullDomainEvents()[0].type, "QualificationStarted");
});

test("event metadata rejects an empty event id", () => {
  assert.throws(() => eventMetadata({ eventId: "", aggregateId: "lead-1", occurredAt: new Date() }), InvalidDomainEventError);
});

test("mapper converts an Aggregate without applying business rules", () => {
  const lead = LeadFactory.create(input);
  const restored = LeadMapper.toDomain(LeadMapper.toPersistence(lead));
  assert.equal(restored.id.value, lead.id.value);
  assert.equal(restored.status.value, "identified");
});

test("PostgreSQL adapter skeleton fails without infrastructure", async () => {
  await assert.rejects(() => new PostgresLeadRepositoryAdapter().findById("lead-1", {}), PersistenceAdapterNotConfiguredError);
});

test("transaction contract keeps provider context opaque", async () => {
  const runner: TransactionRunner = { run: async (operation) => operation({}) };
  assert.equal(await runner.run(async () => "committed"), "committed");
});

test("Lead supports only approved archive and reactivation transitions", () => {
  const lead = LeadFactory.create(input);
  lead.archive({ eventId: "event-archive", occurredAt: new Date("2026-08-05"), actorId: "user-1", reason: "not now" });
  assert.equal(lead.status.value, "archived");
  assert.equal(lead.archivedBy, "user-1");
  assert.equal(lead.pullDomainEvents()[0]?.type, "LeadArchived");

  lead.reactivate({ eventId: "event-reactivate", occurredAt: new Date("2026-08-06"), actorId: "user-1", reason: "new opportunity" });
  assert.equal(lead.status.value, "identified");
  assert.equal(lead.pullDomainEvents()[0]?.type, "LeadReactivated");
  assert.throws(() => lead.transitionTo(LeadStatus.create("partner_created")), InvalidLeadStateError);
});
