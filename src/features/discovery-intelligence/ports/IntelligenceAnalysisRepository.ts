import type { IntelligenceAnalysis } from "../domain/intelligenceAnalysis";
import type { CorrelationId, DiscoverySubmissionId, IntelligenceAnalysisId, SourceSnapshotId } from "../domain/valueObjects";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";

export interface IntelligenceAnalysisRepository {
  save(analysis: IntelligenceAnalysis, context: TransactionContext): Promise<void>;
  update(analysis: IntelligenceAnalysis, context: TransactionContext): Promise<void>;
  findById(id: IntelligenceAnalysisId, context: TransactionContext): Promise<IntelligenceAnalysis | null>;
  findByCorrelationId(correlationId: CorrelationId, sourceSnapshotId: SourceSnapshotId, context: TransactionContext): Promise<IntelligenceAnalysis | null>;
  findBySnapshotId(snapshotId: SourceSnapshotId, context: TransactionContext): Promise<IntelligenceAnalysis[]>;
  findHistoryByDiscoverySubmission(
    discoverySubmissionId: DiscoverySubmissionId,
    context: TransactionContext,
  ): Promise<IntelligenceAnalysis[]>;
}
