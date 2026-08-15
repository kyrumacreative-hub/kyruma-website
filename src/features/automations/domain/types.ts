import type { EventEnvelope } from "../../event-bus/domain/contracts";

export type AutomationStatus = "draft" | "active" | "paused" | "archived";
export type AutomationActionType = "portal.activity.publish" | "notification.request" | "intelligence.request";
export interface AutomationDefinition {
  id: string; organizationId: string; name: string; status: AutomationStatus;
  triggerType: string; triggerVersion: number; conditions: Readonly<Record<string, string | number | boolean>>;
  actionType: AutomationActionType; actionConfig: Readonly<Record<string, unknown>>; version: number;
}
export interface AutomationRun { id: string; automationId: string; organizationId: string; sourceEventId: string; correlationId: string; status: "running" | "completed" | "failed"; attemptCount: number; startedAt: Date; completedAt?: Date; result?: Readonly<Record<string, unknown>>; errorCode?: string }
export interface AutomationContext { definition: AutomationDefinition; event: EventEnvelope; runId: string; now: Date }

