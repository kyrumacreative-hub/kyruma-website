import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";

import { EventContractRegistry } from "../../../event-bus/domain/validation";
import { EventHandlerRegistry } from "../../../event-bus/application/EventHandlerRegistry";
import { DispatchPendingEventsUseCase, PublishEventUseCase } from "../../../event-bus/application/useCases";
import { PrismaEventBusRepository } from "../../../event-bus/infrastructure/persistence/PrismaEventBusRepository";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import type { ResolvedPartnerContext } from "../../../partner-context/domain/types";
import { projectEvent } from "../../domain/events";
import { ProjectFactory } from "../../domain/projectFactory";
import { OperationsOrganizationId, OperationsPartnerId, OperationsWorkspaceId, ProjectId, ProjectName } from "../../domain/valueObjects";
import { ActivateProjectUseCase, CreateProjectUseCase } from "../../application/useCases";
import { ProjectEventBusOutbox, registerProjectEventContracts } from "../events/ProjectEventBusOutbox";
import { PrismaProjectRepository } from "./repositories/PrismaProjectRepository";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(client, contexts);
const projects = new PrismaProjectRepository(contexts);
const eventRepository = new PrismaEventBusRepository(client, contexts, randomUUID);

function context(workspaceId: string, organizationId: string, partnerId: string): ResolvedPartnerContext {
  return {
    contextKey: `context-${workspaceId}`,
    actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "ops@kyruma.test" }, memberships: [] },
    membership: { id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId, partnerId, workspaceId } },
    organization: { id: organizationId, displayName: "KYRUMA" },
    partner: { id: partnerId, publicId: "KYR-001", status: "active", displayName: "Partner" },
    workspace: { id: workspaceId, displayName: "KYR-001", access: "internal" },
    capabilities: new Set(["project.create", "project.update"] as never[]),
    allowedVisibilities: ["internal"],
  };
}

function dependencies() {
  const contracts = new EventContractRegistry();
  registerProjectEventContracts(contracts);
  const publisher = new PublishEventUseCase(
    eventRepository,
    contracts,
    { now: () => new Date("2026-08-14T10:05:00.000Z") },
    randomUUID,
  );
  return { transactions, projects, outbox: new ProjectEventBusOutbox(publisher) };
}

function creation(suffix = randomUUID()) {
  const organizationId = `org-${suffix}`;
  const partnerId = `partner-${suffix}`;
  const workspaceId = `workspace-${suffix}`;
  return {
    context: context(workspaceId, organizationId, partnerId),
    projectId: `project-${suffix}`,
    name: "Identity renewal",
    eventId: `event-${suffix}`,
    occurredAt: new Date("2026-08-14T10:00:00.000Z"),
    correlationId: `correlation-${suffix}`,
  };
}

beforeEach(async () => {
  await client.eventProcessingRecord.deleteMany();
  await client.eventOutbox.deleteMany();
  await client.project.deleteMany();
});
after(async () => {
  await client.eventProcessingRecord.deleteMany();
  await client.eventOutbox.deleteMany();
  await client.project.deleteMany();
  await client.$disconnect();
});

test("commits Project activation and makes the Event Bus outbox visible only after commit", async () => {
  const input = creation();
  const useCases = dependencies();
  await new CreateProjectUseCase(useCases).execute(input);
  const activated = await new ActivateProjectUseCase(useCases).execute({
    ...input,
    eventId: `${input.eventId}:activate`,
    correlationId: `${input.correlationId}:activate`,
    occurredAt: new Date("2026-08-14T10:01:00.000Z"),
  });

  assert.equal(activated.status, "active");
  const stored = await client.project.findUnique({ where: { id: input.projectId } });
  assert.equal(stored?.status, "active");
  const events = await client.eventOutbox.findMany({ orderBy: { createdAt: "asc" } });
  assert.deepEqual(events.map((event) => event.eventType), ["operations.project-created.v1", "operations.project-activated.v1"]);
  assert.equal(events[1]?.aggregateId, input.projectId);
  assert.equal(events[1]?.correlationId, `${input.correlationId}:activate`);
});

test("rolls back both the Project transition and its pending event", async () => {
  const input = creation();
  const useCases = dependencies();
  await new CreateProjectUseCase(useCases).execute(input);
  await assert.rejects(() => transactions.run(async (transaction) => {
    const project = await projects.findById(input.projectId, input.context.organization.id, transaction);
    assert.ok(project);
    project.activate();
    project.recordEvent(projectEvent("ProjectActivated", project, {
      eventId: `${input.eventId}:rollback`,
      occurredAt: new Date("2026-08-14T10:02:00.000Z"),
      correlationId: `${input.correlationId}:rollback`,
      actorId: input.context.actor.user.id,
    }));
    await projects.update(project, "planned", transaction);
    await useCases.outbox.append(project.pullDomainEvents(), transaction);
    throw new Error("force rollback");
  }));
  assert.equal((await client.project.findUnique({ where: { id: input.projectId } }))?.status, "planned");
  assert.equal(await client.eventOutbox.count({ where: { eventId: `${input.eventId}:rollback` } }), 0);
});

test("uses a compare-and-set update to reject a concurrent lifecycle overwrite", async () => {
  const input = creation();
  const created = ProjectFactory.create({
    id: ProjectId.create(input.projectId),
    organizationId: OperationsOrganizationId.create(input.context.organization.id),
    partnerId: OperationsPartnerId.create(input.context.partner.id),
    workspaceId: OperationsWorkspaceId.create(input.context.workspace.id),
    name: ProjectName.create(input.name),
    createdAt: input.occurredAt,
    createdBy: input.context.actor.user.id,
    correlationId: input.correlationId,
  });
  await transactions.run((transaction) => projects.save(created, transaction));
  const update = () => transactions.run(async (transaction) => {
    const project = await projects.findById(input.projectId, input.context.organization.id, transaction);
    assert.ok(project);
    project.activate();
    await projects.update(project, "planned", transaction);
  });
  const results = await Promise.allSettled([update(), update()]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal((await client.project.findUnique({ where: { id: input.projectId } }))?.status, "active");
});

test("rehydrates the persisted lifecycle status without generating new events", async () => {
  const input = creation();
  const useCases = dependencies();
  await new CreateProjectUseCase(useCases).execute(input);
  await new ActivateProjectUseCase(useCases).execute({ ...input, eventId: `${input.eventId}:activate`, correlationId: `${input.correlationId}:activate` });
  await transactions.run(async (transaction) => {
    const restored = await projects.findById(input.projectId, input.context.organization.id, transaction);
    assert.equal(restored?.status, "active");
    assert.equal(restored?.pullDomainEvents().length, 0);
  });
});

test("keeps a committed Project when asynchronous Event Bus delivery fails", async () => {
  const input = creation();
  const useCases = dependencies();
  await new CreateProjectUseCase(useCases).execute(input);
  await new ActivateProjectUseCase(useCases).execute({ ...input, eventId: `${input.eventId}:activate`, correlationId: `${input.correlationId}:activate` });

  await assert.rejects(() => new DispatchPendingEventsUseCase(
    eventRepository,
    { materialize: async () => { throw new Error("transport unavailable"); } },
    new EventHandlerRegistry(),
    { now: () => new Date("2026-08-14T10:10:00.000Z") },
  ).execute({ workerId: "operations-test-worker" }));

  assert.equal((await client.project.findUnique({ where: { id: input.projectId } }))?.status, "active");
  assert.equal(await client.eventOutbox.count({ where: { aggregateId: input.projectId } }), 2);
});
