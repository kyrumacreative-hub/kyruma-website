export class InvalidProjectValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidProjectValueError";
  }
}

export class InvalidProjectStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidProjectStateError";
  }
}

/** The persisted Project changed after it was loaded for a lifecycle operation. */
export class ProjectConcurrencyError extends Error {
  constructor() {
    super("Project changed before its lifecycle transition could be persisted.");
    this.name = "ProjectConcurrencyError";
  }
}

export class DriveReferenceSyncError extends Error {
  constructor() {
    super("The Project document reference could not be synchronized.");
    this.name = "DriveReferenceSyncError";
  }
}

export class DriveReferenceConfigurationError extends Error {
  constructor() {
    super("Drive integration is not configured.");
    this.name = "DriveReferenceConfigurationError";
  }
}

export class DriveReferenceConflictError extends Error {
  constructor() {
    super("Multiple external folders match the Project canonical reference.");
    this.name = "DriveReferenceConflictError";
  }
}
