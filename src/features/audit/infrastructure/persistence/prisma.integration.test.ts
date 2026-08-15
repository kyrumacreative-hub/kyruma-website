import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { RecordAuditEventUseCase } from "../../application/useCases";
import { AuditContractRegistry } from "../../domain/contracts";
import { AuditIntegrityConflictError } from "../../domain/errors";
import type { AuditWriteRequest } from "../../domain/types";
import { PrismaAuditRepository } from "./PrismaAuditRepository";

const prisma = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(prisma, contexts);
const repository = new PrismaAuditRepository(prisma, contexts);
const contracts = new AuditContractRegistry();
contracts.register({ eventType: "workspace.activated.v1", schemaVersion: 1, metadataFields: ["channel"], changeFields: ["status"] });
const clock = { now: () => new Date("2026-08-15T09:00:00.000Z") };
const recorder = new RecordAuditEventUseCase(repository, contracts, clock);
const request = (organizationId: string, correlationId: string): AuditWriteRequest => ({ eventType: "workspace.activated.v1", occurredAt: new Date("2026-08-15T08:59:00.000Z"), actorId: "actor-1", actorType: "user", organizationId, partnerId: "partner-1", workspaceId: "workspace-1", resourceType: "Workspace", resourceId: "workspace-1", action: "activate", result: "success", correlationId, causationId: "cause-1", requestId: "request-1", source: "workspace", metadata: { channel: "application" }, changes: { status: "active" }, schemaVersion: 1, classification: "internal", retentionCategory: "operational_activity", policyVersion: "audit-v1" });

test.after(async () => prisma.$disconnect());

test("persists immutable evidence, enforces tenant scope and returns idempotently", async () => {
  const organizationId = `org-${randomUUID()}`; const correlationId = randomUUID();
  const first = await transactions.run((tx) => recorder.execute(request(organizationId, correlationId), tx));
  const repeated = await transactions.run((tx) => recorder.execute(request(organizationId, correlationId), tx));
  assert.equal(repeated.properties.id, first.properties.id);
  assert.equal((await repository.findById(first.properties.id, organizationId))?.properties.causationId, "cause-1");
  assert.equal(await repository.findById(first.properties.id, "another-org"), null);
  const page = await repository.search({ organizationId, from: new Date("2026-08-15T00:00:00Z"), to: new Date("2026-08-16T00:00:00Z"), limit: 10, includeRestrictedSecurity: true });
  assert.equal(page.events.length, 1); assert.equal(page.hasMore, false);
  await assert.rejects(() => transactions.run((tx) => recorder.execute({ ...request(organizationId, correlationId), changes: { status: "paused" } }, tx)), AuditIntegrityConflictError);
  await assert.rejects(() => prisma.$executeRawUnsafe(`UPDATE "AuditEvent" SET "action" = 'tamper' WHERE "id" = '${first.properties.id}'`), /append-only/);
  await assert.rejects(() => prisma.$executeRawUnsafe(`DELETE FROM "AuditEvent" WHERE "id" = '${first.properties.id}'`), /append-only/);
});

test("rolls back Audit evidence with the shared transaction", async () => {
  const organizationId = `org-${randomUUID()}`; const correlationId = randomUUID(); let id = "";
  await assert.rejects(() => transactions.run(async (tx) => { const event = await recorder.execute(request(organizationId, correlationId), tx); id = event.properties.id; throw new Error("force rollback"); }), /force rollback/);
  assert.equal(await repository.findById(id, organizationId), null);
});

test("persists privacy, retention and export evidence as append-only records", async () => {
  const organizationId = `org-${randomUUID()}`; const correlationId = randomUUID();
  const event = await transactions.run((tx) => recorder.execute(request(organizationId, correlationId), tx));
  const overlayId = randomUUID(); const exportId = randomUUID(); const retentionId = randomUUID();
  await transactions.run(async (tx) => {
    await repository.appendPrivacyOverlay({ id: overlayId, auditEventId: event.properties.id, organizationId, actorId: "actor-privacy", policyVersion: "privacy-v1", reason: "approved anonymization", replacements: { actorId: "masked" }, createdAt: clock.now() }, tx);
    await repository.saveExport({ id: exportId, organizationId, requestedBy: "actor-export", from: new Date("2026-08-01T00:00:00Z"), to: clock.now(), format: "json", profile: "security", rowCount: 1, artifactReference: "artifact://audit/test", expiresAt: new Date("2026-08-15T10:00:00Z"), createdAt: clock.now() }, tx);
    await repository.saveRetentionExecution({ id: retentionId, organizationId, policyVersion: "retention-v1", category: "operational_activity", dryRun: true, affectedCount: 1, executedBy: "actor-retention", executedAt: clock.now() }, tx);
  });
  assert.equal((await prisma.auditPrivacyOverlay.findUnique({ where: { id: overlayId } }))?.policyVersion, "privacy-v1");
  assert.equal((await prisma.auditExportEvidence.findUnique({ where: { id: exportId } }))?.rowCount, 1);
  assert.equal((await prisma.auditRetentionExecution.findUnique({ where: { id: retentionId } }))?.dryRun, true);
  assert.equal(await repository.countRetentionCandidates({ organizationId, category: "operational_activity", before: new Date("2026-08-16T00:00:00Z") }), 1);
  await assert.rejects(() => prisma.auditPrivacyOverlay.update({ where: { id: overlayId }, data: { reason: "tamper" } }), /append-only/);
});
