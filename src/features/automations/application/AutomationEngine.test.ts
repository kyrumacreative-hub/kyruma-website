import test from "node:test";
import assert from "node:assert/strict";
import { AutomationEngine } from "./AutomationEngine";
import type { AutomationRepository } from "../ports/AutomationPorts";
import type { AutomationRun } from "../domain/types";

const event = { eventId: "event-1", eventType: "workspace.activated", eventVersion: 1, occurredAt: "2026-08-15T10:00:00Z", publishedAt: "2026-08-15T10:00:00Z", correlationId: "correlation-1", causationId: null, organizationId: "org-1", source: "workspace", aggregateType: "Workspace", aggregateId: "workspace-1", payload: { status: "active" }, metadata: { pii: false, processingDepth: 0 } } as const;

test("matching automation executes once for an Event Bus event", async () => {
  let run: AutomationRun | null = null; let executions = 0;
  const repository: AutomationRepository = { findActiveFor: async () => [{ id: "automation-1", organizationId: "org-1", name: "Welcome", status: "active", triggerType: "workspace.activated", triggerVersion: 1, conditions: { status: "active" }, actionType: "portal.activity.publish", actionConfig: {}, version: 1 }], findRun: async () => run, startRun: async (value) => { run = value; }, completeRun: async () => undefined, failRun: async () => undefined };
  const engine = new AutomationEngine(repository, [{ type: "portal.activity.publish", execute: async () => { executions += 1; return { published: true }; } }], () => "run-1", () => new Date("2026-08-15T10:00:00Z"));
  await engine.handle(event, {}); await engine.handle(event, {});
  assert.equal(executions, 1);
});

test("intelligence action requires human review policy", async () => {
  const repository: AutomationRepository = { findActiveFor: async () => [{ id: "automation-1", organizationId: "org-1", name: "Unsafe", status: "active", triggerType: "workspace.activated", triggerVersion: 1, conditions: {}, actionType: "intelligence.request", actionConfig: {}, version: 1 }], findRun: async () => null, startRun: async () => undefined, completeRun: async () => undefined, failRun: async () => undefined };
  const engine = new AutomationEngine(repository, [], () => "run-1", () => new Date());
  await assert.rejects(engine.handle(event, {}), /INTELLIGENCE_HUMAN_REVIEW_REQUIRED/);
});

