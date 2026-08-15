import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { AuditEvent } from "../domain/AuditEvent";
import type { AuditResult, RetentionCategory } from "../domain/types";

export interface AuditSearchQuery { readonly organizationId: string; readonly partnerId?: string; readonly workspaceId?: string; readonly actorId?: string; readonly resourceType?: string; readonly resourceId?: string; readonly action?: string; readonly result?: AuditResult; readonly correlationId?: string; readonly from: Date; readonly to: Date; readonly after?: { occurredAt: Date; recordedAt: Date; id: string }; readonly limit: number; readonly includeRestrictedSecurity: boolean; }
export interface AuditSearchPage { readonly events: readonly AuditEvent[]; readonly hasMore: boolean; }
export interface AuditPrivacyOverlay { readonly id: string; readonly auditEventId: string; readonly organizationId: string; readonly actorId: string; readonly policyVersion: string; readonly reason: string; readonly replacements: Readonly<Record<string, string>>; readonly createdAt: Date; }
export interface AuditExportEvidence { readonly id: string; readonly organizationId: string; readonly requestedBy: string; readonly from: Date; readonly to: Date; readonly format: string; readonly profile: string; readonly rowCount: number; readonly artifactReference: string; readonly expiresAt: Date; readonly createdAt: Date; }
export interface AuditRetentionExecution { readonly id: string; readonly organizationId: string; readonly policyVersion: string; readonly category: RetentionCategory; readonly dryRun: boolean; readonly affectedCount: number; readonly executedBy: string; readonly executedAt: Date; }

export interface AuditRepository {
  append(event: AuditEvent, context: TransactionContext): Promise<AuditEvent>;
  findIdempotent(event: AuditEvent, context: TransactionContext): Promise<AuditEvent | null>;
  findById(id: string, organizationId: string): Promise<AuditEvent | null>;
  search(query: AuditSearchQuery): Promise<AuditSearchPage>;
  appendPrivacyOverlay(overlay: AuditPrivacyOverlay, context: TransactionContext): Promise<void>;
  saveExport(evidence: AuditExportEvidence, context: TransactionContext): Promise<void>;
  saveRetentionExecution(execution: AuditRetentionExecution, context: TransactionContext): Promise<void>;
  countRetentionCandidates(input: { organizationId: string; category: RetentionCategory; before: Date }): Promise<number>;
}
