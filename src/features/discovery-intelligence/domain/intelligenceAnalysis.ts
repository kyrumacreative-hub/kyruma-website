import { InvalidAnalysisMetadataError, InvalidAnalysisStateTransitionError } from "./errors";
import {
  AnalysisStatus,
  type AnalysisStatusValue,
  AnalysisVersion,
  ConfidenceScore,
  CorrelationId,
  DiscoverySubmissionId,
  DiscoverySubmissionVersion,
  IntelligenceAnalysisId,
  ModelReference,
  ModelRunId,
  PromptTemplateVersion,
  type ReviewDecisionValue,
  SourceSnapshotId,
} from "./valueObjects";

export interface IntelligenceAnalysisProperties {
  id: IntelligenceAnalysisId;
  sourceSnapshotId: SourceSnapshotId;
  discoverySubmissionId: DiscoverySubmissionId;
  discoverySubmissionVersion: DiscoverySubmissionVersion;
  analysisVersion: AnalysisVersion;
  promptTemplateVersion: PromptTemplateVersion;
  modelReference: ModelReference;
  policyVersion: string;
  requestedBy: string;
  requestedAt: Date;
  correlationId: CorrelationId;
}

const allowedTransitions: Readonly<Record<AnalysisStatusValue, readonly AnalysisStatusValue[]>> = {
  requested: ["processing"],
  processing: ["generated", "failed"],
  generated: ["under_review"],
  under_review: ["approved", "needs_revision", "rejected"],
  approved: ["archived"],
  needs_revision: ["superseded"],
  rejected: ["archived"],
  superseded: ["archived"],
  failed: ["archived"],
  archived: [],
};

export class IntelligenceAnalysis {
  readonly id: IntelligenceAnalysisId;
  readonly sourceSnapshotId: SourceSnapshotId;
  readonly discoverySubmissionId: DiscoverySubmissionId;
  readonly discoverySubmissionVersion: DiscoverySubmissionVersion;
  readonly analysisVersion: AnalysisVersion;
  readonly promptTemplateVersion: PromptTemplateVersion;
  readonly modelReference: ModelReference;
  readonly policyVersion: string;
  readonly requestedBy: string;
  readonly requestedAt: Date;
  readonly correlationId: CorrelationId;
  private currentStatus: AnalysisStatus = new AnalysisStatus("requested");
  private currentModelRunId?: ModelRunId;
  private currentConfidence?: ConfidenceScore;
  private currentGeneratedAt?: Date;
  private currentFailedAt?: Date;
  private currentArchivedAt?: Date;

  constructor(properties: IntelligenceAnalysisProperties) {
    this.id = properties.id;
    this.sourceSnapshotId = properties.sourceSnapshotId;
    this.discoverySubmissionId = properties.discoverySubmissionId;
    this.discoverySubmissionVersion = properties.discoverySubmissionVersion;
    this.analysisVersion = properties.analysisVersion;
    this.promptTemplateVersion = properties.promptTemplateVersion;
    this.modelReference = properties.modelReference;
    this.policyVersion = requireNonEmpty(properties.policyVersion, "policyVersion");
    this.requestedBy = requireNonEmpty(properties.requestedBy, "requestedBy");
    this.requestedAt = properties.requestedAt;
    this.correlationId = properties.correlationId;
  }

  get status(): AnalysisStatusValue { return this.currentStatus.value; }
  get modelRunId(): ModelRunId | undefined { return this.currentModelRunId; }
  get confidence(): ConfidenceScore | undefined { return this.currentConfidence; }
  get generatedAt(): Date | undefined { return this.currentGeneratedAt; }
  get failedAt(): Date | undefined { return this.currentFailedAt; }
  get archivedAt(): Date | undefined { return this.currentArchivedAt; }

  startProcessing(modelRunId: ModelRunId): void {
    this.transitionTo("processing");
    this.currentModelRunId = modelRunId;
  }

  markGenerated(confidence: ConfidenceScore, generatedAt: Date): void {
    this.transitionTo("generated");
    this.currentConfidence = confidence;
    this.currentGeneratedAt = generatedAt;
  }

  submitForReview(): void { this.transitionTo("under_review"); }

  recordReview(decision: ReviewDecisionValue): void { this.transitionTo(decision); }

  markFailed(failedAt: Date): void {
    this.transitionTo("failed");
    this.currentFailedAt = failedAt;
  }

  markSuperseded(): void { this.transitionTo("superseded"); }

  archive(archivedAt: Date): void {
    this.transitionTo("archived");
    this.currentArchivedAt = archivedAt;
  }

  private transitionTo(next: AnalysisStatusValue): void {
    if (!allowedTransitions[this.status].includes(next)) {
      throw new InvalidAnalysisStateTransitionError(this.status, next);
    }
    this.currentStatus = new AnalysisStatus(next);
  }
}

function requireNonEmpty(value: string, field: "policyVersion" | "requestedBy"): string {
  if (value.trim().length === 0) throw new InvalidAnalysisMetadataError(field);
  return value;
}
