import { AuditContractNotFoundError, AuditSecretRejectedError, InvalidAuditEventError } from "./errors";
import type { AuditWriteRequest } from "./types";

const SECRET = /(password|passwd|token|secret|credential|api.?key|authorization|cookie|connection.?string|session)/i;
const URL_CREDENTIAL = /^[a-z][a-z0-9+.-]*:\/\/[^\s/@:]+:[^\s/@]+@/i;
const MAX_JSON_BYTES = 16 * 1024;

const unsafe = (value: unknown): boolean => {
  if (typeof value === "string") return URL_CREDENTIAL.test(value);
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(unsafe);
  return Object.entries(value).some(([key, child]) => SECRET.test(key.replace(/[_-]/g, "")) || unsafe(child));
};

export interface AuditContract { readonly eventType: string; readonly schemaVersion: number; readonly metadataFields: readonly string[]; readonly changeFields: readonly string[]; }
export class AuditContractRegistry {
  private readonly contracts = new Map<string, AuditContract>();
  register(contract: AuditContract): void { const key = this.key(contract.eventType, contract.schemaVersion); if (this.contracts.has(key)) throw new InvalidAuditEventError(`Duplicate Audit contract ${key}.`); this.contracts.set(key, contract); }
  validate(request: AuditWriteRequest): void {
    const contract = this.contracts.get(this.key(request.eventType, request.schemaVersion));
    if (!contract) throw new AuditContractNotFoundError();
    if (unsafe(request.metadata) || unsafe(request.changes)) throw new AuditSecretRejectedError();
    if (JSON.stringify(request.metadata).length > MAX_JSON_BYTES || JSON.stringify(request.changes).length > MAX_JSON_BYTES) throw new InvalidAuditEventError("Audit metadata or changes exceed the approved size.");
    if (Object.keys(request.metadata).some((field) => !contract.metadataFields.includes(field)) || Object.keys(request.changes).some((field) => !contract.changeFields.includes(field))) throw new InvalidAuditEventError("Audit evidence contains a field outside the contract allowlist.");
  }
  private key(type: string, version: number): string { return `${type}@${version}`; }
}
