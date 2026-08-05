import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";

/** Public Lead Lifecycle boundary. Partner Creation never reads Lead persistence directly. */
export interface QualifiedLeadReader {
  isQualified(input: { leadId: string; organizationId: string }, context: TransactionContext): Promise<boolean>;
}
