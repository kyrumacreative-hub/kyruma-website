export class InvalidPartnerValueError extends Error { constructor(message: string) { super(message); this.name = "InvalidPartnerValueError"; } }
export class InvalidPartnerStateError extends Error { constructor(message: string) { super(message); this.name = "InvalidPartnerStateError"; } }
export class MissingPrimaryWorkspaceError extends Error { constructor() { super("A primary Workspace is required."); this.name = "MissingPrimaryWorkspaceError"; } }
export class MissingInitialOwnerError extends Error { constructor() { super("An initial Owner Membership is required."); this.name = "MissingInitialOwnerError"; } }
