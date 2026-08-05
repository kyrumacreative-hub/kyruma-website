import type { TransactionContext } from "./TransactionRunner";

export type QualificationStatus = "none" | "open" | "completed";
export interface QualificationStatusView { leadId: string; status: QualificationStatus; qualificationId?: string; }

/** Read contract for enforcing the single open Qualification invariant. */
export interface QualificationStatusRepository {
  getStatus(leadId: string, context: TransactionContext): Promise<QualificationStatusView>;
}
