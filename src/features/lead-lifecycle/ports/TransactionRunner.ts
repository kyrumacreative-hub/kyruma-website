/** Opaque transaction context. Infrastructure supplies its concrete implementation. */
export interface TransactionContext { readonly transactionContext?: never; }

/**
 * Executes one atomic unit of work. The callback boundary is compatible with
 * Prisma interactive transactions and does not expose provider types to domain code.
 */
export interface TransactionRunner {
  run<T>(operation: (context: TransactionContext) => Promise<T>): Promise<T>;
}
