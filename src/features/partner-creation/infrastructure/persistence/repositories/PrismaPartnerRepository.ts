import { Prisma } from "@prisma/client";
import type { Partner } from "../../../domain/partner";
import type { PartnerRepository } from "../../../ports/repositories";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PartnerMapper } from "../partnerMapper";

export class PrismaPartnerRepository implements PartnerRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(partner: Partner, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).partner.create({ data: toRecord(PartnerMapper.toPersistence(partner)) });
  }

  async update(partner: Partner, context: TransactionContext): Promise<void> {
    const record = toRecord(PartnerMapper.toPersistence(partner));
    await this.contexts.get(context).partner.update({ where: { id: partner.id.value }, data: record });
  }

  async findById(partnerId: string, context: TransactionContext): Promise<Partner | null> {
    const record = await this.contexts.get(context).partner.findUnique({ where: { id: partnerId } });
    return record ? PartnerMapper.toDomain(fromRecord(record)) : null;
  }

  async findByLeadId(leadId: string, context: TransactionContext): Promise<Partner | null> {
    const record = await this.contexts.get(context).partner.findUnique({ where: { leadId } });
    return record ? PartnerMapper.toDomain(fromRecord(record)) : null;
  }
}

function toRecord(model: ReturnType<typeof PartnerMapper.toPersistence>): Prisma.PartnerUncheckedCreateInput {
  return { ...model, correlationId: model.correlationId ?? null };
}

function fromRecord(record: Prisma.PartnerGetPayload<Record<string, never>>): ReturnType<typeof PartnerMapper.toPersistence> {
  return { ...record, correlationId: record.correlationId ?? undefined };
}
