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
