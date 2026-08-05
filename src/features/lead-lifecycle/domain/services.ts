import { InvalidLeadStateError } from "./errors";
import { eventMetadata, type DomainEventMetadata } from "./events";
import { LeadFactory } from "./leadFactory";
import type { CreateLeadInput } from "./types";
import { OwnerId } from "./valueObjects";
import type { LeadAggregate } from "./lead";

export interface DomainOperationMetadata {
  eventId: string;
  occurredAt: Date;
}

function metadata(lead: LeadAggregate, input: DomainOperationMetadata): DomainEventMetadata {
  return eventMetadata({ eventId: input.eventId, aggregateId: lead.id.value, occurredAt: input.occurredAt });
}

export class LeadCreationService {
  create(input: CreateLeadInput, operation: DomainOperationMetadata) {
    const lead = LeadFactory.create(input);
    lead.recordEvent({ ...metadata(lead, operation), type: "LeadCreated" });
    lead.recordEvent({ ...metadata(lead, { ...operation, eventId: `${operation.eventId}:owner` }), type: "OwnerAssigned", ownerId: lead.ownerId.value });
    return lead;
  }
}

export class LeadOwnershipService {
  reassign(lead: LeadAggregate, ownerId: string, reason: string, operation: DomainOperationMetadata) {
    if (!reason.trim()) throw new InvalidLeadStateError("Ownership reassignment requires a reason.");
    const nextOwner = OwnerId.create(ownerId);
    if (nextOwner.value === lead.ownerId.value) throw new InvalidLeadStateError("Lead already has this owner.");
    const previousOwnerId = lead.ownerId.value;
    lead.changeOwner(nextOwner);
    lead.recordEvent({ ...metadata(lead, operation), type: "OwnerChanged", previousOwnerId, ownerId: nextOwner.value, reason });
    return lead;
  }
}

export class LeadQualificationService {
  start(lead: LeadAggregate, hasCompletedDiscovery: boolean, operation: DomainOperationMetadata) {
    if (!hasCompletedDiscovery) throw new InvalidLeadStateError("Qualification requires a completed Discovery.");
    lead.recordEvent({ ...metadata(lead, operation), type: "QualificationStarted" });
    return lead;
  }
}
