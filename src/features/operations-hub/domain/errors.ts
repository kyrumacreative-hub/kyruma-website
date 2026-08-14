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
