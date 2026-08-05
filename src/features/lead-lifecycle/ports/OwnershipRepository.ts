import type { TransactionContext } from "./TransactionRunner";

export interface OwnershipRecord { leadId: string; ownerId: string; assignedBy: string; assignedAt: Date; reason?: string; active: boolean; }
export interface OwnershipRepository {
  save(record: OwnershipRecord, context: TransactionContext): Promise<void>;
  findCurrentOwner(leadId: string, context: TransactionContext): Promise<OwnershipRecord | null>;
  findHistory(leadId: string, context: TransactionContext): Promise<OwnershipRecord[]>;
}
