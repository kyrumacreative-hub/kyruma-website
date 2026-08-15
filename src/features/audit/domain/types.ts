export const auditResults = ["success", "denied", "failed"] as const;
export type AuditResult = (typeof auditResults)[number];
export const actorTypes = ["user", "system"] as const;
export type AuditActorType = (typeof actorTypes)[number];
export const auditClassifications = ["internal", "restricted_security"] as const;
export type AuditClassification = (typeof auditClassifications)[number];
export const retentionCategories = ["security_identity", "authorization_permissions", "data_operations", "export_privacy", "operational_activity", "errors_denied"] as const;
export type RetentionCategory = (typeof retentionCategories)[number];

export interface AuditEventProperties {
  readonly id: string;
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly recordedAt: Date;
  readonly actorId: string;
  readonly actorType: AuditActorType;
  readonly organizationId: string;
  readonly partnerId: string | null;
  readonly workspaceId: string | null;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly action: string;
  readonly result: AuditResult;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly requestId: string | null;
  readonly source: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly changes: Readonly<Record<string, unknown>>;
  readonly schemaVersion: number;
  readonly classification: AuditClassification;
  readonly retentionCategory: RetentionCategory;
  readonly policyVersion: string;
}

export interface AuditWriteRequest extends Omit<AuditEventProperties, "id" | "recordedAt"> { readonly id?: string; }
