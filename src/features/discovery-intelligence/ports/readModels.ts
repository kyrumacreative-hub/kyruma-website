import type { AnalysisStatusValue, ReviewDecisionValue } from "../domain/valueObjects";

export interface IntelligenceAnalysisReadModel {
  readonly id: string;
  readonly sourceSnapshotId: string;
  readonly discoverySubmissionId: string;
  readonly discoverySubmissionVersion: number;
  readonly analysisVersion: number;
  readonly status: AnalysisStatusValue;
  readonly confidence?: number;
  readonly requestedAt: Date;
  readonly generatedAt?: Date;
  readonly archivedAt?: Date;
}

export interface IntelligenceSnapshotReadModel {
  readonly id: string;
  readonly discoverySubmissionId: string;
  readonly submissionVersion: number;
  readonly contentHash: string;
  readonly classification: string;
  readonly createdAt: Date;
}

export interface IntelligenceAnalysisHistoryReadModel {
  readonly analysisId: string;
  readonly analysisVersion: number;
  readonly status: AnalysisStatusValue;
  readonly reviewDecision?: ReviewDecisionValue;
  readonly occurredAt: Date;
}
