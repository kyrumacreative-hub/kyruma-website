/** Opaque transaction context. Persistence infrastructure supplies its concrete implementation. */
export interface TransactionContext { readonly transactionContext?: never; }

/**
 * Canonical callback transaction boundary approved by ADR-001.
 * It deliberately exposes no provider-specific transaction details to the domain.
 */
export interface TransactionRunner {
  run<T>(operation: (context: TransactionContext) => Promise<T>): Promise<T>;
}
