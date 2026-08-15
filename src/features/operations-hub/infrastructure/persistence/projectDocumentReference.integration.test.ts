import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";

import type { ResolvedPartnerContext } from "../../../partner-context/domain/types";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { EnsureProjectDriveReferenceUseCase } from "../../application/projectDriveReferenceUseCases";
import { CreateProjectUseCase, OperationsHubApplicationError } from "../../application/useCases";
import { DriveReferenceSyncError } from "../../domain/errors";
import type { DriveFolderGateway } from "../../ports/DriveFolderGateway";
import { ProjectEventOutbox } from "../../ports/ProjectEventOutbox";
import { DriveProjectDocumentReferenceAdapter } from "../drive/DriveProjectDocumentReferenceAdapter";
import { PrismaProjectDocumentReferenceRepository } from "./repositories/PrismaProjectDocumentReferenceRepository";
import { PrismaProjectRepository } from "./repositories/PrismaProjectRepository";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(client, contexts);
const projects = new PrismaProjectRepository(contexts);
const referenceRepository = new PrismaProjectDocumentReferenceRepository(contexts, randomUUID);
const noEvents: ProjectEventOutbox = { append: async () => undefined };

function context(workspaceId: string, organizationId: string, partnerId: string): ResolvedPartnerContext {
  return {
    contextKey: `context-${workspaceId}`,
    actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "ops@kyruma.test" }, memberships: [] },
    membership: { id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId, partnerId, workspaceId } },
    organization: { id: organizationId, displayName: "KYRUMA" },
    partner: { id: partnerId, publicId: "KYR-002", status: "active", displayName: "Partner" },
    workspace: { id: workspaceId, displayName: "KYR-002", access: "internal" },
    capabilities: new Set(["project.create", "project.read"] as never[]),
    allowedVisibilities: ["internal"],
  };
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
    occurredAt: new Date("2026-08-15T10:00:00.000Z"),
    correlationId: `correlation-${suffix}`,
  };
}

async function createProject(input: ReturnType<typeof creation>): Promise<void> {
  await new CreateProjectUseCase({ transactions, projects, outbox: noEvents }).execute(input);
}

beforeEach(async () => {
  await client.projectDocumentReference.deleteMany();
  await client.project.deleteMany();
});
after(async () => {
  await client.projectDocumentReference.deleteMany();
  await client.project.deleteMany();
  await client.$disconnect();
});

test("persists one canonical Google Drive reference for a Project and returns it idempotently", async () => {
  const input = creation(); await createProject(input);
  let driveCalls = 0;
  const drive: DriveFolderGateway = { ensureProjectFolder: async () => { driveCalls += 1; return { folderId: `folder-${input.projectId}`, folderUrl: "https://drive.google.test/folder" }; } };
  const references = new DriveProjectDocumentReferenceAdapter(transactions, referenceRepository, drive);
  const useCase = new EnsureProjectDriveReferenceUseCase(transactions, projects, references);
  const first = await useCase.execute({ context: input.context, projectId: input.projectId });
  const repeated = await useCase.execute({ context: input.context, projectId: input.projectId });
  const stored = await client.projectDocumentReference.findUnique({ where: { projectId: input.projectId } });
  assert.equal(first.folderId, `folder-${input.projectId}`);
  assert.deepEqual(repeated, first);
  assert.equal(driveCalls, 1);
  assert.deepEqual(stored && { organizationId: stored.organizationId, partnerId: stored.partnerId, workspaceId: stored.workspaceId, status: stored.status, attemptCount: stored.attemptCount }, { organizationId: input.context.organization.id, partnerId: input.context.partner.id, workspaceId: input.context.workspace.id, status: "linked", attemptCount: 1 });
});

test("isolates a Project document reference by Organization and Workspace", async () => {
  const input = creation(); await createProject(input);
  const drive: DriveFolderGateway = { ensureProjectFolder: async () => ({ folderId: "folder-1", folderUrl: "https://drive.google.test/folder-1" }) };
  const useCase = new EnsureProjectDriveReferenceUseCase(transactions, projects, new DriveProjectDocumentReferenceAdapter(transactions, referenceRepository, drive));
  await assert.rejects(() => useCase.execute({ context: context("workspace-other", input.context.organization.id, input.context.partner.id), projectId: input.projectId }), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "NOT_FOUND");
  await assert.rejects(() => useCase.execute({ context: context(input.context.workspace.id, "org-other", input.context.partner.id), projectId: input.projectId }), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "NOT_FOUND");
  assert.equal(await client.projectDocumentReference.count(), 0);
});

test("records a failed Drive attempt, preserves the Project, and safely retries to the canonical folder", async () => {
  const input = creation(); await createProject(input);
  let calls = 0;
  const drive: DriveFolderGateway = { ensureProjectFolder: async () => {
    calls += 1;
    if (calls === 1) throw new DriveReferenceSyncError();
    return { folderId: "folder-retry", folderUrl: "https://drive.google.test/folder-retry" };
  } };
  const useCase = new EnsureProjectDriveReferenceUseCase(transactions, projects, new DriveProjectDocumentReferenceAdapter(transactions, referenceRepository, drive));
  await assert.rejects(() => useCase.execute({ context: input.context, projectId: input.projectId }), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "DRIVE_SYNC_FAILED");
  const failed = await client.projectDocumentReference.findUnique({ where: { projectId: input.projectId } });
  assert.deepEqual(failed && { status: failed.status, externalReference: failed.externalReference, attemptCount: failed.attemptCount }, { status: "failed", externalReference: null, attemptCount: 1 });
  assert.equal((await client.project.findUnique({ where: { id: input.projectId } }))?.status, "planned");
  const retried = await useCase.execute({ context: input.context, projectId: input.projectId });
  assert.equal(retried.folderId, "folder-retry");
  assert.equal((await client.projectDocumentReference.findUnique({ where: { projectId: input.projectId } }))?.attemptCount, 2);
  assert.equal(await client.projectDocumentReference.count(), 1);
});
