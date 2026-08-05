import type { TransactionContext } from "./TransactionRunner";

export interface CreatePartnerFromLeadRequest {
  leadId: string;
  organizationId: string;
  qualificationDecisionId: string;
  createdBy: string;
  createdAt: Date;
}

export interface PartnerCreationResult {
  partnerId: string;
  publicId: string;
  workspaceId: string;
  membershipId: string;
}

/**
 * Boundary for creating a Partner, its initial Workspace and initial Membership
 * atomically. It does not activate external access or initiate Onboarding.
 */
export interface PartnerCreationPort {
  createFromLead(request: CreatePartnerFromLeadRequest, context: TransactionContext): Promise<PartnerCreationResult>;
}
