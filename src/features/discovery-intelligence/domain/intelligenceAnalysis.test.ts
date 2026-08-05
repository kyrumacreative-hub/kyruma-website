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

  analysis.startProcessing(new ModelRunId("model-run-1"));
  analysis.markGenerated(new ConfidenceScore(0.84), generatedAt);
  analysis.submitForReview();
  analysis.recordReview(new ReviewDecision("approved").value);

  assert.equal(analysis.status, "approved");
  assert.equal(analysis.modelRunId?.value, "model-run-1");
  assert.equal(analysis.confidence?.value, 0.84);
  assert.equal(analysis.generatedAt, generatedAt);
});

test("a generated analysis cannot become operational without human review", () => {
  const analysis = requestedAnalysis();
  analysis.startProcessing(new ModelRunId("model-run-1"));
  analysis.markGenerated(new ConfidenceScore(0.5), new Date());

  assert.throws(() => analysis.recordReview("approved"), InvalidAnalysisStateTransitionError);
  assert.equal(analysis.status, "generated");
});

test("review decisions can require a new version without deleting history", () => {
  const analysis = requestedAnalysis();
  analysis.startProcessing(new ModelRunId("model-run-1"));
  analysis.markGenerated(new ConfidenceScore(0.5), new Date());
  analysis.submitForReview();
  analysis.recordReview(new ReviewDecision("needs_revision").value);
  analysis.markSuperseded();

  assert.equal(analysis.status, "superseded");
});

test("failed, approved, rejected, and superseded analyses can only end by archival", () => {
  const failed = requestedAnalysis();
  const failedAt = new Date("2026-08-05T10:02:00.000Z");
  failed.startProcessing(new ModelRunId("model-run-1"));
  failed.markFailed(failedAt);
  failed.archive(new Date("2026-08-05T10:03:00.000Z"));

  assert.equal(failed.status, "archived");
  assert.equal(failed.failedAt, failedAt);
  assert.throws(() => failed.startProcessing(new ModelRunId("model-run-2")), InvalidAnalysisStateTransitionError);
});

test("value objects reject invalid confidence, versions, and review decisions", () => {
  assert.throws(() => new ConfidenceScore(1.01), InvalidConfidenceScoreError);
  assert.throws(() => new DiscoverySubmissionVersion(0));
  assert.throws(() => new ReviewDecision("auto_approved"), InvalidReviewDecisionError);
});

test("state transitions outside the approved state machine are rejected", () => {
  const analysis = requestedAnalysis();

  assert.throws(() => analysis.archive(new Date()), InvalidAnalysisStateTransitionError);
  assert.throws(() => analysis.markGenerated(new ConfidenceScore(0.2), new Date()), InvalidAnalysisStateTransitionError);
});
