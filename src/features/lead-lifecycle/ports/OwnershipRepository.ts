export interface OwnershipRecord { leadId: string; ownerId: string; assignedBy: string; assignedAt: Date; reason?: string; active: boolean; }
export interface OwnershipRepository {
  save(record: OwnershipRecord): Promise<void>;
  findCurrentOwner(leadId: string): Promise<OwnershipRecord | null>;
  findHistory(leadId: string): Promise<OwnershipRecord[]>;
}
