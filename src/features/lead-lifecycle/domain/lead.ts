import type { CreateLeadInput, Lead } from "./types";

export class LeadValidationError extends Error {
  readonly code = "LEAD_VALIDATION_ERROR";
}

function requireValue(value: string, field: string) {
  if (!value.trim()) throw new LeadValidationError(`${field} is required.`);
  return value;
}

export function createLead(input: CreateLeadInput): Lead {
  return {
    id: requireValue(input.id, "id"),
    organizationId: requireValue(input.organizationId, "organizationId"),
    ownerId: requireValue(input.ownerId, "ownerId"),
    primaryContactId: requireValue(input.primaryContactId, "primaryContactId"),
    origin: requireValue(input.origin, "origin"),
    status: "identified",
    createdAt: input.createdAt,
    createdBy: requireValue(input.createdBy, "createdBy"),
  };
}
