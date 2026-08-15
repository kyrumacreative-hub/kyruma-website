import type { Prisma, PrismaClient } from "@prisma/client";
import type { TransactionContext } from "../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { AuditEvent } from "../../domain/AuditEvent";
import type { AuditRepository, AuditSearchPage, AuditSearchQuery, AuditPrivacyOverlay, AuditExportEvidence, AuditRetentionExecution } from "../../ports/AuditRepository";
import { AuditEventMapper } from "./AuditEventMapper";
import type { AuditEventPersistenceModel } from "./models";

type AuditRow = NonNullable<Awaited<ReturnType<PrismaClient["auditEvent"]["findUnique"]>>>;

const mapRow = (row: AuditRow): AuditEvent => AuditEventMapper.toDomain({
  ...row,
  metadata: row.metadata as Readonly<Record<string, unknown>>,
  changes: row.changes as Readonly<Record<string, unknown>>,
} as AuditEventPersistenceModel);

export class PrismaAuditRepository implements AuditRepository {
  constructor(private readonly client: PrismaClient, private readonly contexts: PrismaTransactionContextStore) {}

  async append(event: AuditEvent, context: TransactionContext): Promise<AuditEvent> {
    const value = AuditEventMapper.toPersistence(event);
    const row = await this.contexts.get(context).auditEvent.create({ data: {
      ...value,
      metadata: value.metadata as Prisma.InputJsonValue,
      changes: value.changes as Prisma.InputJsonValue,
    } });
    return mapRow(row);
  }

  async findIdempotent(event: AuditEvent, context: TransactionContext): Promise<AuditEvent | null> {
    const value = event.properties;
    const row = await this.contexts.get(context).auditEvent.findUnique({ where: { organizationId_correlationId_eventType_resourceType_resourceId_schemaVersion: {
      organizationId: value.organizationId, correlationId: value.correlationId, eventType: value.eventType,
      resourceType: value.resourceType, resourceId: value.resourceId, schemaVersion: value.schemaVersion,
    } } });
    return row ? mapRow(row) : null;
  }

  async findById(id: string, organizationId: string): Promise<AuditEvent | null> {
    const row = await this.client.auditEvent.findFirst({ where: { id, organizationId } });
    return row ? mapRow(row) : null;
  }

  async search(query: AuditSearchQuery): Promise<AuditSearchPage> {
    const cursor = query.after ? { OR: [
      { occurredAt: { lt: query.after.occurredAt } },
      { occurredAt: query.after.occurredAt, recordedAt: { lt: query.after.recordedAt } },
      { occurredAt: query.after.occurredAt, recordedAt: query.after.recordedAt, id: { lt: query.after.id } },
    ] } : {};
    const rows = await this.client.auditEvent.findMany({ where: {
      organizationId: query.organizationId,
      occurredAt: { gte: query.from, lte: query.to },
      ...(query.partnerId ? { partnerId: query.partnerId } : {}), ...(query.workspaceId ? { workspaceId: query.workspaceId } : {}),
      ...(query.actorId ? { actorId: query.actorId } : {}), ...(query.resourceType ? { resourceType: query.resourceType } : {}),
      ...(query.resourceId ? { resourceId: query.resourceId } : {}), ...(query.action ? { action: query.action } : {}),
      ...(query.result ? { result: query.result } : {}), ...(query.correlationId ? { correlationId: query.correlationId } : {}),
      ...(!query.includeRestrictedSecurity ? { classification: { not: "restricted_security" } } : {}), ...cursor,
    }, orderBy: [{ occurredAt: "desc" }, { recordedAt: "desc" }, { id: "desc" }], take: query.limit + 1 });
    return { events: rows.slice(0, query.limit).map(mapRow), hasMore: rows.length > query.limit };
  }

  async appendPrivacyOverlay(overlay: AuditPrivacyOverlay, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).auditPrivacyOverlay.create({ data: { ...overlay, replacements: overlay.replacements as Prisma.InputJsonValue } });
  }
  async saveExport(evidence: AuditExportEvidence, context: TransactionContext): Promise<void> { await this.contexts.get(context).auditExportEvidence.create({ data: evidence }); }
  async saveRetentionExecution(execution: AuditRetentionExecution, context: TransactionContext): Promise<void> { await this.contexts.get(context).auditRetentionExecution.create({ data: execution }); }
  countRetentionCandidates(input: { organizationId: string; category: AuditRetentionExecution["category"]; before: Date }): Promise<number> { return this.client.auditEvent.count({ where: { organizationId: input.organizationId, retentionCategory: input.category, occurredAt: { lt: input.before } } }); }
}
