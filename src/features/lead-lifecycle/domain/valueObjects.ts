import {
  InvalidLeadIdentifierError,
  InvalidLeadOriginError,
  InvalidLeadStateError,
  MissingOrganizationError,
  MissingOwnerError,
  MissingPrimaryContactError,
} from "./errors";

function required(value: string, error: Error) {
  if (!value.trim()) throw error;
  return value;
}

export class LeadId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new LeadId(required(value, new InvalidLeadIdentifierError("Lead id is required."))); }
}

export class OrganizationId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new OrganizationId(required(value, new MissingOrganizationError("Organization is required."))); }
}

export class ContactId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new ContactId(required(value, new MissingPrimaryContactError("Primary contact is required."))); }
}

export class OwnerId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new OwnerId(required(value, new MissingOwnerError("Owner is required."))); }
}

export class LeadOrigin {
  private constructor(readonly value: string) {}
  static create(value: string) { return new LeadOrigin(required(value, new InvalidLeadOriginError("Lead origin is required."))); }
}

const leadStatuses = ["identified", "discovery_in_progress", "discovery_completed", "qualified", "on_hold", "archived", "partner_created"] as const;
export type LeadStatusValue = (typeof leadStatuses)[number];

export class LeadStatus {
  private constructor(readonly value: LeadStatusValue) {}
  static create(value: string) {
    if (!leadStatuses.includes(value as LeadStatusValue)) throw new InvalidLeadStateError(`Unsupported lead status: ${value}`);
    return new LeadStatus(value as LeadStatusValue);
  }
  static identified() { return new LeadStatus("identified"); }
}
