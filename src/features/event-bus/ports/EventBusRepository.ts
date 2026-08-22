import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { EventDeliveryStatus, EventEnvelope, EventProcessingRecord } from "../domain/contracts";

export interface RegisteredHandler { readonly consumer: string; readonly handler: string; readonly eventType: string; readonly eventVersion: number; }
export interface ClaimedEvent { readonly envelope: EventEnvelope; readonly leaseToken: string; }
export interface EventDelivery extends EventProcessingRecord { readonly envelope: EventEnvelope; }
export interface ClaimedDelivery extends EventDelivery { readonly leaseToken: string; }

export interface EventBusRepository {
  append(envelope: EventEnvelope, context: TransactionContext): Promise<void>;
  claimPendingEvents(input: { workerId: string; now: Date; staleBefore: Date; limit: number }): Promise<readonly ClaimedEvent[]>;
  materializeDeliveries(claim: ClaimedEvent, handlers: readonly RegisteredHandler[], dispatchedAt: Date): Promise<void>;
  claimDeliveries(input: { workerId: string; now: Date; staleBefore: Date; limit: number }): Promise<readonly ClaimedDelivery[]>;
  markProcessed(id: string, leaseToken: string, now: Date, context: TransactionContext): Promise<void>;
  markFailed(id: string, leaseToken: string, input: { now: Date; nextRetryAt: Date | null; code: string; message: string }, context: TransactionContext): Promise<void>;
  getStatus(eventId: string, organizationId: string): Promise<EventDeliveryStatus | null>;
  getDeadLetter(id: string, organizationId: string): Promise<EventDelivery | null>;
  requeueDeadLetter(id: string, now: Date, context: TransactionContext): Promise<void>;
}

export interface EventHandler { handle(envelope: EventEnvelope): Promise<void>; }
export interface AuditRecorder { recordDeadLetterReprocessed(input: { organizationId: string; eventId: string; deliveryId: string; actorId: string; occurredAt: Date }, context: TransactionContext): Promise<void>; }
