import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import type { EventEnvelope } from "../../domain/contracts";
import { LeaseOwnershipLostError } from "../../domain/errors";
import { PrismaEventBusRepository } from "./PrismaEventBusRepository";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(client, contexts);
const repository = new PrismaEventBusRepository(client, contexts);
const now = new Date("2026-08-14T09:00:00.000Z");

const event = (suffix = randomUUID()): EventEnvelope => ({ eventId: `evt-${suffix}`, eventType: "workspace.activated.v1", eventVersion: 1, occurredAt: now.toISOString(), publishedAt: now.toISOString(), correlationId: `corr-${suffix}`, causationId: null, organizationId: `org-${suffix}`, source: "workspace", aggregateType: "Workspace", aggregateId: `ws-${suffix}`, payload: { workspaceId: `ws-${suffix}` }, metadata: { pii: false, processingDepth: 0 } });

test("persists Outbox atomically and rolls it back with the shared TransactionRunner", async () => {
  const committed = event();
  await transactions.run((context) => repository.append(committed, context));
  assert.equal(await client.eventOutbox.count({ where: { eventId: committed.eventId } }), 1);
  const rolledBack = event();
  await assert.rejects(() => transactions.run(async (context) => { await repository.append(rolledBack, context); throw new Error("rollback"); }));
  assert.equal(await client.eventOutbox.count({ where: { eventId: rolledBack.eventId } }), 0);
});

test("claims an event once and materializes isolated idempotent handler records", async () => {
  const value = event();
  await transactions.run((context) => repository.append(value, context));
  const [first, second] = await Promise.all([repository.claimPendingEvents({ workerId: "worker-a", now, staleBefore: new Date(0), limit: 10 }), repository.claimPendingEvents({ workerId: "worker-b", now, staleBefore: new Date(0), limit: 10 })]);
  const claims = [...first, ...second].filter((claim) => claim.envelope.eventId === value.eventId);
  assert.equal(claims.length, 1);
  const registrations = [{ consumer: "audit", handler: "record", eventType: value.eventType, eventVersion: 1 }, { consumer: "analytics", handler: "project", eventType: value.eventType, eventVersion: 1 }];
  await repository.materializeDeliveries(claims[0], registrations, now);
  await assert.rejects(() => repository.materializeDeliveries(claims[0], registrations, now), LeaseOwnershipLostError);
  assert.equal(await client.eventProcessingRecord.count({ where: { eventId: value.eventId } }), 2);
});

test("keeps successful consumers independent from failed and recoverable dead letters", async () => {
  const value = event();
  await transactions.run((context) => repository.append(value, context));
  const claim = (await repository.claimPendingEvents({ workerId: "dispatcher", now, staleBefore: new Date(0), limit: 100 }))
    .find((item) => item.envelope.eventId === value.eventId)!;
  await repository.materializeDeliveries(claim, [{ consumer: "audit", handler: "record", eventType: value.eventType, eventVersion: 1 }, { consumer: "analytics", handler: "project", eventType: value.eventType, eventVersion: 1 }], now);
  const deliveries = await repository.claimDeliveries({ workerId: "consumer", now, staleBefore: new Date(0), limit: 10 });
  const success = deliveries.find((item) => item.eventId === value.eventId && item.consumer === "audit")!;
  const failure = deliveries.find((item) => item.eventId === value.eventId && item.consumer === "analytics")!;
  await transactions.run((context) => repository.markProcessed(success.id, success.leaseToken, now, context));
  await transactions.run((context) => repository.markFailed(failure.id, failure.leaseToken, { now, nextRetryAt: null, code: "NON_RETRYABLE", message: "safe" }, context));
  const status = await repository.getStatus(value.eventId, value.organizationId);
  assert.deepEqual(status?.deliveries.map((item) => item.status).sort(), ["dead_lettered", "processed"]);
  await transactions.run((context) => repository.requeueDeadLetter(failure.id, now, context));
  assert.equal((await repository.getDeadLetter(failure.id, value.organizationId))?.status, "pending");
  assert.equal(await repository.getDeadLetter(failure.id, "other-org"), null);
});

test("fences a dispatcher after its stale event lease is reassigned", async () => {
  const value = event();
  await transactions.run((context) => repository.append(value, context));
  const first = (await repository.claimPendingEvents({ workerId: "dispatcher-a", now, staleBefore: new Date(0), limit: 100 }))
    .find((item) => item.envelope.eventId === value.eventId)!;
  const later = new Date(now.getTime() + 600_000);
  const replacement = (await repository.claimPendingEvents({ workerId: "dispatcher-b", now: later, staleBefore: new Date(now.getTime() + 300_000), limit: 100 }))
    .find((item) => item.envelope.eventId === value.eventId)!;
  assert.ok(first);
  assert.ok(replacement);
  const registrations = [{ consumer: "audit", handler: "record", eventType: value.eventType, eventVersion: 1 }];
  await assert.rejects(() => repository.materializeDeliveries(first, registrations, later), LeaseOwnershipLostError);
  await repository.materializeDeliveries(replacement, registrations, later);
  assert.equal(await client.eventProcessingRecord.count({ where: { eventId: value.eventId } }), 1);
});

test("claims a delivery once and fences a stale consumer after reassignment", async () => {
  const value = event();
  await transactions.run((context) => repository.append(value, context));
  const eventClaim = (await repository.claimPendingEvents({ workerId: "dispatcher", now, staleBefore: new Date(0), limit: 100 }))
    .find((item) => item.envelope.eventId === value.eventId)!;
  assert.ok(eventClaim);
  await repository.materializeDeliveries(eventClaim, [{ consumer: "audit", handler: "record", eventType: value.eventType, eventVersion: 1 }], now);

  const [firstBatch, secondBatch] = await Promise.all([
    repository.claimDeliveries({ workerId: "consumer-a", now, staleBefore: new Date(0), limit: 100 }),
    repository.claimDeliveries({ workerId: "consumer-b", now, staleBefore: new Date(0), limit: 100 }),
  ]);
  const [first] = [...firstBatch, ...secondBatch].filter((delivery) => delivery.eventId === value.eventId);
  assert.equal([...firstBatch, ...secondBatch].filter((delivery) => delivery.eventId === value.eventId).length, 1);

  const later = new Date(now.getTime() + 600_000);
  const replacement = (await repository.claimDeliveries({ workerId: "consumer-c", now: later, staleBefore: new Date(now.getTime() + 300_000), limit: 100 }))
    .find((delivery) => delivery.eventId === value.eventId)!;
  assert.ok(first);
  assert.ok(replacement);
  await assert.rejects(() => transactions.run((context) => repository.markProcessed(first.id, first.leaseToken, later, context)), LeaseOwnershipLostError);
  await transactions.run((context) => repository.markProcessed(replacement.id, replacement.leaseToken, later, context));
  assert.equal((await repository.getStatus(value.eventId, value.organizationId))?.deliveries[0].status, "processed");
});

test.after(async () => { await client.$disconnect(); });
