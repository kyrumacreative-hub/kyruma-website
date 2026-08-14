export type EventMetadata = Readonly<Record<string, unknown> & { pii: boolean; processingDepth: number }>;

export interface EventEnvelope<TPayload = unknown> {
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly occurredAt: string;
  readonly publishedAt: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly organizationId: string;
  readonly source: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: Readonly<TPayload>;
  readonly metadata: EventMetadata;
  readonly partnerId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
  readonly requestId?: string;
}

export type ProcessingStatus = "pending" | "processing" | "processed" | "retrying" | "dead_lettered";

export interface EventProcessingRecord {
  readonly id: string;
  readonly eventId: string;
  readonly consumer: string;
  readonly handler: string;
  readonly status: ProcessingStatus;
  readonly attemptCount: number;
  readonly reprocessCount: number;
  readonly firstAttemptAt: Date | null;
  readonly lastAttemptAt: Date | null;
  readonly processedAt: Date | null;
  readonly nextRetryAt: Date | null;
  readonly errorCode: string | null;
}

export interface EventDeliveryStatus {
  readonly envelope: EventEnvelope;
  readonly deliveries: readonly EventProcessingRecord[];
}
