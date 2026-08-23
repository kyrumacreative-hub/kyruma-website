import type { EventContractRegistry } from "../../event-bus/domain/validation";

export const LEAD_CREATED = "lead.created.v1";
export const LEAD_DISCOVERY_COMPLETED = "lead.discovery-completed.v1";
export const LEAD_QUALIFIED = "lead.qualified.v1";
export const OPERATING_EVENT_TYPES = [LEAD_CREATED, LEAD_DISCOVERY_COMPLETED, LEAD_QUALIFIED] as const;

export interface LeadFunnelEventPayload {
  readonly leadId: string;
  readonly status: "identified" | "discovery_completed" | "qualified";
}

export function registerLeadFunnelContracts(registry: EventContractRegistry): void {
  for (const eventType of OPERATING_EVENT_TYPES) {
    registry.register({
      eventType,
      eventVersion: 1,
      owner: "operating-layer",
      validate: (value): value is LeadFunnelEventPayload => {
        if (!value || typeof value !== "object") return false;
        const candidate = value as Partial<LeadFunnelEventPayload>;
        return typeof candidate.leadId === "string"
          && candidate.leadId.trim().length > 0
          && ["identified", "discovery_completed", "qualified"].includes(candidate.status ?? "");
      },
    });
  }
}

