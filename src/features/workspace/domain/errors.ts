export class InvalidWorkspaceValueError extends Error { constructor(message: string) { super(message); this.name = "InvalidWorkspaceValueError"; } }
export class InvalidWorkspaceStateError extends Error { constructor(message: string) { super(message); this.name = "InvalidWorkspaceStateError"; } }
export class MissingInitialWorkspaceOwnerError extends Error { constructor() { super("A Workspace requires exactly one active initial Owner."); this.name = "MissingInitialWorkspaceOwnerError"; } }
export class DuplicateWorkspaceOwnerError extends Error { constructor() { super("A Workspace cannot have more than one active Owner."); this.name = "DuplicateWorkspaceOwnerError"; } }
export class InvalidWorkspaceInvitationError extends Error { constructor(message: string) { super(message); this.name = "InvalidWorkspaceInvitationError"; } }
export class DuplicateWorkspaceMemberError extends Error { constructor() { super("A Membership can only appear once in a Workspace."); this.name = "DuplicateWorkspaceMemberError"; } }
export class WorkspaceOwnerRemovalError extends Error { constructor() { super("The active Workspace Owner cannot be removed."); this.name = "WorkspaceOwnerRemovalError"; } }
