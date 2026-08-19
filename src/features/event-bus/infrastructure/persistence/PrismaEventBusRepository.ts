import { randomUUID } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import type { TransactionContext } from "../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { EventDeliveryStatus, EventEnvelope, EventProcessingRecord, ProcessingStatus } from "../../domain/contracts";
import { LeaseOwnershipLostError } from "../../domain/errors";
import { validateEnvelope } from "../../domain/validation";
import type { ClaimedDelivery, ClaimedEvent, EventBusRepository, EventDelivery, RegisteredHandler } from "../../ports/EventBusRepository";

type ClaimedEventRow = { envelope: Prisma.JsonValue; leaseToken: string };
type ClaimedDeliveryRow = {
  id: string;
  eventId: string;
  consumer: string;
  handler: string;
  status: string;
  attemptCount: number;
  reprocessCount: number;
  firstAttemptAt: Date | null;
  lastAttemptAt: Date | null;
  processedAt: Date | null;
  nextRetryAt: Date | null;
  errorCode: string | null;
  leaseToken: string;
  envelope: Prisma.JsonValue;
};
type DeliveryMappingRow = Pick<ClaimedDeliveryRow, "id" | "eventId" | "consumer" | "handler" | "status" | "attemptCount" | "reprocessCount" | "firstAttemptAt" | "lastAttemptAt" | "processedAt" | "nextRetryAt" | "errorCode">;

export class PrismaEventBusRepository implements EventBusRepository {
  constructor(private readonly client: PrismaClient, private readonly contexts: PrismaTransactionContextStore, private readonly newId: () => string = randomUUID) {}

  async append(envelope: EventEnvelope, context: TransactionContext): Promise<void> {
    const db = this.contexts.get(context);
    await db.eventOutbox.create({ data: { eventId: envelope.eventId, eventType: envelope.eventType, eventVersion: envelope.eventVersion, organizationId: envelope.organizationId, aggregateType: envelope.aggregateType, aggregateId: envelope.aggregateId, correlationId: envelope.correlationId, causationId: envelope.causationId, envelope: envelope as unknown as Prisma.InputJsonValue, status: "pending", availableAt: new Date(envelope.publishedAt), createdAt: new Date(envelope.publishedAt) } });
  }

  async claimPendingEvents(input: { workerId: string; now: Date; staleBefore: Date; limit: number }): Promise<readonly ClaimedEvent[]> {
    const leaseToken = this.newId();
    const rows = await this.client.$queryRaw<ClaimedEventRow[]>(Prisma.sql`
      WITH candidates AS (
        SELECT "eventId"
        FROM "EventOutbox"
        WHERE "availableAt" <= ${input.now}
          AND (
            "status" = 'pending'
            OR ("status" = 'dispatching' AND "lockedAt" < ${input.staleBefore})
          )
        ORDER BY "createdAt" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT ${input.limit}
      )
      UPDATE "EventOutbox" AS event
      SET "status" = 'dispatching',
          "lockedAt" = ${input.now},
          "lockOwner" = ${input.workerId},
          "leaseToken" = ${leaseToken}
      FROM candidates
      WHERE event."eventId" = candidates."eventId"
      RETURNING event."envelope", event."leaseToken"
    `);
    return rows.map((row) => ({ envelope: this.hydrateEnvelope(row.envelope), leaseToken: row.leaseToken }));
  }

  async materializeDeliveries(claim: ClaimedEvent, handlers: readonly RegisteredHandler[], dispatchedAt: Date): Promise<void> {
    await this.client.$transaction(async (db) => {
      for (const registration of handlers) await db.eventProcessingRecord.upsert({ where: { eventId_consumer_handler: { eventId: claim.envelope.eventId, consumer: registration.consumer, handler: registration.handler } }, update: {}, create: { id: this.newId(), eventId: claim.envelope.eventId, consumer: registration.consumer, handler: registration.handler, status: "pending", createdAt: dispatchedAt, updatedAt: dispatchedAt } });
      const updated = await db.eventOutbox.updateMany({ where: { eventId: claim.envelope.eventId, status: "dispatching", leaseToken: claim.leaseToken }, data: { status: "dispatched", dispatchedAt, lockedAt: null, lockOwner: null, leaseToken: null } });
      if (updated.count !== 1) throw new LeaseOwnershipLostError("event");
    });
  }

