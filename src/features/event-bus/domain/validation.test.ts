import test from "node:test";
import assert from "node:assert/strict";
import type { EventEnvelope } from "./contracts";
import { EventContractRegistry, validateEnvelope } from "./validation";
import { EventLoopDetectedError, InvalidEventEnvelopeError } from "./errors";

const envelope = (overrides: Partial<EventEnvelope> = {}): EventEnvelope => ({ eventId: "evt-1", eventType: "workspace.activated.v1", eventVersion: 1, occurredAt: "2026-08-14T09:00:00.000Z", publishedAt: "2026-08-14T09:00:01.000Z", correlationId: "corr-1", causationId: null, organizationId: "org-1", source: "workspace", aggregateType: "Workspace", aggregateId: "ws-1", payload: { workspaceId: "ws-1" }, metadata: { pii: false, processingDepth: 0 }, ...overrides });

test("accepts canonical versioned envelopes and exact contracts", () => { const registry = new EventContractRegistry(); registry.register({ eventType: "workspace.activated.v1", eventVersion: 1, owner: "workspace", validate: (payload): payload is { workspaceId: string } => typeof (payload as { workspaceId?: unknown })?.workspaceId === "string" }); validateEnvelope(envelope()); assert.equal(registry.validate(envelope()), true); assert.equal(registry.supports("workspace.activated.v1", 2), false); });
test("rejects mismatched versions and nested secrets", () => { assert.throws(() => validateEnvelope(envelope({ eventVersion: 2 })), InvalidEventEnvelopeError); assert.throws(() => validateEnvelope(envelope({ payload: { nested: { invitationToken: "unsafe" }, token: "unsafe" } })), InvalidEventEnvelopeError); });
test("protects event chains from excessive depth", () => { assert.throws(() => validateEnvelope(envelope({ metadata: { pii: false, processingDepth: 33 } })), EventLoopDetectedError); });
