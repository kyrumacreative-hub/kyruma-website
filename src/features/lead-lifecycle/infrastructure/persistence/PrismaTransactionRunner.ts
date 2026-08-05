import type { Prisma, PrismaClient } from "@prisma/client";
import type { TransactionContext, TransactionRunner } from "../../ports/TransactionRunner";
import { PrismaTransactionContextStore } from "./PrismaTransactionContext";

export interface PersistenceObserver {
  transactionCompleted(input: { durationMs: number }): void;
  transactionFailed(input: { durationMs: number; rolledBack: true }): void;
}

export const noopPersistenceObserver: PersistenceObserver = { transactionCompleted: () => undefined, transactionFailed: () => undefined };

export class PrismaTransactionRunner implements TransactionRunner {
  constructor(
    private readonly client: PrismaClient,
    private readonly contexts: PrismaTransactionContextStore,
    private readonly observer: PersistenceObserver = noopPersistenceObserver,
  ) {}

  async run<T>(operation: (context: TransactionContext) => Promise<T>): Promise<T> {
    const startedAt = performance.now();
    try {
      const result = await this.client.$transaction(async (transaction: Prisma.TransactionClient) => {
        const context: TransactionContext = {};
        this.contexts.bind(context, transaction);
        return operation(context);
      });
      this.observer.transactionCompleted({ durationMs: performance.now() - startedAt });
      return result;
    } catch (error) {
      this.observer.transactionFailed({ durationMs: performance.now() - startedAt, rolledBack: true });
      throw error;
    }
  }
}
