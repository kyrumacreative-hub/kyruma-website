import { InvalidAnalysisMetadataError, InvalidAnalysisStateTransitionError } from "./errors";
import { analysisEvent, type IntelligenceDomainEvent, type IntelligenceEventDetails } from "./events";
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
  requestedEvent?: IntelligenceEventDetails;
}

export interface RestoredIntelligenceAnalysisProperties extends IntelligenceAnalysisProperties {
  status: AnalysisStatusValue;
  modelRunId?: ModelRunId;
  confidence?: ConfidenceScore;
  generatedAt?: Date;
  failedAt?: Date;
  archivedAt?: Date;
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
  private pendingEvents: IntelligenceDomainEvent[] = [];

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
    if (properties.requestedEvent) {
      this.recordEvent(analysisEvent("IntelligenceAnalysisRequested", this.id, properties.requestedEvent, {
        sourceSnapshotId: this.sourceSnapshotId.value,
        analysisVersion: this.analysisVersion.value,
      }));
    }
  }

  static restore(properties: RestoredIntelligenceAnalysisProperties): IntelligenceAnalysis {
    const analysis = new IntelligenceAnalysis(properties);
    analysis.currentStatus = new AnalysisStatus(properties.status);
    analysis.currentModelRunId = properties.modelRunId;
    analysis.currentConfidence = properties.confidence;
    analysis.currentGeneratedAt = properties.generatedAt;
    analysis.currentFailedAt = properties.failedAt;
    analysis.currentArchivedAt = properties.archivedAt;
    analysis.clearDomainEvents();
    return analysis;
  }

  get status(): AnalysisStatusValue { return this.currentStatus.value; }
  get modelRunId(): ModelRunId | undefined { return this.currentModelRunId; }
  get confidence(): ConfidenceScore | undefined { return this.currentConfidence; }
  get generatedAt(): Date | undefined { return this.currentGeneratedAt; }
  get failedAt(): Date | undefined { return this.currentFailedAt; }
  get archivedAt(): Date | undefined { return this.currentArchivedAt; }

  startProcessing(modelRunId: ModelRunId, event: IntelligenceEventDetails): void {
    this.transitionTo("processing");
    this.currentModelRunId = modelRunId;
    this.recordEvent(analysisEvent("IntelligenceAnalysisStarted", this.id, event, { modelRunId: modelRunId.value }));
  }

  markGenerated(confidence: ConfidenceScore, generatedAt: Date, event: IntelligenceEventDetails): void {
    this.transitionTo("generated");
    this.currentConfidence = confidence;
    this.currentGeneratedAt = generatedAt;
    this.recordEvent(analysisEvent("IntelligenceAnalysisGenerated", this.id, event, { confidence: confidence.value }));
  }

  submitForReview(): void { this.transitionTo("under_review"); }

  recordReview(decision: ReviewDecisionValue, event: IntelligenceEventDetails): void {
    this.transitionTo(decision);
    this.recordEvent(analysisEvent("IntelligenceAnalysisReviewed", this.id, event, { decision }));
  }

  markFailed(failedAt: Date, event: IntelligenceEventDetails): void {
    this.transitionTo("failed");
    this.currentFailedAt = failedAt;
    this.recordEvent(analysisEvent("IntelligenceAnalysisFailed", this.id, event));
  }

  markSuperseded(event: IntelligenceEventDetails): void {
    this.transitionTo("superseded");
    this.recordEvent(analysisEvent("IntelligenceAnalysisSuperseded", this.id, event));
  }

  archive(archivedAt: Date, event: IntelligenceEventDetails): void {
    this.transitionTo("archived");
    this.currentArchivedAt = archivedAt;
    this.recordEvent(analysisEvent("IntelligenceAnalysisArchived", this.id, event));
  }

  recordEvent(event: IntelligenceDomainEvent): void { this.pendingEvents.push(event); }

  pullDomainEvents(): readonly IntelligenceDomainEvent[] {
    const events = [...this.pendingEvents];
    this.clearDomainEvents();
    return events;
  }

  clearDomainEvents(): void { this.pendingEvents = []; }

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
