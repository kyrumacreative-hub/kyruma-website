import assert from "node:assert/strict";
import test from "node:test";
import { IncompleteDiscoverySourceError, InvalidConfidenceScoreError, InvalidSnapshotMetadataError } from "./errors";
import { ConfidenceAssessmentService, IntelligenceAnalysisService, IntelligenceSnapshotService, type CompletedDiscoverySource } from "./services";
import {
  AnalysisVersion,
  CorrelationId,
  DiscoverySubmissionId,
  DiscoverySubmissionVersion,
  IntelligenceAnalysisId,
  ModelReference,
  PromptTemplateVersion,
  SourceSnapshotId,
} from "./valueObjects";

const source: CompletedDiscoverySource = {
  status: "completed",
  discoverySubmissionId: new DiscoverySubmissionId("submission-1"),
  submissionVersion: new DiscoverySubmissionVersion(3),
  scopeType: "organization",
  organizationId: "organization-1",
  contentHash: "hash-v1",
  classification: "internal",
  retentionPolicyVersion: "retention-v1",
  payload: { objectives: ["growth"], profile: { market: "creative" } },
};

function event(eventId: string) {
  return { eventId, occurredAt: new Date("2026-08-05T11:00:00.000Z"), correlationId: new CorrelationId("correlation-1") };
}

test("snapshot service creates a versioned immutable snapshot and official event", () => {
  const result = new IntelligenceSnapshotService().create(source, new SourceSnapshotId("snapshot-1"), new Date("2026-08-05T11:00:00.000Z"), event("snapshot-event-1"));
  const originalPayload = source.payload as { objectives: string[]; profile: { market: string } };
  originalPayload.objectives[0] = "changed outside snapshot";
  originalPayload.profile.market = "changed outside snapshot";

  assert.equal(result.snapshot.submissionVersion.value, 3);
  assert.deepEqual(result.snapshot.payload, { objectives: ["growth"], profile: { market: "creative" } });
  assert.equal(Object.isFrozen(result.snapshot.payload), true);
  assert.equal(result.event.type, "DiscoverySourceSnapshotted");
  assert.equal(result.event.aggregateId, "snapshot-1");
  assert.equal(result.event.aggregateType, "DiscoverySourceSnapshot");
  assert.equal(result.event.version, 1);
});

test("snapshot service rejects a source that is not completed at runtime", () => {
  const incomplete = { ...source, status: "in_progress" } as unknown as CompletedDiscoverySource;
  assert.throws(
    () => new IntelligenceSnapshotService().create(incomplete, new SourceSnapshotId("snapshot-1"), new Date(), event("snapshot-event-1")),
    IncompleteDiscoverySourceError,
  );
});

test("snapshot model validates audit metadata", () => {
  const invalidSource = { ...source, contentHash: "" };
  assert.throws(
    () => new IntelligenceSnapshotService().create(invalidSource, new SourceSnapshotId("snapshot-1"), new Date(), event("snapshot-event-1")),
    InvalidSnapshotMetadataError,
  );
});

test("confidence assessment only validates an informative confidence supplied by analysis", () => {
  const service = new ConfidenceAssessmentService();
  assert.equal(service.assess(0.62).value, 0.62);
  assert.throws(() => service.assess(-0.01), InvalidConfidenceScoreError);
});

test("analysis service delegates creation to the canonical factory", () => {
  const analysis = new IntelligenceAnalysisService().request({
    id: new IntelligenceAnalysisId("analysis-1"),
    sourceSnapshotId: new SourceSnapshotId("snapshot-1"),
    discoverySubmissionId: new DiscoverySubmissionId("submission-1"),
    discoverySubmissionVersion: new DiscoverySubmissionVersion(3),
    analysisVersion: new AnalysisVersion(1),
    promptTemplateVersion: new PromptTemplateVersion(1),
    modelReference: new ModelReference("approved-model-v1"),
    policyVersion: "policy-v1",
    requestedBy: "user-1",
    requestedAt: new Date(),
    correlationId: new CorrelationId("correlation-1"),
    requestedEvent: event("analysis-requested-1"),
  });

  assert.equal(analysis.status, "requested");
  assert.equal(analysis.pullDomainEvents()[0].type, "IntelligenceAnalysisRequested");
});
