import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import type { EventEnvelope } from "../../domain/contracts";
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
  assert.equal([...first, ...second].filter((claimed) => claimed.eventId === value.eventId).length, 1);
  const registrations = [{ consumer: "audit", handler: "record", eventType: value.eventType, eventVersion: 1 }, { consumer: "analytics", handler: "project", eventType: value.eventType, eventVersion: 1 }];
  await repository.materializeDeliveries(value, registrations, now);
  await repository.materializeDeliveries(value, registrations, now);
  assert.equal(await client.eventProcessingRecord.count({ where: { eventId: value.eventId } }), 2);
});

test("keeps successful consumers independent from failed and recoverable dead letters", async () => {
  const value = event();
  await transactions.run((context) => repository.append(value, context));
  await repository.claimPendingEvents({ workerId: "dispatcher", now, staleBefore: new Date(0), limit: 10 });
  await repository.materializeDeliveries(value, [{ consumer: "audit", handler: "record", eventType: value.eventType, eventVersion: 1 }, { consumer: "analytics", handler: "project", eventType: value.eventType, eventVersion: 1 }], now);
  const deliveries = await repository.claimDeliveries({ workerId: "consumer", now, staleBefore: new Date(0), limit: 10 });
  const success = deliveries.find((item) => item.consumer === "audit")!;
  const failure = deliveries.find((item) => item.consumer === "analytics")!;
  await transactions.run((context) => repository.markProcessed(success.id, now, context));
  await transactions.run((context) => repository.markFailed(failure.id, { now, nextRetryAt: null, code: "NON_RETRYABLE", message: "safe" }, context));
  const status = await repository.getStatus(value.eventId, value.organizationId);
  assert.deepEqual(status?.deliveries.map((item) => item.status).sort(), ["dead_lettered", "processed"]);
  await transactions.run((context) => repository.requeueDeadLetter(failure.id, now, context));
  assert.equal((await repository.getDeadLetter(failure.id, value.organizationId))?.status, "pending");
  assert.equal(await repository.getDeadLetter(failure.id, "other-org"), null);
});

test.after(async () => { await client.$disconnect(); });
