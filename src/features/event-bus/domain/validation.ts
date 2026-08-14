import { EventLoopDetectedError, InvalidEventEnvelopeError } from "./errors";
import type { EventEnvelope } from "./contracts";

const FORBIDDEN_KEYS = /^(password|token|secret|credential|credentials|cookie|connectionstring|authorization)$/i;
const EVENT_TYPE = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\.v[1-9]\d*$/;

function hasForbiddenKey(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasForbiddenKey);
  return Object.entries(value).some(([key, child]) => FORBIDDEN_KEYS.test(key.replace(/[_-]/g, "")) || hasForbiddenKey(child));
}

export function validateEnvelope(envelope: EventEnvelope, maxDepth = 32): void {
  const required = [envelope.eventId, envelope.eventType, envelope.occurredAt, envelope.publishedAt, envelope.correlationId, envelope.organizationId, envelope.source, envelope.aggregateType, envelope.aggregateId];
  if (required.some((value) => !value?.trim())) throw new InvalidEventEnvelopeError("Required envelope fields must be non-empty.");
  if (!EVENT_TYPE.test(envelope.eventType) || !Number.isInteger(envelope.eventVersion) || envelope.eventVersion < 1 || !envelope.eventType.endsWith(`.v${envelope.eventVersion}`)) throw new InvalidEventEnvelopeError("Event type and version must use the canonical versioned form.");
  if (Number.isNaN(Date.parse(envelope.occurredAt)) || Number.isNaN(Date.parse(envelope.publishedAt))) throw new InvalidEventEnvelopeError("Event timestamps must be ISO-8601 values.");
  if (!Number.isInteger(envelope.metadata.processingDepth) || envelope.metadata.processingDepth < 0) throw new InvalidEventEnvelopeError("Processing depth must be a non-negative integer.");
  if (envelope.metadata.processingDepth > maxDepth) throw new EventLoopDetectedError();
  if (hasForbiddenKey(envelope.payload) || hasForbiddenKey(envelope.metadata)) throw new InvalidEventEnvelopeError("Event data contains a forbidden secret-bearing field.");
}

export interface EventContract<T = unknown> { readonly eventType: string; readonly eventVersion: number; readonly owner: string; validate(payload: unknown): payload is T; }
export class EventContractRegistry {
  private readonly contracts = new Map<string, EventContract>();
  register(contract: EventContract): void { const key = this.key(contract.eventType, contract.eventVersion); if (this.contracts.has(key)) throw new InvalidEventEnvelopeError(`Duplicate contract ${key}.`); this.contracts.set(key, contract); }
  supports(type: string, version: number): boolean { return this.contracts.has(this.key(type, version)); }
  validate(envelope: EventEnvelope): boolean { return this.contracts.get(this.key(envelope.eventType, envelope.eventVersion))?.validate(envelope.payload) ?? false; }
  private key(type: string, version: number): string { return `${type}@${version}`; }
}
