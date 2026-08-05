import type { IntelligenceAnalysis } from "../domain/intelligenceAnalysis";
import type { DiscoverySubmissionId, IntelligenceAnalysisId, SourceSnapshotId } from "../domain/valueObjects";
import type { TransactionContext } from "./TransactionRunner";

export interface IntelligenceAnalysisRepository {
  save(analysis: IntelligenceAnalysis, context: TransactionContext): Promise<void>;
  findById(id: IntelligenceAnalysisId, context: TransactionContext): Promise<IntelligenceAnalysis | null>;
  findBySnapshotId(snapshotId: SourceSnapshotId, context: TransactionContext): Promise<IntelligenceAnalysis[]>;
  findHistoryByDiscoverySubmission(
    discoverySubmissionId: DiscoverySubmissionId,
    context: TransactionContext,
  ): Promise<IntelligenceAnalysis[]>;
}
