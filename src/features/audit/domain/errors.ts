export class AuditError extends Error { constructor(readonly code: string, message: string) { super(message); } }
export class InvalidAuditEventError extends AuditError { constructor(message: string) { super("INVALID_AUDIT_EVENT", message); } }
export class AuditSecretRejectedError extends AuditError { constructor() { super("AUDIT_SECRET_REJECTED", "Audit evidence contains a prohibited field."); } }
export class AuditContractNotFoundError extends AuditError { constructor() { super("AUDIT_CONTRACT_NOT_FOUND", "The audit event contract is not registered."); } }
export class AuditIntegrityConflictError extends AuditError { constructor() { super("AUDIT_INTEGRITY_CONFLICT", "Existing audit evidence contradicts this request."); } }
export class AuditNotFoundError extends AuditError { constructor() { super("AUDIT_NOT_FOUND", "Audit evidence is not available in this scope."); } }
export class AuditAuthorizationError extends AuditError { constructor() { super("AUDIT_FORBIDDEN", "Audit access denied."); } }
export class AuditExportUnavailableError extends AuditError { constructor() { super("AUDIT_EXPORT_UNAVAILABLE", "Audit export infrastructure is unavailable."); } }