  async claimDeliveries(input: { workerId: string; now: Date; staleBefore: Date; limit: number }): Promise<readonly ClaimedDelivery[]> {
    const leaseToken = this.newId();
    const rows = await this.client.$queryRaw<ClaimedDeliveryRow[]>(Prisma.sql`
      WITH candidates AS (
        SELECT "id"
        FROM "EventProcessingRecord"
        WHERE "status" = 'pending'
          OR ("status" = 'retrying' AND "nextRetryAt" <= ${input.now})
          OR ("status" = 'processing' AND "lockedAt" < ${input.staleBefore})
        ORDER BY "createdAt" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT ${input.limit}
      ), claimed AS (
        UPDATE "EventProcessingRecord" AS delivery
        SET "status" = 'processing',
            "lockedAt" = ${input.now},
            "lockOwner" = ${input.workerId},
            "leaseToken" = ${leaseToken},
            "attemptCount" = delivery."attemptCount" + 1,
            "firstAttemptAt" = COALESCE(delivery."firstAttemptAt", ${input.now}),
            "lastAttemptAt" = ${input.now},
            "updatedAt" = ${input.now}
        FROM candidates
        WHERE delivery."id" = candidates."id"
        RETURNING delivery.*
      )
      SELECT claimed.*, event."envelope"
      FROM claimed
      INNER JOIN "EventOutbox" AS event ON event."eventId" = claimed."eventId"
    `);
    return rows.map((row) => ({
      ...this.mapDelivery(row),
      envelope: this.hydrateEnvelope(row.envelope),
      leaseToken: row.leaseToken,
    }));
  }

  async markProcessed(id: string, leaseToken: string, now: Date, context: TransactionContext): Promise<void> { const result = await this.contexts.get(context).eventProcessingRecord.updateMany({ where: { id, status: "processing", leaseToken }, data: { status: "processed", processedAt: now, nextRetryAt: null, errorCode: null, errorMessage: null, lockedAt: null, lockOwner: null, leaseToken: null, updatedAt: now } }); if (result.count !== 1) throw new LeaseOwnershipLostError("delivery"); }

  async markFailed(id: string, leaseToken: string, input: { now: Date; nextRetryAt: Date | null; code: string; message: string }, context: TransactionContext): Promise<void> { const result = await this.contexts.get(context).eventProcessingRecord.updateMany({ where: { id, status: "processing", leaseToken }, data: { status: input.nextRetryAt ? "retrying" : "dead_lettered", nextRetryAt: input.nextRetryAt, errorCode: input.code, errorMessage: input.message, lockedAt: null, lockOwner: null, leaseToken: null, updatedAt: input.now } }); if (result.count !== 1) throw new LeaseOwnershipLostError("delivery"); }

  async getStatus(eventId: string, organizationId: string): Promise<EventDeliveryStatus | null> {
    const event = await this.client.eventOutbox.findFirst({ where: { eventId, organizationId }, include: { deliveries: { orderBy: [{ consumer: "asc" }, { handler: "asc" }] } } });
    return event ? { envelope: event.envelope as unknown as EventEnvelope, deliveries: event.deliveries.map((row) => this.mapDelivery(row)) } : null;
  }

  async getDeadLetter(id: string, organizationId: string): Promise<EventDelivery | null> {
    const row = await this.client.eventProcessingRecord.findFirst({ where: { id, event: { organizationId } }, include: { event: true } });
    return row ? { ...this.mapDelivery(row), envelope: row.event.envelope as unknown as EventEnvelope } : null;
  }

  async requeueDeadLetter(id: string, now: Date, context: TransactionContext): Promise<void> { await this.contexts.get(context).eventProcessingRecord.update({ where: { id }, data: { status: "pending", reprocessCount: { increment: 1 }, nextRetryAt: null, errorCode: null, errorMessage: null, lockedAt: null, lockOwner: null, leaseToken: null, updatedAt: now } }); }

  private mapDelivery(row: DeliveryMappingRow): EventProcessingRecord { return { id: row.id, eventId: row.eventId, consumer: row.consumer, handler: row.handler, status: row.status as ProcessingStatus, attemptCount: row.attemptCount, reprocessCount: row.reprocessCount, firstAttemptAt: row.firstAttemptAt, lastAttemptAt: row.lastAttemptAt, processedAt: row.processedAt, nextRetryAt: row.nextRetryAt, errorCode: row.errorCode }; }
  private hydrateEnvelope(value: Prisma.JsonValue): EventEnvelope { const envelope = value as unknown as EventEnvelope; validateEnvelope(envelope); return envelope; }
}
