import type { TransactionContext } from "./TransactionRunner";

export type DiscoveryStatus = "pending" | "in_progress" | "completed" | "reviewed";
export interface DiscoveryStatusView { leadId: string; status: DiscoveryStatus; version: number; completedAt?: Date; }

/** Read model contract; Discovery remains owner of its content and versions. */
export interface DiscoveryReadRepository {
  getStatus(leadId: string, context: TransactionContext): Promise<DiscoveryStatusView | null>;
}
