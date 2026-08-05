export type LeadStatus = "identified" | "discovery_in_progress" | "on_hold" | "archived";

export interface Lead {
  id: string;
  organizationId: string;
  ownerId: string;
  primaryContactId: string;
  origin: string;
  status: LeadStatus;
  createdAt: Date;
  createdBy: string;
  archivedAt?: Date;
  archivedBy?: string;
  archiveReason?: string;
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
