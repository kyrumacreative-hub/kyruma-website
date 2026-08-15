export class AuditPersistenceError extends Error { readonly code = "AUDIT_PERSISTENCE_ERROR"; constructor() { super("Audit persistence is unavailable."); } }
