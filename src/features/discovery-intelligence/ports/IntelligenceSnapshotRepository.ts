import type { DiscoverySourceSnapshot } from "../domain/discoverySourceSnapshot";
import type { DiscoverySubmissionId, SourceSnapshotId } from "../domain/valueObjects";
import type { TransactionContext } from "./TransactionRunner";

export interface IntelligenceSnapshotRepository {
  save(snapshot: DiscoverySourceSnapshot, context: TransactionContext): Promise<void>;
  findById(id: SourceSnapshotId, context: TransactionContext): Promise<DiscoverySourceSnapshot | null>;
  findByDiscoverySubmission(
    discoverySubmissionId: DiscoverySubmissionId,
    context: TransactionContext,
  ): Promise<DiscoverySourceSnapshot[]>;
}
