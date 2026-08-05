import type { DiscoverySourceSnapshot } from "../../../domain/discoverySourceSnapshot";
import type { DiscoverySubmissionId, SourceSnapshotId } from "../../../domain/valueObjects";
import type { IntelligenceSnapshotRepository } from "../../../ports/IntelligenceSnapshotRepository";
import type { TransactionContext } from "../../../ports/TransactionRunner";
import { PersistenceNotConfiguredError } from "./PersistenceNotConfiguredError";

/** Prepared adapter boundary; no Prisma client or database connection is introduced in Increment 3. */
export class PrismaIntelligenceSnapshotRepository implements IntelligenceSnapshotRepository {
  async save(snapshot: DiscoverySourceSnapshot, context: TransactionContext): Promise<void> { void snapshot; void context; throw this.unconfigured(); }
  async findById(id: SourceSnapshotId, context: TransactionContext): Promise<DiscoverySourceSnapshot | null> { void id; void context; throw this.unconfigured(); }
  async findByDiscoverySubmission(id: DiscoverySubmissionId, context: TransactionContext): Promise<DiscoverySourceSnapshot[]> { void id; void context; throw this.unconfigured(); }

  private unconfigured(): PersistenceNotConfiguredError { return new PersistenceNotConfiguredError(this.constructor.name); }
}
