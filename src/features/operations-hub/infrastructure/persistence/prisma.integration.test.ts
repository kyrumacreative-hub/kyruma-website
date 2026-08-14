import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";

import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import type { ResolvedPartnerContext } from "../../../partner-context/domain/types";
import type { ProjectDomainEvent } from "../../domain/events";
import { ProjectFactory } from "../../domain/projectFactory";
import { OperationsOrganizationId, OperationsPartnerId, OperationsWorkspaceId, ProjectId, ProjectName } from "../../domain/valueObjects";
import { CreateProjectUseCase, OperationsHubApplicationError } from "../../application/useCases";
import { PrismaProjectRepository } from "./repositories/PrismaProjectRepository";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(client, contexts);
const projects = new PrismaProjectRepository(contexts);

function project(suffix: string = randomUUID(), organizationId = `org-${suffix}`) {
  return ProjectFactory.create({
    id: ProjectId.create(`project-${suffix}`),
    organizationId: OperationsOrganizationId.create(organizationId),
    partnerId: OperationsPartnerId.create(`partner-${suffix}`),
    workspaceId: OperationsWorkspaceId.create(`workspace-${suffix}`),
    name: ProjectName.create("Identity renewal"),
    createdAt: new Date("2026-08-14T10:00:00.000Z"),
    createdBy: "user-1",
    correlationId: `correlation-${suffix}`,
  });
}

function context(workspaceId: string, organizationId: string, partnerId: string): ResolvedPartnerContext {
  return {
    contextKey: `context-${workspaceId}`,
    actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "ops@kyruma.test" }, memberships: [] },
    membership: { id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId, partnerId, workspaceId } },
    organization: { id: organizationId, displayName: "KYRUMA" },
    partner: { id: partnerId, publicId: "KYR-001", status: "active", displayName: "Partner" },
    workspace: { id: workspaceId, displayName: "KYR-001", access: "internal" },
    capabilities: new Set(["project.create"]),
    allowedVisibilities: ["internal"],
  };
}

beforeEach(async () => { await client.project.deleteMany(); });
after(async () => { await client.project.deleteMany(); await client.$disconnect(); });

test("commits, rehydrates and preserves Project scope and status", async () => {
  const value = project();
  value.activate();
  await transactions.run((transaction) => projects.save(value, transaction));
  await transactions.run(async (transaction) => {
    const restored = await projects.findById(value.id.value, value.organizationId.value, transaction);
    assert.deepEqual(
      restored && { id: restored.id.value, organizationId: restored.organizationId.value, partnerId: restored.partnerId.value, workspaceId: restored.workspaceId.value, status: restored.status, correlationId: restored.correlationId },
      { id: value.id.value, organizationId: value.organizationId.value, partnerId: value.partnerId.value, workspaceId: value.workspaceId.value, status: "active", correlationId: value.correlationId },
    );
  });
});

test("isolates Project reads by Organization", async () => {
  const value = project();
  await transactions.run((transaction) => projects.save(value, transaction));
  await transactions.run(async (transaction) => {
    assert.equal(await projects.findById(value.id.value, "org-other", transaction), null);
    assert.equal((await projects.findById(value.id.value, value.organizationId.value, transaction))?.workspaceId.value, value.workspaceId.value);
  });
});

test("enforces idempotency with the unique correlation constraint", async () => {
  const first = project("same-correlation");
  const duplicate = project("different-id");
  const duplicateWithSameCorrelation = ProjectFactory.create({
    id: duplicate.id,
    organizationId: duplicate.organizationId,
    partnerId: duplicate.partnerId,
    workspaceId: duplicate.workspaceId,
    name: duplicate.name,
    createdAt: duplicate.createdAt,
    createdBy: duplicate.createdBy,
    correlationId: first.correlationId,
  });
  await transactions.run((transaction) => projects.save(first, transaction));
  await assert.rejects(() => transactions.run((transaction) => projects.save(duplicateWithSameCorrelation, transaction)));
  assert.equal(await client.project.count({ where: { correlationId: first.correlationId } }), 1);
});

test("rolls back a Project written through the shared TransactionRunner", async () => {
  const value = project();
  await assert.rejects(() => transactions.run(async (transaction) => {
    await projects.save(value, transaction);
    throw new Error("force rollback");
  }));
  assert.equal(await client.project.findUnique({ where: { id: value.id.value } }), null);
});

test("does not dispatch Project events when PostgreSQL persistence fails", async () => {
  const first = project("existing");
  await transactions.run((transaction) => projects.save(first, transaction));
  const dispatched: (readonly ProjectDomainEvent[])[] = [];
  const useCase = new CreateProjectUseCase({
    transactions,
    projects,
    events: { dispatch: async (events) => { dispatched.push(events); } },
  });
  await assert.rejects(
    () => useCase.execute({
      context: context(`workspace-new`, `org-new`, `partner-new`),
      projectId: first.id.value,
      name: "Will fail",
      eventId: "event-fail",
      occurredAt: new Date(),
      correlationId: "correlation-new",
    }),
    (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "PERSISTENCE",
  );
  assert.equal(dispatched.length, 0);
});
