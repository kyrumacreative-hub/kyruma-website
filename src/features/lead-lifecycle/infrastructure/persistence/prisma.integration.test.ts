import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";
import { DuplicateActiveLeadError } from "../../domain/errors";
import { LeadFactory } from "../../domain/leadFactory";
import { PrismaTransactionContextStore } from "./PrismaTransactionContext";
import { PrismaTransactionRunner, type PersistenceObserver } from "./PrismaTransactionRunner";
import { PrismaLeadRepository } from "./repositories/PrismaLeadRepository";
import { PrismaOwnershipRepository } from "./repositories/PrismaOwnershipRepository";
import { PrismaQualificationRepository } from "./repositories/PrismaQualificationRepository";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const observations: { committed: number; rolledBack: number } = { committed: 0, rolledBack: 0 };
const observer: PersistenceObserver = {
  transactionCompleted: () => { observations.committed += 1; },
  transactionFailed: () => { observations.rolledBack += 1; },
};
const transactions = new PrismaTransactionRunner(client, contexts, observer);
const leads = new PrismaLeadRepository(contexts);
const ownership = new PrismaOwnershipRepository(contexts);
const qualifications = new PrismaQualificationRepository(contexts);

function leadInput(id = randomUUID(), organizationId = randomUUID()) {
  return { id, organizationId, ownerId: `owner-${randomUUID()}`, primaryContactId: `contact-${randomUUID()}`, origin: "manual", createdAt: new Date(), createdBy: "user-test" };
}
async function saveLead(input = leadInput()) {
  const aggregate = LeadFactory.create(input);
  await transactions.run((context) => leads.save(aggregate, context));
  return aggregate;
}

beforeEach(async () => {
  await client.qualification.deleteMany();
  await client.ownership.deleteMany();
  await client.lead.deleteMany();
  observations.committed = 0;
  observations.rolledBack = 0;
});
after(async () => { await client.qualification.deleteMany(); await client.ownership.deleteMany(); await client.lead.deleteMany(); await client.$disconnect(); });

test("persists, updates, archives and reactivates a Lead in PostgreSQL", async () => {
  const created = await saveLead();
  await transactions.run(async (context) => {
    const loaded = await leads.findById(created.id.value, context);
    assert.ok(loaded);
    loaded.changePrimaryContact({ contactId: "contact-updated", eventId: randomUUID(), occurredAt: new Date() });
    await leads.update(loaded, context);
  });
  await transactions.run(async (context) => {
    const loaded = await leads.findById(created.id.value, context);
    assert.ok(loaded);
    loaded.archive({ eventId: randomUUID(), occurredAt: new Date(), actorId: "user-test", reason: "pause" });
    await leads.update(loaded, context);
  });
  await transactions.run(async (context) => {
    assert.equal(await leads.findActiveByOrganization(created.organizationId.value, context), null);
    const archived = await leads.findById(created.id.value, context);
    assert.equal(archived?.archivedBy, "user-test");
    if (!archived) throw new Error("Archived Lead was not found.");
    archived.reactivate({ eventId: randomUUID(), occurredAt: new Date(), actorId: "user-test", reason: "resume" });
    await leads.update(archived, context);
  });
  const persisted = await transactions.run((context) => leads.findById(created.id.value, context));
  assert.equal(persisted?.status.value, "identified");
  assert.equal(persisted?.primaryContactId.value, "contact-updated");
});

test("commits successful work and rolls back failed work", async () => {
  const committed = leadInput();
  await transactions.run((context) => leads.save(LeadFactory.create(committed), context));
  assert.equal(await transactions.run((context) => leads.exists(committed.id, context)), true);
  const rolledBack = leadInput();
  await assert.rejects(() => transactions.run(async (context) => { await leads.save(LeadFactory.create(rolledBack), context); throw new Error("force rollback"); }));
  assert.equal(await transactions.run((context) => leads.exists(rolledBack.id, context)), false);
  assert.ok(observations.committed > 0);
  assert.equal(observations.rolledBack, 1);
});

test("enforces active Lead uniqueness and Organization isolation", async () => {
  const first = leadInput(); await saveLead(first);
  await assert.rejects(() => saveLead(leadInput(randomUUID(), first.organizationId)), DuplicateActiveLeadError);
  const other = await saveLead();
  const own = await transactions.run((context) => leads.findByOrganization(first.organizationId, context));
  const isolated = await transactions.run((context) => leads.findByOrganization(other.organizationId.value, context));
  assert.equal(own.length, 1); assert.equal(isolated.length, 1); assert.notEqual(own[0]?.id.value, isolated[0]?.id.value);
});

test("keeps exactly one active Owner and permanent history", async () => {
  const lead = await saveLead();
  await transactions.run(async (context) => {
    await ownership.save({ leadId: lead.id.value, ownerId: "owner-1", assignedBy: "admin-1", assignedAt: new Date("2026-01-01"), active: true }, context);
    await ownership.save({ leadId: lead.id.value, ownerId: "owner-2", assignedBy: "admin-1", assignedAt: new Date("2026-01-02"), reason: "capacity", active: true }, context);
  });
  const current = await transactions.run((context) => ownership.findCurrentOwner(lead.id.value, context));
  const history = await transactions.run((context) => ownership.findHistory(lead.id.value, context));
  assert.equal(current?.ownerId, "owner-2");
  assert.deepEqual(history.map((entry) => entry.active), [false, true]);
});

test("persists Qualification and handles basic concurrent Lead creation", async () => {
  const lead = await saveLead();
  await transactions.run((context) => qualifications.save({ id: "qualification-1", leadId: lead.id.value, decision: "continue", reason: "fit", decidedBy: "admin-1", decidedAt: new Date() }, context));
  assert.equal((await transactions.run((context) => qualifications.findLatest(lead.id.value, context)))?.id, "qualification-1");

  const organizationId = randomUUID();
  const [first, second] = await Promise.allSettled([saveLead(leadInput(randomUUID(), organizationId)), saveLead(leadInput(randomUUID(), organizationId))]);
  assert.equal([first, second].filter((result) => result.status === "fulfilled").length, 1);
});
