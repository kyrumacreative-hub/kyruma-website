import { InvalidSnapshotMetadataError } from "./errors";
import {
  DiscoverySubmissionId,
  DiscoverySubmissionVersion,
  SourceSnapshotId,
} from "./valueObjects";

export type SnapshotScopeType = "organization" | "partner" | "workspace";
export type SnapshotPayload = Readonly<Record<string, unknown>>;

export interface DiscoverySourceSnapshotProperties {
  id: SourceSnapshotId;
  discoverySubmissionId: DiscoverySubmissionId;
  submissionVersion: DiscoverySubmissionVersion;
  scopeType: SnapshotScopeType;
  organizationId: string;
  partnerId?: string;
  workspaceId?: string;
  contentHash: string;
  classification: string;
  retentionPolicyVersion: string;
  createdAt: Date;
  payload: SnapshotPayload;
}

export class DiscoverySourceSnapshot {
  readonly id: SourceSnapshotId;
  readonly discoverySubmissionId: DiscoverySubmissionId;
  readonly submissionVersion: DiscoverySubmissionVersion;
  readonly scopeType: SnapshotScopeType;
  readonly organizationId: string;
  readonly partnerId?: string;
  readonly workspaceId?: string;
  readonly contentHash: string;
  readonly classification: string;
  readonly retentionPolicyVersion: string;
  private readonly immutableCreatedAt: Date;
  private readonly immutablePayload: SnapshotPayload;

  constructor(properties: DiscoverySourceSnapshotProperties) {
    this.id = properties.id;
    this.discoverySubmissionId = properties.discoverySubmissionId;
    this.submissionVersion = properties.submissionVersion;
    this.scopeType = properties.scopeType;
    this.organizationId = required(properties.organizationId, "organizationId");
    this.partnerId = optional(properties.partnerId, "partnerId");
    this.workspaceId = optional(properties.workspaceId, "workspaceId");
    this.contentHash = required(properties.contentHash, "contentHash");
    this.classification = required(properties.classification, "classification");
    this.retentionPolicyVersion = required(properties.retentionPolicyVersion, "retentionPolicyVersion");
    this.immutableCreatedAt = new Date(properties.createdAt);
    this.immutablePayload = freezeSnapshotPayload(properties.payload);
    Object.freeze(this);
  }

  get createdAt(): Date { return new Date(this.immutableCreatedAt); }
  get payload(): SnapshotPayload { return this.immutablePayload; }
}

function required(value: string, field: string): string {
  if (value.trim().length === 0) throw new InvalidSnapshotMetadataError(field);
  return value;
}

function optional(value: string | undefined, field: string): string | undefined {
  if (value === undefined) return undefined;
  return required(value, field);
}

function freezeSnapshotPayload(payload: SnapshotPayload): SnapshotPayload {
  const copy = structuredClone(payload) as Record<string, unknown>;
  return freezeDeep(copy) as SnapshotPayload;
}

function freezeDeep(value: unknown): unknown {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep(child);
    Object.freeze(value);
  }
  return value;
}
