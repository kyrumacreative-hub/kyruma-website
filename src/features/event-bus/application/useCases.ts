import { randomUUID } from "node:crypto";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import type { EventDeliveryStatus, EventEnvelope } from "../domain/contracts";
import { DeadLetterRequiredError, EventNotFoundError, LeaseOwnershipLostError, NonRetryableEventError, UnsupportedEventContractError } from "../domain/errors";
import { EventContractRegistry, validateEnvelope } from "../domain/validation";
import type { Clock } from "../ports/Clock";
import type { AuditRecorder, EventBusRepository } from "../ports/EventBusRepository";
import type { EventTransport } from "../ports/EventTransport";
import { EventHandlerRegistry } from "./EventHandlerRegistry";

const RETRY_DELAYS_MS = [60_000, 300_000, 1_800_000, 7_200_000, 43_200_000] as const;
const sanitize = (value: string): string => value.replace(/[\r\n\t]+/g, " ").slice(0, 500);

export interface PublishEventInput<T> extends Omit<EventEnvelope<T>, "eventId" | "publishedAt"> { readonly eventId?: string; }

export class PublishEventUseCase {
  constructor(private readonly repository: EventBusRepository, private readonly contracts: EventContractRegistry, private readonly clock: Clock, private readonly newId: () => string = randomUUID) {}
  async execute<T>(input: PublishEventInput<T>, context: TransactionContext): Promise<EventEnvelope<T>> {
    const envelope: EventEnvelope<T> = Object.freeze({ ...input, eventId: input.eventId ?? this.newId(), publishedAt: this.clock.now().toISOString(), payload: Object.freeze(input.payload), metadata: Object.freeze(input.metadata) });
    validateEnvelope(envelope);
    if (!this.contracts.supports(envelope.eventType, envelope.eventVersion) || !this.contracts.validate(envelope)) throw new UnsupportedEventContractError(envelope.eventType, envelope.eventVersion);
    await this.repository.append(envelope, context);
    return envelope;
  }
}

export class DispatchPendingEventsUseCase {
  constructor(private readonly repository: EventBusRepository, private readonly transport: EventTransport, private readonly handlers: EventHandlerRegistry, private readonly clock: Clock) {}
  async execute(input: { workerId: string; limit?: number }): Promise<number> {
    const now = this.clock.now();
    const events = await this.repository.claimPendingEvents({ workerId: input.workerId, now, staleBefore: new Date(now.getTime() - 300_000), limit: input.limit ?? 100, handlers: this.handlers.registrations() });
    for (const claim of events) {
      try { await this.transport.materialize(claim, this.handlers.subscriptions(claim.envelope.eventType, claim.envelope.eventVersion), now); }
      catch (error) { if (!(error instanceof LeaseOwnershipLostError)) throw error; }
    }
    return events.length;
  }
}

export class ProcessEventUseCase {
  constructor(private readonly repository: EventBusRepository, private readonly handlers: EventHandlerRegistry, private readonly transactions: TransactionRunner, private readonly clock: Clock) {}
  async execute(input: { workerId: string; limit?: number }): Promise<number> {
    const now = this.clock.now();
    const deliveries = await this.repository.claimDeliveries({ workerId: input.workerId, now, staleBefore: new Date(now.getTime() - 300_000), limit: input.limit ?? 100, handlers: this.handlers.registrations() });
    for (const delivery of deliveries) {
      const handler = this.handlers.resolve(delivery.consumer, delivery.handler, delivery.envelope.eventType, delivery.envelope.eventVersion);
      if (!handler) {
        try { await this.fail(delivery.id, delivery.leaseToken, delivery.attemptCount - 1, new NonRetryableEventError("EVENT_HANDLER_NOT_REGISTERED", "Registered handler is unavailable.")); }
        catch (failure) { if (!(failure instanceof LeaseOwnershipLostError)) throw failure; }
        continue;
      }
      try {
        await handler.handle(delivery.envelope);
        await this.transactions.run((context) => this.repository.markProcessed(delivery.id, delivery.leaseToken, this.clock.now(), context));
      }
      catch (error) {
        if (error instanceof LeaseOwnershipLostError) continue;
        try { await this.fail(delivery.id, delivery.leaseToken, delivery.attemptCount - 1, error); }
        catch (failure) { if (!(failure instanceof LeaseOwnershipLostError)) throw failure; }
      }
    }
    return deliveries.length;
  }
  private async fail(id: string, leaseToken: string, previousAttempts: number, error: unknown): Promise<void> {
    const now = this.clock.now();
    const nonRetryable = error instanceof NonRetryableEventError;
    const delay = RETRY_DELAYS_MS[previousAttempts];
    const nextRetryAt = nonRetryable || delay === undefined ? null : new Date(now.getTime() + delay);
    const code = error instanceof NonRetryableEventError ? error.code : "EVENT_HANDLER_FAILED";
    const message = sanitize(error instanceof Error ? error.message : "Unexpected handler failure.");
    await this.transactions.run((context) => this.repository.markFailed(id, leaseToken, { now, nextRetryAt, code, message }, context));
  }
}

export class RetryFailedDeliveryUseCase { constructor(private readonly processor: ProcessEventUseCase) {} execute(input: { workerId: string; limit?: number }): Promise<number> { return this.processor.execute(input); } }

export class GetEventDeliveryStatusUseCase {
  constructor(private readonly repository: EventBusRepository) {}
  async execute(input: { eventId: string; organizationId: string }): Promise<EventDeliveryStatus> { const result = await this.repository.getStatus(input.eventId, input.organizationId); if (!result) throw new EventNotFoundError(); return result; }
}

export class ReprocessDeadLetterUseCase {
  constructor(private readonly repository: EventBusRepository, private readonly transactions: TransactionRunner, private readonly audit: AuditRecorder, private readonly clock: Clock) {}
  async execute(input: { deliveryId: string; organizationId: string; actorId: string }): Promise<void> {
    const delivery = await this.repository.getDeadLetter(input.deliveryId, input.organizationId);
    if (!delivery) throw new EventNotFoundError();
    if (delivery.status !== "dead_lettered") throw new DeadLetterRequiredError();
    const now = this.clock.now();
    await this.transactions.run(async (context) => { await this.repository.requeueDeadLetter(delivery.id, now, context); await this.audit.recordDeadLetterReprocessed({ organizationId: input.organizationId, eventId: delivery.eventId, deliveryId: delivery.id, actorId: input.actorId, occurredAt: now }, context); });
  }
}
