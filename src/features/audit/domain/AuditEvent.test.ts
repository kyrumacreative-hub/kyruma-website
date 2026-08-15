import test from "node:test";
import assert from "node:assert/strict";
import { AuditEvent } from "./AuditEvent";
import { AuditContractRegistry } from "./contracts";
import { AuditSecretRejectedError, InvalidAuditEventError } from "./errors";
import type { AuditEventProperties, AuditWriteRequest } from "./types";

const now = new Date("2026-08-15T08:00:00.000Z");
const properties = (overrides: Partial<AuditEventProperties> = {}): AuditEventProperties => ({ id: "aud-1", eventType: "workspace.activated.v1", occurredAt: now, recordedAt: now, actorId: "actor-1", actorType: "user", organizationId: "org-1", partnerId: "partner-1", workspaceId: "workspace-1", resourceType: "Workspace", resourceId: "workspace-1", action: "activate", result: "success", correlationId: "corr-1", causationId: null, requestId: null, source: "workspace", metadata: { channel: "application" }, changes: { status: "active" }, schemaVersion: 1, classification: "internal", retentionCategory: "operational_activity", policyVersion: "audit-v1", ...overrides });
test("creates deeply immutable canonical evidence", () => { const event = new AuditEvent(properties()); assert.equal(Object.isFrozen(event), true); assert.equal(Object.isFrozen(event.properties.metadata), true); assert.equal(event.properties.result, "success"); });
test("requires explicit actor organization and matching version", () => { assert.throws(() => new AuditEvent(properties({ actorId: "" })), InvalidAuditEventError); assert.throws(() => new AuditEvent(properties({ schemaVersion: 2 })), InvalidAuditEventError); });
test("enforces deny-by-default field contracts and secret exclusion", () => { const registry = new AuditContractRegistry(); registry.register({ eventType: "workspace.activated.v1", schemaVersion: 1, metadataFields: ["channel"], changeFields: ["status"] }); const request = properties() as AuditWriteRequest; registry.validate(request); assert.throws(() => registry.validate({ ...request, metadata: { password: "unsafe" } }), AuditSecretRejectedError); assert.throws(() => registry.validate({ ...request, changes: { unknown: "value" } }), InvalidAuditEventError); });
