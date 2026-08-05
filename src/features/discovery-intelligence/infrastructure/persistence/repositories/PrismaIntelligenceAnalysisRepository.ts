import { Prisma } from "@prisma/client";
import type { IntelligenceAnalysis } from "../../../domain/intelligenceAnalysis";
import type { CorrelationId, DiscoverySubmissionId, IntelligenceAnalysisId, SourceSnapshotId } from "../../../domain/valueObjects";
import type { IntelligenceAnalysisRepository } from "../../../ports/IntelligenceAnalysisRepository";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { IntelligenceAnalysisMapper } from "../intelligenceAnalysisMapper";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";

export class PrismaIntelligenceAnalysisRepository implements IntelligenceAnalysisRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(analysis: IntelligenceAnalysis, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).intelligenceAnalysis.create({ data: toRecord(IntelligenceAnalysisMapper.toPersistence(analysis)) });
  }
  async update(analysis: IntelligenceAnalysis, context: TransactionContext): Promise<void> {
    const record = toRecord(IntelligenceAnalysisMapper.toPersistence(analysis));
    await this.contexts.get(context).intelligenceAnalysis.update({ where: { id: analysis.id.value }, data: record });
  }
  async findById(id: IntelligenceAnalysisId, context: TransactionContext): Promise<IntelligenceAnalysis | null> {
    const record = await this.contexts.get(context).intelligenceAnalysis.findUnique({ where: { id: id.value } });
    return record ? IntelligenceAnalysisMapper.toDomain(fromRecord(record)) : null;
  }
  async findByCorrelationId(correlationId: CorrelationId, sourceSnapshotId: SourceSnapshotId, context: TransactionContext): Promise<IntelligenceAnalysis | null> {
    const record = await this.contexts.get(context).intelligenceAnalysis.findUnique({ where: { sourceSnapshotId_correlationId: { sourceSnapshotId: sourceSnapshotId.value, correlationId: correlationId.value } } });
    return record ? IntelligenceAnalysisMapper.toDomain(fromRecord(record)) : null;
  }
  async findBySnapshotId(snapshotId: SourceSnapshotId, context: TransactionContext): Promise<IntelligenceAnalysis[]> {
    const records = await this.contexts.get(context).intelligenceAnalysis.findMany({ where: { sourceSnapshotId: snapshotId.value }, orderBy: { analysisVersion: "asc" } });
    return records.map((record) => IntelligenceAnalysisMapper.toDomain(fromRecord(record)));
  }
  async findHistoryByDiscoverySubmission(id: DiscoverySubmissionId, context: TransactionContext): Promise<IntelligenceAnalysis[]> {
    const records = await this.contexts.get(context).intelligenceAnalysis.findMany({ where: { discoverySubmissionId: id.value }, orderBy: { analysisVersion: "asc" } });
    return records.map((record) => IntelligenceAnalysisMapper.toDomain(fromRecord(record)));
  }
}

function toRecord(model: ReturnType<typeof IntelligenceAnalysisMapper.toPersistence>): Prisma.IntelligenceAnalysisUncheckedCreateInput {
  return model;
}

function fromRecord(record: Prisma.IntelligenceAnalysisGetPayload<Record<string, never>>): ReturnType<typeof IntelligenceAnalysisMapper.toPersistence> {
  return {
    ...record,
    status: record.status as ReturnType<typeof IntelligenceAnalysisMapper.toPersistence>["status"],
    modelRunId: record.modelRunId ?? undefined,
    generatedAt: record.generatedAt ?? undefined,
    failedAt: record.failedAt ?? undefined,
    archivedAt: record.archivedAt ?? undefined,
    confidence: record.confidence ?? undefined,
  };
}
