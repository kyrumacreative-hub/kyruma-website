import { Prisma } from "@prisma/client";
import type { PartnerCodeSequenceRepository } from "../../../ports/repositories";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";

/** Allocates from PostgreSQL's native, non-reusable sequence. */
export class PrismaPartnerCodeSequenceRepository implements PartnerCodeSequenceRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async allocate(context: TransactionContext): Promise<number> {
    const rows = await this.contexts.get(context).$queryRaw<{ allocated: number }[]>(Prisma.sql`SELECT nextval('"PartnerCodeSequence_value_seq"') AS allocated`);
    if (rows.length !== 1) throw new PartnerCodeSequenceUnavailableError();
    return Number(rows[0].allocated);
  }
}

export class PartnerCodeSequenceUnavailableError extends Error {
  readonly code = "PARTNER_CODE_SEQUENCE_UNAVAILABLE";
  constructor() { super("The Partner code sequence is unavailable."); }
}
