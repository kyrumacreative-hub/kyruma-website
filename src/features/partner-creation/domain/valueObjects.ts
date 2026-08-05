import { InvalidPartnerStateError, InvalidPartnerValueError } from "./errors";
const required = (value: string, field: string) => { if (!value.trim()) throw new InvalidPartnerValueError(`${field} is required.`); return value; };
export class PartnerId { private constructor(readonly value: string) {} static create(value: string) { return new PartnerId(required(value, "Partner id")); } }
export class WorkspaceId { private constructor(readonly value: string) {} static create(value: string) { return new WorkspaceId(required(value, "Workspace id")); } }
export class MembershipId { private constructor(readonly value: string) {} static create(value: string) { return new MembershipId(required(value, "Membership id")); } }
export class LeadId { private constructor(readonly value: string) {} static create(value: string) { return new LeadId(required(value, "Lead id")); } }
export class OrganizationId { private constructor(readonly value: string) {} static create(value: string) { return new OrganizationId(required(value, "Organization id")); } }
export class PartnerCode { private constructor(readonly value: string) {} static create(value: string) { if (!/^KYR-\d{3,}$/.test(value)) throw new InvalidPartnerValueError("Partner code must use KYR-XXX format."); return new PartnerCode(value); } }
export const partnerStatuses = ["pending_approval", "approved", "workspace_activated", "active", "rejected", "failed"] as const;
export type PartnerStatusValue = (typeof partnerStatuses)[number];
export class PartnerStatus { private constructor(readonly value: PartnerStatusValue) {} static create(value: string) { if (!partnerStatuses.includes(value as PartnerStatusValue)) throw new InvalidPartnerStateError(`Unsupported Partner status: ${value}`); return new PartnerStatus(value as PartnerStatusValue); } static pendingApproval() { return new PartnerStatus("pending_approval"); } }
