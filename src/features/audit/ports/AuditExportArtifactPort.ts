import type { AuditEvent } from "../domain/AuditEvent";
export interface AuditExportArtifact { readonly reference: string; readonly rowCount: number; }
export interface AuditExportArtifactPort { generate(input: { organizationId: string; events: readonly AuditEvent[]; format: string; profile: string; expiresAt: Date }): Promise<AuditExportArtifact>; }
