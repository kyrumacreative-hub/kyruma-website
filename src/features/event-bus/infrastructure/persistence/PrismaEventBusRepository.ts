import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { TransactionContext } from "../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { EventDeliveryStatus, EventEnvelope, EventProcessingRecord, ProcessingStatus } from "../../domain/contracts";
import type { ClaimedDelivery, EventBusRepository, RegisteredHandler } from "../../ports/EventBusRepository";

type DeliveryRow = Awaited<ReturnType<PrismaClient["eventProcessingRecord"]["findUnique"]>>;

export class PrismaEventBusRepository implements EventBusRepository {
  constructor(private readonly client: PrismaClient, private readonly contexts: PrismaTransactionContextStore, private readonly newId: () => string = randomUUID) {}

  async append(envelope: EventEnvelope, context: TransactionContext): Promise<void> {
    const db = this.contexts.get(context);
    await db.eventOutbox.create({ data: { eventId: envelope.eventId, eventType: envelope.eventType, eventVersion: envelope.eventVersion, organizationId: envelope.organizationId, aggregateType: envelope.aggregateType, aggregateId: envelope.aggregateId, correlationId: envelope.correlationId, causationId: envelope.causationId, envelope: envelope as unknown as Prisma.InputJsonValue, status: "pending", availableAt: new Date(envelope.publishedAt), createdAt: new Date(envelope.publishedAt) } });
  }

  async claimPendingEvents(input: { workerId: string; now: Date; staleBefore: Date; limit: number }): Promise<readonly EventEnvelope[]> {
    const candidates = await this.client.eventOutbox.findMany({ where: { availableAt: { lte: input.now }, OR: [{ status: "pending" }, { status: "dispatching", lockedAt: { lt: input.staleBefore } }] }, orderBy: { createdAt: "asc" }, take: input.limit });
    const claimed: EventEnvelope[] = [];
    for (const row of candidates) {
      const result = await this.client.eventOutbox.updateMany({ where: { eventId: row.eventId, OR: [{ status: "pending" }, { status: "dispatching", lockedAt: { lt: input.staleBefore } }] }, data: { status: "dispatching", lockedAt: input.now, lockOwner: input.workerId } });
      if (result.count === 1) claimed.push(row.envelope as unknown as EventEnvelope);
    }
    return claimed;
  }

  async materializeDeliveries(envelope: EventEnvelope, handlers: readonly RegisteredHandler[], dispatchedAt: Date): Promise<void> {
    await this.client.$transaction(async (db) => {
      for (const registration of handlers) await db.eventProcessingRecord.upsert({ where: { eventId_consumer_handler: { eventId: envelope.eventId, consumer: registration.consumer, handler: registration.handler } }, update: {}, create: { id: this.newId(), eventId: envelope.eventId, consumer: registration.consumer, handler: registration.handler, status: "pending", createdAt: dispatchedAt, updatedAt: dispatchedAt } });
      await db.eventOutbox.update({ where: { eventId: envelope.eventId }, data: { status: "dispatched", dispatchedAt, lockedAt: null, lockOwner: null } });
    });
  }

  async claimDeliveries(input: { workerId: string; now: Date; staleBefore: Date; limit: number }): Promise<readonly ClaimedDelivery[]> {
    const candidates = await this.client.eventProcessingRecord.findMany({ where: { OR: [{ status: "pending" }, { status: "retrying", nextRetryAt: { lte: input.now } }, { status: "processing", lockedAt: { lt: input.staleBefore } }] }, include: { event: true }, orderBy: { createdAt: "asc" }, take: input.limit });
    const claimed: ClaimedDelivery[] = [];
    for (const row of candidates) {
      const result = await this.client.eventProcessingRecord.updateMany({ where: { id: row.id, OR: [{ status: "pending" }, { status: "retrying", nextRetryAt: { lte: input.now } }, { status: "processing", lockedAt: { lt: input.staleBefore } }] }, data: { status: "processing", lockedAt: input.now, lockOwner: input.workerId, attemptCount: { increment: 1 }, firstAttemptAt: row.firstAttemptAt ?? input.now, lastAttemptAt: input.now, updatedAt: input.now } });
      if (result.count === 1) claimed.push({ ...this.mapDelivery({ ...row, attemptCount: row.attemptCount + 1, status: "processing", firstAttemptAt: row.firstAttemptAt ?? input.now, lastAttemptAt: input.now }), envelope: row.event.envelope as unknown as EventEnvelope });
    }
    return claimed;
  }

  async markProcessed(id: string, now: Date, context: TransactionContext): Promise<void> { await this.contexts.get(context).eventProcessingRecord.update({ where: { id }, data: { status: "processed", processedAt: now, nextRetryAt: null, errorCode: null, errorMessage: null, lockedAt: null, lockOwner: null, updatedAt: now } }); }

  async markFailed(id: string, input: { now: Date; nextRetryAt: Date | null; code: string; message: string }, context: TransactionContext): Promise<void> { await this.contexts.get(context).eventProcessingRecord.update({ where: { id }, data: { status: input.nextRetryAt ? "retrying" : "dead_lettered", nextRetryAt: input.nextRetryAt, errorCode: input.code, errorMessage: input.message, lockedAt: null, lockOwner: null, updatedAt: input.now } }); }

  async getStatus(eventId: string, organizationId: string): Promise<EventDeliveryStatus | null> {
    const event = await this.client.eventOutbox.findFirst({ where: { eventId, organizationId }, include: { deliveries: { orderBy: [{ consumer: "asc" }, { handler: "asc" }] } } });
    return event ? { envelope: event.envelope as unknown as EventEnvelope, deliveries: event.deliveries.map((row) => this.mapDelivery(row)) } : null;
  }

  async getDeadLetter(id: string, organizationId: string): Promise<ClaimedDelivery | null> {
    const row = await this.client.eventProcessingRecord.findFirst({ where: { id, event: { organizationId } }, include: { event: true } });
    return row ? { ...this.mapDelivery(row), envelope: row.event.envelope as unknown as EventEnvelope } : null;
  }

  async requeueDeadLetter(id: string, now: Date, context: TransactionContext): Promise<void> { await this.contexts.get(context).eventProcessingRecord.update({ where: { id }, data: { status: "pending", reprocessCount: { increment: 1 }, nextRetryAt: null, errorCode: null, errorMessage: null, lockedAt: null, lockOwner: null, updatedAt: now } }); }

  private mapDelivery(row: NonNullable<DeliveryRow>): EventProcessingRecord { return { id: row.id, eventId: row.eventId, consumer: row.consumer, handler: row.handler, status: row.status as ProcessingStatus, attemptCount: row.attemptCount, reprocessCount: row.reprocessCount, firstAttemptAt: row.firstAttemptAt, lastAttemptAt: row.lastAttemptAt, processedAt: row.processedAt, nextRetryAt: row.nextRetryAt, errorCode: row.errorCode }; }
}
