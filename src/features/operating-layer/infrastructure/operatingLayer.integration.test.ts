import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";
import { AutomationEngine } from "../../automations/application/AutomationEngine";
import { PrismaAutomationRepository } from "../../automations/infrastructure/PrismaAutomationRepository";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { PrismaOperationalTaskAction } from "./PrismaOperationalTaskAction";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(client, contexts);
const repository = new PrismaAutomationRepository(client, contexts);
const now = new Date("2026-08-23T10:00:00.000Z");

beforeEach(async () => {
  await client.operationalTask.deleteMany();
  await client.automationRun.deleteMany();
  await client.automationDefinition.deleteMany();
});

after(async () => {
  await client.operationalTask.deleteMany();
  await client.automationRun.deleteMany();
  await client.automationDefinition.deleteMany();
  await client.$disconnect();
});

test("persists one idempotent task and one AutomationRun for a Lead event", async () => {
  const organizationId = randomUUID();
  await client.automationDefinition.create({ data: {
    id: randomUUID(), organizationId, name: "Follow up", status: "active",
    triggerType: "lead.created.v1", triggerVersion: 1, conditions: { status: "identified" },
    actionType: "operations.task.create", actionConfig: { taskType: "lead.follow-up", title: "Review lead", dueHours: 24 },
    version: 1, createdBy: "test", createdAt: now, updatedAt: now,
  } });
  const event = {
    eventId: randomUUID(), eventType: "lead.created.v1", eventVersion: 1,
    occurredAt: now.toISOString(), publishedAt: now.toISOString(), correlationId: randomUUID(), causationId: null,
    organizationId, source: "operating-layer", aggregateType: "Lead", aggregateId: "lead-1",
    payload: { leadId: "lead-1", status: "identified" }, metadata: { pii: false, processingDepth: 0 },
  } as const;
  const engine = new AutomationEngine(repository, [new PrismaOperationalTaskAction(contexts, () => now)], randomUUID, () => now);

  await transactions.run((context) => engine.handle(event, context));
  await transactions.run((context) => engine.handle(event, context));

  const [tasks, runs] = await Promise.all([client.operationalTask.findMany(), client.automationRun.findMany()]);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0]?.leadId, "lead-1");
  assert.equal(tasks[0]?.dueAt?.toISOString(), "2026-08-24T10:00:00.000Z");
  assert.equal(runs.length, 1);
  assert.equal(runs[0]?.status, "completed");
});

