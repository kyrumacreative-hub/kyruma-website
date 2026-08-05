import { InvalidDomainEventError } from "./errors";

export interface DomainEventMetadata {
  eventId: string;
  aggregateId: string;
  aggregateType: "Lead";
  occurredAt: Date;
  version: 1;
}

export interface LeadCreated extends DomainEventMetadata { type: "LeadCreated"; }
export interface OwnerAssigned extends DomainEventMetadata { type: "OwnerAssigned"; ownerId: string; }
export interface OwnerChanged extends DomainEventMetadata { type: "OwnerChanged"; previousOwnerId: string; ownerId: string; reason: string; }
export interface DiscoveryStarted extends DomainEventMetadata { type: "DiscoveryStarted"; }
export interface DiscoveryCompleted extends DomainEventMetadata { type: "DiscoveryCompleted"; }
export interface QualificationStarted extends DomainEventMetadata { type: "QualificationStarted"; }
export interface QualificationCompleted extends DomainEventMetadata { type: "QualificationCompleted"; }
export interface PartnerCreated extends DomainEventMetadata { type: "PartnerCreated"; partnerId: string; }
export interface LeadArchived extends DomainEventMetadata { type: "LeadArchived"; reason: string; archivedBy: string; }
export interface LeadReactivated extends DomainEventMetadata { type: "LeadReactivated"; reason: string; reactivatedBy: string; }
export interface LeadUpdated extends DomainEventMetadata { type: "LeadUpdated"; primaryContactId: string; }

export type LeadDomainEvent = LeadCreated | OwnerAssigned | OwnerChanged | DiscoveryStarted | DiscoveryCompleted | QualificationStarted | QualificationCompleted | PartnerCreated | LeadArchived | LeadReactivated | LeadUpdated;

export function eventMetadata(input: Omit<DomainEventMetadata, "aggregateType" | "version">): DomainEventMetadata {
  if (!input.eventId.trim()) throw new InvalidDomainEventError("Domain event id is required.");
  return { ...input, aggregateType: "Lead", version: 1 };
}
