export class WorkspacePersistenceNotConfiguredError extends Error { readonly code = "WORKSPACE_PERSISTENCE_NOT_CONFIGURED"; constructor() { super("Workspace persistence is not configured."); } }
