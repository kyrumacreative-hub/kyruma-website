import type { IntelligenceAnalysis } from "../../../domain/intelligenceAnalysis";
import type { DiscoverySubmissionId, IntelligenceAnalysisId, SourceSnapshotId } from "../../../domain/valueObjects";
import type { IntelligenceAnalysisRepository } from "../../../ports/IntelligenceAnalysisRepository";
import type { TransactionContext } from "../../../ports/TransactionRunner";
import { PersistenceNotConfiguredError } from "./PersistenceNotConfiguredError";

/** Prepared adapter boundary; no Prisma client or database connection is introduced in Increment 3. */
export class PrismaIntelligenceAnalysisRepository implements IntelligenceAnalysisRepository {
  async save(analysis: IntelligenceAnalysis, context: TransactionContext): Promise<void> { void analysis; void context; throw this.unconfigured(); }
  async findById(id: IntelligenceAnalysisId, context: TransactionContext): Promise<IntelligenceAnalysis | null> { void id; void context; throw this.unconfigured(); }
  async findBySnapshotId(snapshotId: SourceSnapshotId, context: TransactionContext): Promise<IntelligenceAnalysis[]> { void snapshotId; void context; throw this.unconfigured(); }
  async findHistoryByDiscoverySubmission(id: DiscoverySubmissionId, context: TransactionContext): Promise<IntelligenceAnalysis[]> { void id; void context; throw this.unconfigured(); }

  private unconfigured(): PersistenceNotConfiguredError { return new PersistenceNotConfiguredError(this.constructor.name); }
}
