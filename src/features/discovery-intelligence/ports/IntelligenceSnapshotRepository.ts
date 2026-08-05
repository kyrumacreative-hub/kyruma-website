import type { DiscoverySourceSnapshot } from "../domain/discoverySourceSnapshot";
import type { DiscoverySubmissionId, SourceSnapshotId } from "../domain/valueObjects";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";

export interface IntelligenceSnapshotRepository {
  save(snapshot: DiscoverySourceSnapshot, context: TransactionContext): Promise<void>;
  findById(id: SourceSnapshotId, context: TransactionContext): Promise<DiscoverySourceSnapshot | null>;
  findByDiscoverySubmission(
    discoverySubmissionId: DiscoverySubmissionId,
    context: TransactionContext,
  ): Promise<DiscoverySourceSnapshot[]>;
  findByOrganization(organizationId: string, context: TransactionContext): Promise<DiscoverySourceSnapshot[]>;
}
