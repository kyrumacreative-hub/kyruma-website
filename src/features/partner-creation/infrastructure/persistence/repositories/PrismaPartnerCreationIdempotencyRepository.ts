import type { PartnerCreationIdempotencyRepository } from "../../../ports/repositories";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";

export class PrismaPartnerCreationIdempotencyRepository implements PartnerCreationIdempotencyRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async find(correlationId: string, context: TransactionContext): Promise<string | null> {
    const record = await this.contexts.get(context).partnerCreationIdempotency.findUnique({ where: { correlationId } });
    return record?.partnerId ?? null;
  }

  async save(correlationId: string, partnerId: string, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).partnerCreationIdempotency.create({ data: { correlationId, partnerId, createdAt: new Date() } });
  }
}
