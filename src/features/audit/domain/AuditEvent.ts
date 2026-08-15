import { InvalidAuditEventError } from "./errors";
import type { AuditEventProperties } from "./types";

const TYPE = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\.v[1-9]\d*$/;
const required = (value: string, name: string): string => { const normalized = value.trim(); if (!normalized) throw new InvalidAuditEventError(`${name} is required.`); return normalized; };

export class AuditEvent {
  readonly properties: AuditEventProperties;
  constructor(properties: AuditEventProperties) {
    required(properties.id, "id"); required(properties.actorId, "actorId"); required(properties.organizationId, "organizationId"); required(properties.resourceType, "resourceType"); required(properties.resourceId, "resourceId"); required(properties.action, "action"); required(properties.correlationId, "correlationId"); required(properties.source, "source"); required(properties.policyVersion, "policyVersion");
    if (!TYPE.test(properties.eventType) || !properties.eventType.endsWith(`.v${properties.schemaVersion}`)) throw new InvalidAuditEventError("eventType and schemaVersion must use the canonical form.");
    if (!Number.isInteger(properties.schemaVersion) || properties.schemaVersion < 1) throw new InvalidAuditEventError("schemaVersion must be a positive integer.");
    if (Number.isNaN(properties.occurredAt.getTime()) || Number.isNaN(properties.recordedAt.getTime())) throw new InvalidAuditEventError("Audit timestamps are invalid.");
    this.properties = Object.freeze({ ...properties, metadata: Object.freeze({ ...properties.metadata }), changes: Object.freeze({ ...properties.changes }) });
    Object.freeze(this);
  }
}
