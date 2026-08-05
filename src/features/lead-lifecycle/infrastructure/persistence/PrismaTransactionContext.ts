import type { Prisma } from "@prisma/client";
import type { TransactionContext } from "../../ports/TransactionRunner";

/** Keeps the provider transaction behind the opaque domain transaction context. */
export class PrismaTransactionContextStore {
  private readonly contexts = new WeakMap<TransactionContext, Prisma.TransactionClient>();

  bind(context: TransactionContext, transaction: Prisma.TransactionClient): void { this.contexts.set(context, transaction); }
  get(context: TransactionContext): Prisma.TransactionClient {
    const transaction = this.contexts.get(context);
    if (!transaction) throw new PrismaTransactionContextMissingError();
    return transaction;
  }
}

export class PrismaTransactionContextMissingError extends Error {
  readonly code = "PRISMA_TRANSACTION_CONTEXT_MISSING";
  constructor() { super("A Prisma transaction context is required."); }
}
