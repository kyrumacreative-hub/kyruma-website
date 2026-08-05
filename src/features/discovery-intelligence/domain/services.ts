import { IncompleteDiscoverySourceError } from "./errors";
import { DiscoverySourceSnapshot, type SnapshotPayload, type SnapshotScopeType } from "./discoverySourceSnapshot";
import { snapshotEvent, type IntelligenceDomainEvent, type IntelligenceEventDetails } from "./events";
import { IntelligenceAnalysis, type IntelligenceAnalysisProperties } from "./intelligenceAnalysis";
import { IntelligenceAnalysisFactory } from "./intelligenceAnalysisFactory";
import {
  ConfidenceScore,
  DiscoverySubmissionId,
  DiscoverySubmissionVersion,
  SourceSnapshotId,
} from "./valueObjects";

export class IntelligenceAnalysisService {
  request(properties: IntelligenceAnalysisProperties): IntelligenceAnalysis {
    return IntelligenceAnalysisFactory.request(properties);
  }
}

export interface CompletedDiscoverySource {
  readonly status: "completed";
  readonly discoverySubmissionId: DiscoverySubmissionId;
  readonly submissionVersion: DiscoverySubmissionVersion;
  readonly scopeType: SnapshotScopeType;
  readonly organizationId: string;
  readonly partnerId?: string;
  readonly workspaceId?: string;
  readonly contentHash: string;
  readonly classification: string;
  readonly retentionPolicyVersion: string;
  readonly payload: SnapshotPayload;
}

export interface CreatedDiscoverySnapshot {
  readonly snapshot: DiscoverySourceSnapshot;
  readonly event: IntelligenceDomainEvent;
}

export class IntelligenceSnapshotService {
  create(
    source: CompletedDiscoverySource,
    snapshotId: SourceSnapshotId,
    createdAt: Date,
    eventDetails: IntelligenceEventDetails,
  ): CreatedDiscoverySnapshot {
    if (source.status !== "completed") throw new IncompleteDiscoverySourceError();

    const snapshot = new DiscoverySourceSnapshot({
      id: snapshotId,
      discoverySubmissionId: source.discoverySubmissionId,
      submissionVersion: source.submissionVersion,
      scopeType: source.scopeType,
      organizationId: source.organizationId,
      partnerId: source.partnerId,
      workspaceId: source.workspaceId,
      contentHash: source.contentHash,
      classification: source.classification,
      retentionPolicyVersion: source.retentionPolicyVersion,
      createdAt,
      payload: source.payload,
    });

    return {
      snapshot,
      event: snapshotEvent(snapshot.id, eventDetails, {
        discoverySubmissionId: snapshot.discoverySubmissionId.value,
        submissionVersion: snapshot.submissionVersion.value,
      }),
    };
  }
}

export class ConfidenceAssessmentService {
  assess(value: number): ConfidenceScore {
    return new ConfidenceScore(value);
  }
}
