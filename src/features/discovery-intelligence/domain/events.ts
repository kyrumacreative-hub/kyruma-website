import type { CorrelationId, IntelligenceAnalysisId, SourceSnapshotId } from "./valueObjects";
import { InvalidDomainEventIdError } from "./errors";

export const intelligenceAnalysisEventTypes = [
  "IntelligenceAnalysisRequested",
  "DiscoverySourceSnapshotted",
  "IntelligenceAnalysisStarted",
  "IntelligenceAnalysisGenerated",
  "IntelligenceAnalysisFailed",
  "IntelligenceAnalysisReviewed",
  "IntelligenceAnalysisSuperseded",
  "IntelligenceAnalysisArchived",
] as const;

export type IntelligenceAnalysisEventType = (typeof intelligenceAnalysisEventTypes)[number];

export interface IntelligenceDomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly aggregateType: "IntelligenceAnalysis" | "DiscoverySourceSnapshot";
  readonly version: 1;
  readonly occurredAt: Date;
  readonly correlationId: string;
  readonly type: IntelligenceAnalysisEventType;
  readonly payload: Readonly<Record<string, string | number | boolean>>;
}

export interface IntelligenceEventDetails {
  eventId: string;
  occurredAt: Date;
  correlationId: CorrelationId;
}

export function analysisEvent(
  type: Exclude<IntelligenceAnalysisEventType, "DiscoverySourceSnapshotted">,
  analysisId: IntelligenceAnalysisId,
  details: IntelligenceEventDetails,
  payload: Readonly<Record<string, string | number | boolean>> = {},
): IntelligenceDomainEvent {
  return createEvent(type, analysisId.value, "IntelligenceAnalysis", details, payload);
}

export function snapshotEvent(
  snapshotId: SourceSnapshotId,
  details: IntelligenceEventDetails,
  payload: Readonly<Record<string, string | number | boolean>> = {},
): IntelligenceDomainEvent {
  return createEvent("DiscoverySourceSnapshotted", snapshotId.value, "DiscoverySourceSnapshot", details, payload);
}

function createEvent(
  type: IntelligenceAnalysisEventType,
  aggregateId: string,
  aggregateType: IntelligenceDomainEvent["aggregateType"],
  details: IntelligenceEventDetails,
  payload: Readonly<Record<string, string | number | boolean>>,
): IntelligenceDomainEvent {
  if (details.eventId.trim().length === 0) throw new InvalidDomainEventIdError();
  return Object.freeze({
    eventId: details.eventId,
    aggregateId,
    aggregateType,
    version: 1 as const,
    occurredAt: new Date(details.occurredAt),
    correlationId: details.correlationId.value,
    type,
    payload: Object.freeze({ ...payload }),
  });
}
