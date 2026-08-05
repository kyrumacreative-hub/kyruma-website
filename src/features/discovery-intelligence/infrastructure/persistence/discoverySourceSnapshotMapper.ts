import { DiscoverySourceSnapshot, type DiscoverySourceSnapshotProperties, type SnapshotScopeType } from "../../domain/discoverySourceSnapshot";
import { DiscoverySubmissionId, DiscoverySubmissionVersion, SourceSnapshotId } from "../../domain/valueObjects";

export interface DiscoverySourceSnapshotPersistenceModel {
  id: string;
  discoverySubmissionId: string;
  submissionVersion: number;
  scopeType: SnapshotScopeType;
  organizationId: string;
  partnerId?: string;
  workspaceId?: string;
  contentHash: string;
  classification: string;
  retentionPolicyVersion: string;
  createdAt: Date;
  payload: Readonly<Record<string, unknown>>;
}

export const DiscoverySourceSnapshotMapper = {
  toPersistence(snapshot: DiscoverySourceSnapshot): DiscoverySourceSnapshotPersistenceModel {
    return {
      id: snapshot.id.value,
      discoverySubmissionId: snapshot.discoverySubmissionId.value,
      submissionVersion: snapshot.submissionVersion.value,
      scopeType: snapshot.scopeType,
      organizationId: snapshot.organizationId,
      partnerId: snapshot.partnerId,
      workspaceId: snapshot.workspaceId,
      contentHash: snapshot.contentHash,
      classification: snapshot.classification,
      retentionPolicyVersion: snapshot.retentionPolicyVersion,
      createdAt: snapshot.createdAt,
      payload: snapshot.payload,
    };
  },

  toDomain(model: DiscoverySourceSnapshotPersistenceModel): DiscoverySourceSnapshot {
    const properties: DiscoverySourceSnapshotProperties = {
      id: new SourceSnapshotId(model.id),
      discoverySubmissionId: new DiscoverySubmissionId(model.discoverySubmissionId),
      submissionVersion: new DiscoverySubmissionVersion(model.submissionVersion),
      scopeType: model.scopeType,
      organizationId: model.organizationId,
      partnerId: model.partnerId,
      workspaceId: model.workspaceId,
      contentHash: model.contentHash,
      classification: model.classification,
      retentionPolicyVersion: model.retentionPolicyVersion,
      createdAt: new Date(model.createdAt),
      payload: model.payload,
    };
    return new DiscoverySourceSnapshot(properties);
  },
};
