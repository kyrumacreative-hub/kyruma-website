export class PartnerPersistenceNotConfiguredError extends Error { constructor() { super("Partner persistence is not configured."); this.name = "PartnerPersistenceNotConfiguredError"; } }
