export interface CreateLeadInput {
  id: string;
  organizationId: string;
  ownerId: string;
  primaryContactId: string;
  origin: string;
  createdAt: Date;
  createdBy: string;
}
