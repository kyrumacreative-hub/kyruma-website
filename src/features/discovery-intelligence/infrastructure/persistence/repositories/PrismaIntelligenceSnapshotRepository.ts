import { Prisma } from "@prisma/client";
import type { DiscoverySourceSnapshot } from "../../../domain/discoverySourceSnapshot";
import type { DiscoverySubmissionId, SourceSnapshotId } from "../../../domain/valueObjects";
import type { IntelligenceSnapshotRepository } from "../../../ports/IntelligenceSnapshotRepository";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { DiscoverySourceSnapshotMapper } from "../discoverySourceSnapshotMapper";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";

export class PrismaIntelligenceSnapshotRepository implements IntelligenceSnapshotRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(snapshot: DiscoverySourceSnapshot, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).intelligenceSnapshot.create({ data: toRecord(DiscoverySourceSnapshotMapper.toPersistence(snapshot)) });
  }
  async findById(id: SourceSnapshotId, context: TransactionContext): Promise<DiscoverySourceSnapshot | null> {
    const record = await this.contexts.get(context).intelligenceSnapshot.findUnique({ where: { id: id.value } });
    return record ? DiscoverySourceSnapshotMapper.toDomain(fromRecord(record)) : null;
  }
  async findByDiscoverySubmission(id: DiscoverySubmissionId, context: TransactionContext): Promise<DiscoverySourceSnapshot[]> {
    const records = await this.contexts.get(context).intelligenceSnapshot.findMany({ where: { discoverySubmissionId: id.value }, orderBy: { submissionVersion: "asc" } });
    return records.map((record) => DiscoverySourceSnapshotMapper.toDomain(fromRecord(record)));
  }
  async findByOrganization(organizationId: string, context: TransactionContext): Promise<DiscoverySourceSnapshot[]> {
    const records = await this.contexts.get(context).intelligenceSnapshot.findMany({ where: { organizationId }, orderBy: { createdAt: "asc" } });
    return records.map((record) => DiscoverySourceSnapshotMapper.toDomain(fromRecord(record)));
  }
}

function toRecord(model: ReturnType<typeof DiscoverySourceSnapshotMapper.toPersistence>): Prisma.IntelligenceSnapshotUncheckedCreateInput {
  return { ...model, payload: model.payload as Prisma.InputJsonValue };
}

function fromRecord(record: Prisma.IntelligenceSnapshotGetPayload<Record<string, never>>): ReturnType<typeof DiscoverySourceSnapshotMapper.toPersistence> {
  return {
    ...record,
    scopeType: record.scopeType as ReturnType<typeof DiscoverySourceSnapshotMapper.toPersistence>["scopeType"],
    partnerId: record.partnerId ?? undefined,
    workspaceId: record.workspaceId ?? undefined,
    payload: record.payload as Readonly<Record<string, unknown>>,
  };
}
