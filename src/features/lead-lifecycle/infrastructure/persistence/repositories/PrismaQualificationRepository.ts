import type { QualificationRecord, QualificationRepository } from "../../../ports/QualificationRepository";
import type { TransactionContext } from "../../../ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../PrismaTransactionContext";

export class PrismaQualificationRepository implements QualificationRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}
  async save(record: QualificationRecord, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).qualification.create({ data: record });
  }
  async findLatest(leadId: string, context: TransactionContext): Promise<QualificationRecord | null> {
    const record = await this.contexts.get(context).qualification.findFirst({ where: { leadId }, orderBy: { decidedAt: "desc" } });
    return record ? { id: record.id, leadId: record.leadId, decision: record.decision, reason: record.reason, decidedBy: record.decidedBy, decidedAt: record.decidedAt } : null;
  }
}
