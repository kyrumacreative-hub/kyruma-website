import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedPartnerContext } from "../../partner-context/domain/types";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { ProjectFactory } from "../domain/projectFactory";
import { OperationsOrganizationId, OperationsPartnerId, OperationsWorkspaceId, ProjectId, ProjectName } from "../domain/valueObjects";
import type { ProjectDocumentReference, ProjectDocumentReferencePort } from "../ports/ProjectDocumentReferencePort";
import type { ProjectRepository } from "../ports/ProjectRepository";
import { OperationsHubApplicationError } from "./useCases";
import { EnsureProjectDriveReferenceUseCase } from "./projectDriveReferenceUseCases";

const context = (capabilities = ["project.read"], workspaceId = "workspace-1", organizationId = "org-1"): ResolvedPartnerContext => ({
  contextKey: "context-1",
  actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "ops@kyruma.test" }, memberships: [] },
  membership: { id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId, partnerId: "partner-1", workspaceId } },
  organization: { id: organizationId, displayName: "KYRUMA" },
  partner: { id: "partner-1", publicId: "KYR-001", status: "active", displayName: "Partner" },
  workspace: { id: workspaceId, displayName: "KYR-001", access: "internal" },
  capabilities: new Set(capabilities as never[]),
  allowedVisibilities: ["internal"],
});

const project = () => ProjectFactory.create({
  id: ProjectId.create("project-1"),
  organizationId: OperationsOrganizationId.create("org-1"),
  partnerId: OperationsPartnerId.create("partner-1"),
  workspaceId: OperationsWorkspaceId.create("workspace-1"),
  name: ProjectName.create("Identity renewal"),
  createdAt: new Date("2026-08-15T10:00:00.000Z"),
  createdBy: "user-1",
  correlationId: "correlation-1",
});

function dependencies() {
  const current = project();
  const transactions: TransactionRunner = { run: <T>(operation: (value: TransactionContext) => Promise<T>) => operation({}) };
  const projects: ProjectRepository = {
    save: async () => undefined,
    update: async () => undefined,
    findById: async (id, organizationId) => id === current.id.value && organizationId === current.organizationId.value ? current : null,
    findByCorrelationId: async () => null,
  };
  let calls = 0;
  const reference: ProjectDocumentReference = {
    id: "reference-1", projectId: current.id.value, organizationId: current.organizationId.value,
    partnerId: current.partnerId.value, workspaceId: current.workspaceId.value, provider: "google_drive",
    externalReference: "folder-1", externalUrl: "https://drive.google.test/folder-1", idempotencyKey: "project-drive:project-1",
    status: "linked", lastError: null, attemptCount: 1, createdAt: new Date(), updatedAt: new Date(),
  };
  const references: ProjectDocumentReferencePort = {
    ensureCanonicalReference: async () => { calls += 1; return reference; },
    listByProject: async () => [reference],
  };
  return { current, references, calls: () => calls, useCase: new EnsureProjectDriveReferenceUseCase(transactions, projects, references) };
}

test("returns the Project canonical Drive reference through the authorized application boundary", async () => {
  const fake = dependencies();
  const result = await fake.useCase.execute({ context: context(), projectId: "project-1" });
  assert.deepEqual(result, { projectId: "project-1", provider: "google_drive", folderId: "folder-1", folderUrl: "https://drive.google.test/folder-1", status: "linked" });
  assert.equal(fake.calls(), 1);
});

test("denies missing access and hides Projects from another Organization or Workspace", async () => {
  const fake = dependencies();
  await assert.rejects(() => fake.useCase.execute({ context: context([]), projectId: "project-1" }), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "FORBIDDEN");
  await assert.rejects(() => fake.useCase.execute({ context: context(["project.read"], "workspace-2"), projectId: "project-1" }), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "NOT_FOUND");
  await assert.rejects(() => fake.useCase.execute({ context: context(["project.read"], "workspace-1", "org-2"), projectId: "project-1" }), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "NOT_FOUND");
  assert.equal(fake.calls(), 0);
});
