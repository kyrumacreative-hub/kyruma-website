import { randomUUID } from "node:crypto";
import type { OwnershipRecord, OwnershipRepository } from "../../../ports/OwnershipRepository";
import type { TransactionContext } from "../../../ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../PrismaTransactionContext";

export class PrismaOwnershipRepository implements OwnershipRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}
  async save(record: OwnershipRecord, context: TransactionContext): Promise<void> {
    const client = this.contexts.get(context);
    if (record.active) await client.ownership.updateMany({ where: { leadId: record.leadId, active: true }, data: { active: false } });
    await client.ownership.create({ data: { id: randomUUID(), ...record } });
  }
  async findCurrentOwner(leadId: string, context: TransactionContext): Promise<OwnershipRecord | null> {
    const record = await this.contexts.get(context).ownership.findFirst({ where: { leadId, active: true }, orderBy: { assignedAt: "desc" } });
    return record ? this.toRecord(record) : null;
  }
  async findHistory(leadId: string, context: TransactionContext): Promise<OwnershipRecord[]> {
    return (await this.contexts.get(context).ownership.findMany({ where: { leadId }, orderBy: { assignedAt: "asc" } })).map((record) => this.toRecord(record));
  }
  private toRecord(record: { leadId: string; ownerId: string; assignedBy: string; assignedAt: Date; reason: string | null; active: boolean }): OwnershipRecord {
    return { leadId: record.leadId, ownerId: record.ownerId, assignedBy: record.assignedBy, assignedAt: record.assignedAt, reason: record.reason ?? undefined, active: record.active };
  }
}
