import assert from "node:assert/strict";
import test from "node:test";
import { DiscoverySourceSnapshot } from "../../domain/discoverySourceSnapshot";
import { IntelligenceAnalysisFactory } from "../../domain/intelligenceAnalysisFactory";
import {
  AnalysisVersion,
  ConfidenceScore,
  CorrelationId,
  DiscoverySubmissionId,
  DiscoverySubmissionVersion,
  IntelligenceAnalysisId,
  ModelReference,
  ModelRunId,
  PromptTemplateVersion,
  SourceSnapshotId,
} from "../../domain/valueObjects";
import type { IntelligenceAnalysisReadModel, IntelligenceAnalysisHistoryReadModel, IntelligenceSnapshotReadModel } from "../../ports/readModels";
import type { TransactionRunner } from "../../../lead-lifecycle/ports/TransactionRunner";
import { DiscoverySourceSnapshotMapper } from "./discoverySourceSnapshotMapper";
import { IntelligenceAnalysisMapper } from "./intelligenceAnalysisMapper";
import { PrismaIntelligenceAnalysisRepository } from "./repositories/PrismaIntelligenceAnalysisRepository";
import { PrismaIntelligenceSnapshotRepository } from "./repositories/PrismaIntelligenceSnapshotRepository";
import { PrismaTransactionContextMissingError, PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";

function event(eventId: string) {
  return { eventId, occurredAt: new Date("2026-08-05T12:00:00.000Z"), correlationId: new CorrelationId("correlation-1") };
}

function analysis() {
  return IntelligenceAnalysisFactory.request({
    id: new IntelligenceAnalysisId("analysis-1"),
    sourceSnapshotId: new SourceSnapshotId("snapshot-1"),
    discoverySubmissionId: new DiscoverySubmissionId("submission-1"),
    discoverySubmissionVersion: new DiscoverySubmissionVersion(1),
    analysisVersion: new AnalysisVersion(1),
    promptTemplateVersion: new PromptTemplateVersion(1),
    modelReference: new ModelReference("approved-model-v1"),
    policyVersion: "policy-v1",
    requestedBy: "user-1",
    requestedAt: new Date("2026-08-05T12:00:00.000Z"),
    correlationId: new CorrelationId("correlation-1"),
    requestedEvent: event("event-requested"),
  });
}

test("analysis mapper round-trips a generated aggregate without pending events", () => {
  const original = analysis();
  original.startProcessing(new ModelRunId("run-1"), event("event-started"));
  original.markGenerated(new ConfidenceScore(0.75), new Date("2026-08-05T12:01:00.000Z"), event("event-generated"));
  const restored = IntelligenceAnalysisMapper.toDomain(IntelligenceAnalysisMapper.toPersistence(original));

  assert.equal(restored.status, "generated");
  assert.equal(restored.confidence?.value, 0.75);
  assert.equal(restored.modelRunId?.value, "run-1");
  assert.equal(restored.pullDomainEvents().length, 0);
});

test("snapshot mapper round-trips an immutable, versioned source snapshot", () => {
  const original = new DiscoverySourceSnapshot({
    id: new SourceSnapshotId("snapshot-1"),
    discoverySubmissionId: new DiscoverySubmissionId("submission-1"),
    submissionVersion: new DiscoverySubmissionVersion(2),
    scopeType: "organization",
    organizationId: "organization-1",
    contentHash: "hash-1",
    classification: "internal",
    retentionPolicyVersion: "retention-v1",
    createdAt: new Date("2026-08-05T12:00:00.000Z"),
    payload: { answer: "original" },
  });
  const restored = DiscoverySourceSnapshotMapper.toDomain(DiscoverySourceSnapshotMapper.toPersistence(original));

  assert.equal(restored.submissionVersion.value, 2);
  assert.deepEqual(restored.payload, { answer: "original" });
  assert.equal(Object.isFrozen(restored.payload), true);
});

test("Prisma adapters require a real transaction context", async () => {
  const contexts = new PrismaTransactionContextStore();
  const repository = new PrismaIntelligenceAnalysisRepository(contexts);
  const snapshots = new PrismaIntelligenceSnapshotRepository(contexts);
  const context = {};

  await assert.rejects(() => repository.findById(new IntelligenceAnalysisId("analysis-1"), context), PrismaTransactionContextMissingError);
  await assert.rejects(() => snapshots.findById(new SourceSnapshotId("snapshot-1"), context), PrismaTransactionContextMissingError);
});

test("transaction runner remains an opaque callback contract", async () => {
  const runner: TransactionRunner = { run: async (operation) => operation({}) };
  const result = await runner.run(async () => "committed");
  assert.equal(result, "committed");
});

test("read models express analysis, snapshot, confidence, and history without persistence details", () => {
  const analysisRead: IntelligenceAnalysisReadModel = {
    id: "analysis-1", sourceSnapshotId: "snapshot-1", discoverySubmissionId: "submission-1", discoverySubmissionVersion: 1,
    analysisVersion: 1, status: "generated", confidence: 0.75, requestedAt: new Date(), generatedAt: new Date(),
  };
  const snapshotRead: IntelligenceSnapshotReadModel = {
    id: "snapshot-1", discoverySubmissionId: "submission-1", submissionVersion: 1, contentHash: "hash-1", classification: "internal", createdAt: new Date(),
  };
  const historyRead: IntelligenceAnalysisHistoryReadModel = {
    analysisId: "analysis-1", analysisVersion: 1, status: "approved", reviewDecision: "approved", occurredAt: new Date(),
  };

  assert.equal(analysisRead.confidence, 0.75);
  assert.equal(snapshotRead.contentHash, "hash-1");
  assert.equal(historyRead.status, "approved");
});
