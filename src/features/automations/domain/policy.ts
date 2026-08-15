import type { EventEnvelope } from "../../event-bus/domain/contracts";
import type { AutomationActionType, AutomationDefinition } from "./types";

export const actionCatalog: readonly AutomationActionType[] = ["portal.activity.publish", "notification.request", "intelligence.request"];

export function matchesAutomation(definition: AutomationDefinition, event: EventEnvelope): boolean {
  if (definition.status !== "active" || definition.organizationId !== event.organizationId || definition.triggerType !== event.eventType || definition.triggerVersion !== event.eventVersion) return false;
  return Object.entries(definition.conditions).every(([key, expected]) => readPath(event.payload, key) === expected);
}

export function validateAutomation(definition: AutomationDefinition): void {
  if (!definition.organizationId || !definition.name.trim() || definition.version < 1 || definition.triggerVersion < 1) throw new Error("AUTOMATION_INVALID");
  if (!actionCatalog.includes(definition.actionType)) throw new Error("AUTOMATION_ACTION_NOT_ALLOWED");
  if (definition.actionType === "intelligence.request" && definition.actionConfig.humanReviewRequired !== true) throw new Error("INTELLIGENCE_HUMAN_REVIEW_REQUIRED");
}

function readPath(payload: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, part) => value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined, payload);
}

