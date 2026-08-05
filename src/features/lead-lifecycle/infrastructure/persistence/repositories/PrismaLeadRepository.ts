import { Prisma } from "@prisma/client";
import { DuplicateActiveLeadError } from "../../../domain/errors";
import type { LeadAggregate } from "../../../domain/lead";
import { LeadMapper } from "../leadMapper";
import { PrismaTransactionContextStore } from "../PrismaTransactionContext";
import type { LeadRepository } from "../../../ports/LeadRepository";
import type { TransactionContext } from "../../../ports/TransactionRunner";

export class PrismaLeadRepository implements LeadRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(lead: LeadAggregate, context: TransactionContext): Promise<void> {
    try { await this.contexts.get(context).lead.create({ data: LeadMapper.toPersistence(lead) }); }
    catch (error) { this.mapUniqueLead(error); }
  }
  async findById(id: string, context: TransactionContext): Promise<LeadAggregate | null> {
    const record = await this.contexts.get(context).lead.findUnique({ where: { id } });
    return record ? LeadMapper.toDomain(record) : null;
  }
  async findByOrganization(organizationId: string, context: TransactionContext): Promise<LeadAggregate[]> {
    const records = await this.contexts.get(context).lead.findMany({ where: { organizationId }, orderBy: { createdAt: "asc" } });
    return records.map(LeadMapper.toDomain);
  }
  async findActiveByOrganization(organizationId: string, context: TransactionContext): Promise<LeadAggregate | null> {
    const record = await this.contexts.get(context).lead.findFirst({ where: { organizationId, status: { notIn: ["archived", "partner_created"] } }, orderBy: { createdAt: "asc" } });
    return record ? LeadMapper.toDomain(record) : null;
  }
  async exists(id: string, context: TransactionContext): Promise<boolean> { return Boolean(await this.contexts.get(context).lead.findUnique({ where: { id }, select: { id: true } })); }
  async update(lead: LeadAggregate, context: TransactionContext): Promise<void> {
    try { await this.contexts.get(context).lead.update({ where: { id: lead.id.value }, data: LeadMapper.toPersistence(lead) }); }
    catch (error) { this.mapUniqueLead(error); }
  }
  private mapUniqueLead(error: unknown): never | void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new DuplicateActiveLeadError("An active Lead already exists for this Organization.");
    throw error;
  }
}
