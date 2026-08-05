import type { ContactId, LeadId, LeadOrigin, LeadStatus, OrganizationId, OwnerId } from "./valueObjects";

export interface Lead {
  id: LeadId;
  organizationId: OrganizationId;
  ownerId: OwnerId;
  primaryContactId: ContactId;
  origin: LeadOrigin;
  status: LeadStatus;
  createdAt: Date;
  createdBy: string;
}

export interface CreateLeadInput {
  id: string;
  organizationId: string;
  ownerId: string;
  primaryContactId: string;
  origin: string;
  createdAt: Date;
  createdBy: string;
}
