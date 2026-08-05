import type { LeadDomainEvent } from "./events";
import type { ContactId, LeadId, LeadOrigin, LeadStatus, OrganizationId, OwnerId } from "./valueObjects";

export interface LeadProperties {
  id: LeadId;
  organizationId: OrganizationId;
  ownerId: OwnerId;
  primaryContactId: ContactId;
  origin: LeadOrigin;
  status: LeadStatus;
  createdAt: Date;
  createdBy: string;
}

export class LeadAggregate {
  private readonly pendingEvents: LeadDomainEvent[] = [];

  constructor(private readonly properties: LeadProperties) {}

  get id() { return this.properties.id; }
  get organizationId() { return this.properties.organizationId; }
  get ownerId() { return this.properties.ownerId; }
  get primaryContactId() { return this.properties.primaryContactId; }
  get origin() { return this.properties.origin; }
  get status() { return this.properties.status; }
  get createdAt() { return this.properties.createdAt; }
  get createdBy() { return this.properties.createdBy; }

  changeOwner(ownerId: OwnerId) { this.properties.ownerId = ownerId; }
  recordEvent(event: LeadDomainEvent) { this.pendingEvents.push(event); }
  pullDomainEvents() { const events = [...this.pendingEvents]; this.clearDomainEvents(); return events; }
  clearDomainEvents() { this.pendingEvents.length = 0; }
}
