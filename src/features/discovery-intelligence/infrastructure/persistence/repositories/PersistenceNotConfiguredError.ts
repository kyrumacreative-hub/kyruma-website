export class PersistenceNotConfiguredError extends Error {
  constructor(adapter: string) {
    super(`${adapter} requires an approved persistence adapter configuration.`);
    this.name = "PersistenceNotConfiguredError";
  }
}
