import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";
import { DiscoverySourceSnapshot } from "../../domain/discoverySourceSnapshot";
import { IntelligenceAnalysisFactory } from "../../domain/intelligenceAnalysisFactory";
import { AnalysisVersion, CorrelationId, DiscoverySubmissionId, DiscoverySubmissionVersion, IntelligenceAnalysisId, ModelReference, PromptTemplateVersion, SourceSnapshotId } from "../../domain/valueObjects";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { PrismaIntelligenceAnalysisRepository } from "./repositories/PrismaIntelligenceAnalysisRepository";
import { PrismaIntelligenceSnapshotRepository } from "./repositories/PrismaIntelligenceSnapshotRepository";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(client, contexts);
const analyses = new PrismaIntelligenceAnalysisRepository(contexts);
const snapshots = new PrismaIntelligenceSnapshotRepository(contexts);

function snapshot(organizationId: string = randomUUID(), submissionId: string = randomUUID(), version = 1) {
  return new DiscoverySourceSnapshot({ id: new SourceSnapshotId(randomUUID()), discoverySubmissionId: new DiscoverySubmissionId(submissionId), submissionVersion: new DiscoverySubmissionVersion(version), scopeType: "organization", organizationId, contentHash: `hash-${randomUUID()}`, classification: "internal", retentionPolicyVersion: "v1", createdAt: new Date(), payload: { answer: "synthetic" } });
}
function analysis(source: DiscoverySourceSnapshot, version = 1, correlationId = randomUUID()) {
  return IntelligenceAnalysisFactory.request({ id: new IntelligenceAnalysisId(randomUUID()), sourceSnapshotId: source.id, discoverySubmissionId: source.discoverySubmissionId, discoverySubmissionVersion: source.submissionVersion, analysisVersion: new AnalysisVersion(version), promptTemplateVersion: new PromptTemplateVersion(1), modelReference: new ModelReference("approved-model"), policyVersion: "policy-v1", requestedBy: "test-user", requestedAt: new Date(), correlationId: new CorrelationId(correlationId), requestedEvent: { eventId: randomUUID(), occurredAt: new Date(), correlationId: new CorrelationId(correlationId) } });
}

beforeEach(async () => { await client.intelligenceAnalysis.deleteMany(); await client.intelligenceSnapshot.deleteMany(); });
after(async () => { await client.intelligenceAnalysis.deleteMany(); await client.intelligenceSnapshot.deleteMany(); await client.$disconnect(); });

test("persists immutable snapshots and versioned analyses with organization isolation", async () => {
  const first = snapshot("organization-a"); const second = snapshot("organization-b");
  await transactions.run(async (context) => { await snapshots.save(first, context); await snapshots.save(second, context); await analyses.save(analysis(first), context); });
  const history = await transactions.run((context) => analyses.findHistoryByDiscoverySubmission(first.discoverySubmissionId, context));
  const isolated = await transactions.run((context) => snapshots.findByOrganization("organization-b", context));
  assert.equal(history.length, 1); assert.equal(history[0]?.sourceSnapshotId.value, first.id.value);
  assert.deepEqual(isolated.map((item) => item.id.value), [second.id.value]);
});

test("enforces idempotency and rolls back analysis writes", async () => {
  const source = snapshot(); const correlation = randomUUID();
  await transactions.run((context) => snapshots.save(source, context));
  const original = analysis(source, 1, correlation);
  await transactions.run((context) => analyses.save(original, context));
  assert.equal((await transactions.run((context) => analyses.findByCorrelationId(new CorrelationId(correlation), source.id, context)))?.id.value, original.id.value);
  await assert.rejects(() => transactions.run((context) => analyses.save(analysis(source, 2, correlation), context)));
  const rollback = analysis(source, 3);
  await assert.rejects(() => transactions.run(async (context) => { await analyses.save(rollback, context); throw new Error("rollback"); }));
  assert.equal(await transactions.run((context) => analyses.findById(rollback.id, context)), null);
});
