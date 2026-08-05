export interface QualificationRecord { id: string; leadId: string; decision: string; reason: string; decidedBy: string; decidedAt: Date; }
export interface QualificationRepository {
  save(record: QualificationRecord): Promise<void>;
  findLatest(leadId: string): Promise<QualificationRecord | null>;
}
