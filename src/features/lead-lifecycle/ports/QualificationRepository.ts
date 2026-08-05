import type { TransactionContext } from "./TransactionRunner";

export interface QualificationRecord { id: string; leadId: string; decision: string; reason: string; decidedBy: string; decidedAt: Date; }
export interface QualificationRepository {
  save(record: QualificationRecord, context: TransactionContext): Promise<void>;
  findLatest(leadId: string, context: TransactionContext): Promise<QualificationRecord | null>;
}
