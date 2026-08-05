import type { TransactionContext } from "./TransactionRunner";

/** Minimal pre-Partner audit envelope. Provider-specific persistence remains outside the domain. */
export interface LeadAuditContext {
  actorId: string;
  organizationId: string;
  membershipId: string;
  timestamp: Date;
  action: string;
}

export interface AuditContextRecorder {
  record(entry: LeadAuditContext, context: TransactionContext): Promise<void>;
}
