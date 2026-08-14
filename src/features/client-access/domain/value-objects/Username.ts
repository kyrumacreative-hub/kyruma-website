export class Username {
  private constructor(
    public readonly value: string,
  ) {}

  static create(value: string): Username {
    if (!/^KYR-\d{3}$/.test(value)) {
      throw new Error("Invalid KYRUMA client code");
    }

    return new Username(value);
  }
}