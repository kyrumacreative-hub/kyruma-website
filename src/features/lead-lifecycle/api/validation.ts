import { InvalidHttpInputError } from "./errors";

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InvalidHttpInputError("A JSON object is required.");
  return value as Record<string, unknown>;
}

export function id(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim() || value.length > 160) throw new InvalidHttpInputError(`${name} is invalid.`);
  return value.trim();
}
export function text(value: unknown, name: string, max = 2_000): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new InvalidHttpInputError(`${name} is invalid.`);
  return value.trim();
}
export function boolean(value: unknown, name: string): boolean {
  if (typeof value !== "boolean") throw new InvalidHttpInputError(`${name} is invalid.`);
  return value;
}
export function body(value: unknown): Record<string, unknown> { return record(value); }
