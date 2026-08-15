import assert from "node:assert/strict";
import test from "node:test";
import type { TransactionContext, TransactionRunner } from "../../../lead-lifecycle/ports/TransactionRunner";
import { DriveReferenceSyncError } from "../../domain/errors";
import type { DriveFolderGateway } from "../../ports/DriveFolderGateway";
import type { ProjectDocumentReferenceRepository } from "../../ports/ProjectDocumentReferenceRepository";
import type { ProjectDocumentReference, ProjectDocumentReferenceScope } from "../../ports/ProjectDocumentReferencePort";
import { DriveProjectDocumentReferenceAdapter } from "./DriveProjectDocumentReferenceAdapter";
import { GoogleDriveFolderGateway } from "./GoogleDriveFolderGateway";

const scope = { projectId: "project-1", organizationId: "org-1", partnerId: "partner-1", workspaceId: "workspace-1" };
const request = { ...scope, projectName: "Identity renewal", idempotencyKey: "project-drive:project-1" };

class MemoryReferences implements ProjectDocumentReferenceRepository {
  value: ProjectDocumentReference | null = null;
  async findByProject(input: ProjectDocumentReferenceScope): Promise<ProjectDocumentReference | null> {
    return this.value && sameScope(this.value, input) ? this.value : null;
  }
  async beginSync(input: { scope: ProjectDocumentReferenceScope; idempotencyKey: string; now: Date }): Promise<ProjectDocumentReference> {
    this.value = {
      id: this.value?.id ?? "reference-1", ...input.scope, provider: "google_drive", externalReference: this.value?.externalReference ?? null,
      externalUrl: this.value?.externalUrl ?? null, idempotencyKey: input.idempotencyKey, status: "pending", lastError: null,
      attemptCount: (this.value?.attemptCount ?? 0) + 1, createdAt: this.value?.createdAt ?? input.now, updatedAt: input.now,
    };
    return this.value;
  }
  async completeSync(input: { scope: ProjectDocumentReferenceScope; idempotencyKey: string; externalReference: string; externalUrl: string; now: Date }): Promise<ProjectDocumentReference> {
    if (!this.value) throw new Error("missing reference");
    this.value = { ...this.value, ...input.scope, idempotencyKey: input.idempotencyKey, externalReference: input.externalReference, externalUrl: input.externalUrl, status: "linked", lastError: null, updatedAt: input.now };
    return this.value;
  }
  async failSync(input: { scope: ProjectDocumentReferenceScope; idempotencyKey: string; error: string; now: Date }): Promise<ProjectDocumentReference> {
    if (!this.value) throw new Error("missing reference");
    this.value = { ...this.value, ...input.scope, idempotencyKey: input.idempotencyKey, status: "failed", lastError: input.error, updatedAt: input.now };
    return this.value;
  }
  async listByProject(input: ProjectDocumentReferenceScope): Promise<readonly ProjectDocumentReference[]> {
    return this.value && sameScope(this.value, input) ? [this.value] : [];
  }
}

const transactions: TransactionRunner = { run: <T>(operation: (value: TransactionContext) => Promise<T>) => operation({}) };
const sameScope = (left: ProjectDocumentReferenceScope, right: ProjectDocumentReferenceScope) => left.projectId === right.projectId && left.organizationId === right.organizationId && left.partnerId === right.partnerId && left.workspaceId === right.workspaceId;

test("persists one canonical Drive folder and does not call Drive again on an idempotent retry", async () => {
  const references = new MemoryReferences(); let calls = 0;
  const drive: DriveFolderGateway = { ensureProjectFolder: async () => { calls += 1; return { folderId: "folder-1", folderUrl: "https://drive.google.test/folder-1" }; } };
  const adapter = new DriveProjectDocumentReferenceAdapter(transactions, references, drive, () => new Date("2026-08-15T10:00:00.000Z"));
  const first = await adapter.ensureCanonicalReference(request);
  const repeated = await adapter.ensureCanonicalReference(request);
  assert.equal(first.externalReference, "folder-1");
  assert.equal(repeated.externalReference, "folder-1");
  assert.equal(references.value?.attemptCount, 1);
  assert.equal(calls, 1);
});

test("records a retryable failure without producing a reference, then completes the same canonical sync", async () => {
  const references = new MemoryReferences(); let attempts = 0;
  const drive: DriveFolderGateway = { ensureProjectFolder: async () => {
    attempts += 1;
    if (attempts === 1) throw new DriveReferenceSyncError();
    return { folderId: "folder-1", folderUrl: "https://drive.google.test/folder-1" };
  } };
  const adapter = new DriveProjectDocumentReferenceAdapter(transactions, references, drive);
  await assert.rejects(() => adapter.ensureCanonicalReference(request), DriveReferenceSyncError);
  assert.equal(references.value?.status, "failed");
  assert.equal(references.value?.externalReference, null);
  const linked = await adapter.ensureCanonicalReference(request);
  assert.equal(linked.status, "linked");
  assert.equal(linked.externalReference, "folder-1");
  assert.equal(linked.attemptCount, 2);
});

test("Google Drive adapter finds the existing folder before creating a duplicate", async () => {
  const calls: { method?: string; url: string }[] = [];
  const gateway = new GoogleDriveFolderGateway({
    accessToken: "test-token",
    fetch: async (url, init) => {
      calls.push({ method: init?.method, url });
      return new Response(JSON.stringify({ files: [{ id: "folder-1" }] }), { status: 200 });
    },
  });
  const result = await gateway.ensureProjectFolder(request);
  assert.equal(result.folderId, "folder-1");
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.method, "GET");
});

test("Google Drive adapter creates a folder with the immutable canonical reference key when absent", async () => {
  const requests: { method?: string; body?: string }[] = [];
  const responses = [
    new Response(JSON.stringify({ files: [] }), { status: 200 }),
    new Response(JSON.stringify({ id: "folder-created", webViewLink: "https://drive.google.test/folder-created" }), { status: 200 }),
  ];
  const gateway = new GoogleDriveFolderGateway({
    accessToken: "test-token",
    rootFolderId: "root-folder",
    fetch: async (_url, init) => {
      requests.push({ method: init?.method, body: typeof init?.body === "string" ? init.body : undefined });
      const response = responses.shift();
      if (!response) throw new Error("unexpected request");
      return response;
    },
  });
  const result = await gateway.ensureProjectFolder(request);
  assert.equal(result.folderId, "folder-created");
  assert.equal(requests.map((entry) => entry.method).join(","), "GET,POST");
  assert.match(requests[1]?.body ?? "", /kyrumaReferenceKey/);
  assert.match(requests[1]?.body ?? "", /project-drive:project-1/);
});
