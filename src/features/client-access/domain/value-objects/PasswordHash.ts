export class PasswordHash {
  private constructor(
    public readonly value: string,
  ) {}

  static create(value: string): PasswordHash {
    if (!value) {
      throw new Error("Password hash required");
    }

    return new PasswordHash(value);
  }
}