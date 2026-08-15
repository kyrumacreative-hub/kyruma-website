import test from "node:test";
import assert from "node:assert/strict";
import { AuditEvent } from "../../domain/AuditEvent";
import { AuditEventMapper } from "./AuditEventMapper";
test("round-trips AuditEvent without Prisma leakage", () => { const now = new Date("2026-08-15T08:00:00.000Z"); const event = new AuditEvent({ id: "aud-1", eventType: "lead.created.v1", occurredAt: now, recordedAt: now, actorId: "actor-1", actorType: "user", organizationId: "org-1", partnerId: null, workspaceId: null, resourceType: "Lead", resourceId: "lead-1", action: "create", result: "success", correlationId: "corr-1", causationId: null, requestId: null, source: "lead-lifecycle", metadata: {}, changes: { status: "new" }, schemaVersion: 1, classification: "internal", retentionCategory: "operational_activity", policyVersion: "audit-v1" }); const restored = AuditEventMapper.toDomain(AuditEventMapper.toPersistence(event)); assert.deepEqual(restored.properties, event.properties); });
