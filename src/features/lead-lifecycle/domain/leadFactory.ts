import { InvalidLeadIdentifierError } from "./errors";
import type { CreateLeadInput, Lead } from "./types";
import { ContactId, LeadId, LeadOrigin, LeadStatus, OrganizationId, OwnerId } from "./valueObjects";

export class LeadFactory {
  static create(input: CreateLeadInput): Lead {
    if (!input.createdBy.trim()) throw new InvalidLeadIdentifierError("Lead creator is required.");
    if (Number.isNaN(input.createdAt.getTime())) throw new InvalidLeadIdentifierError("Lead creation date is invalid.");

    return {
      id: LeadId.create(input.id),
      organizationId: OrganizationId.create(input.organizationId),
      ownerId: OwnerId.create(input.ownerId),
      primaryContactId: ContactId.create(input.primaryContactId),
      origin: LeadOrigin.create(input.origin),
      status: LeadStatus.identified(),
      createdAt: input.createdAt,
      createdBy: input.createdBy,
    };
  }
}
