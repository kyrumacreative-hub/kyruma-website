import assert from "node:assert/strict";
import test from "node:test";
import { InvalidAnalysisStateTransitionError, InvalidConfidenceScoreError, InvalidReviewDecisionError } from "./errors";
import { IntelligenceAnalysisFactory } from "./intelligenceAnalysisFactory";
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
  ReviewDecision,
  SourceSnapshotId,
} from "./valueObjects";

function event(eventId: string) {
  return {
    eventId,
    occurredAt: new Date("2026-08-05T10:00:00.000Z"),
    correlationId: new CorrelationId("correlation-1"),
  };
}

function requestedAnalysis() {
  return IntelligenceAnalysisFactory.request({
    id: new IntelligenceAnalysisId("analysis-1"),
    sourceSnapshotId: new SourceSnapshotId("snapshot-1"),
    discoverySubmissionId: new DiscoverySubmissionId("submission-1"),
    discoverySubmissionVersion: new DiscoverySubmissionVersion(1),
    analysisVersion: new AnalysisVersion(1),
    promptTemplateVersion: new PromptTemplateVersion(2),
    modelReference: new ModelReference("approved-model-v1"),
    policyVersion: "policy-v1",
    requestedBy: "user-1",
    requestedAt: new Date("2026-08-05T10:00:00.000Z"),
    correlationId: new CorrelationId("correlation-1"),
    requestedEvent: event("event-requested"),
  });
}

test("factory creates an analysis in requested state with immutable source provenance", () => {
  const analysis = requestedAnalysis();

  assert.equal(analysis.status, "requested");
  assert.equal(analysis.sourceSnapshotId.value, "snapshot-1");
  assert.equal(analysis.discoverySubmissionVersion.value, 1);
  assert.equal(analysis.analysisVersion.value, 1);
  assert.equal(analysis.promptTemplateVersion.value, 2);
  assert.equal(analysis.correlationId.value, "correlation-1");
});

test("analysis follows the approved generation and human-review lifecycle", () => {
  const analysis = requestedAnalysis();
  const generatedAt = new Date("2026-08-05T10:01:00.000Z");

  analysis.startProcessing(new ModelRunId("model-run-1"), event("event-started"));
  analysis.markGenerated(new ConfidenceScore(0.84), generatedAt, event("event-generated"));
  analysis.submitForReview();
  analysis.recordReview(new ReviewDecision("approved").value, event("event-reviewed"));

  assert.equal(analysis.status, "approved");
  assert.equal(analysis.modelRunId?.value, "model-run-1");
  assert.equal(analysis.confidence?.value, 0.84);
  assert.equal(analysis.generatedAt, generatedAt);
});

test("a generated analysis cannot become operational without human review", () => {
  const analysis = requestedAnalysis();
  analysis.startProcessing(new ModelRunId("model-run-1"), event("event-started"));
  analysis.markGenerated(new ConfidenceScore(0.5), new Date(), event("event-generated"));

  assert.throws(() => analysis.recordReview("approved", event("event-reviewed")), InvalidAnalysisStateTransitionError);
  assert.equal(analysis.status, "generated");
});

test("review decisions can require a new version without deleting history", () => {
  const analysis = requestedAnalysis();
  analysis.startProcessing(new ModelRunId("model-run-1"), event("event-started"));
  analysis.markGenerated(new ConfidenceScore(0.5), new Date(), event("event-generated"));
  analysis.submitForReview();
  analysis.recordReview(new ReviewDecision("needs_revision").value, event("event-reviewed"));
  analysis.markSuperseded(event("event-superseded"));

  assert.equal(analysis.status, "superseded");
});

test("failed, approved, rejected, and superseded analyses can only end by archival", () => {
  const failed = requestedAnalysis();
  const failedAt = new Date("2026-08-05T10:02:00.000Z");
  failed.startProcessing(new ModelRunId("model-run-1"), event("event-started"));
  failed.markFailed(failedAt, event("event-failed"));
  failed.archive(new Date("2026-08-05T10:03:00.000Z"), event("event-archived"));

  assert.equal(failed.status, "archived");
  assert.equal(failed.failedAt, failedAt);
  assert.throws(() => failed.startProcessing(new ModelRunId("model-run-2"), event("event-retry")), InvalidAnalysisStateTransitionError);
});

test("value objects reject invalid confidence, versions, and review decisions", () => {
  assert.throws(() => new ConfidenceScore(1.01), InvalidConfidenceScoreError);
  assert.throws(() => new DiscoverySubmissionVersion(0));
  assert.throws(() => new ReviewDecision("auto_approved"), InvalidReviewDecisionError);
});

test("state transitions outside the approved state machine are rejected", () => {
  const analysis = requestedAnalysis();

  assert.throws(() => analysis.archive(new Date(), event("event-archived")), InvalidAnalysisStateTransitionError);
  assert.throws(() => analysis.markGenerated(new ConfidenceScore(0.2), new Date(), event("event-generated")), InvalidAnalysisStateTransitionError);
});

test("aggregate keeps official domain events pending until they are pulled", () => {
  const analysis = requestedAnalysis();
  analysis.startProcessing(new ModelRunId("model-run-1"), event("event-started"));

  const events = analysis.pullDomainEvents();
  assert.deepEqual(events.map((domainEvent) => domainEvent.type), ["IntelligenceAnalysisRequested", "IntelligenceAnalysisStarted"]);
  assert.equal(events[0].aggregateType, "IntelligenceAnalysis");
  assert.equal(events[0].version, 1);
  assert.equal(events[0].eventId, "event-requested");
  assert.equal(analysis.pullDomainEvents().length, 0);
});
