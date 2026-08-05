import { eventMetadata, type LeadDomainEvent } from "./events";
import { InvalidLeadStateError } from "./errors";
import { ContactId, LeadStatus, type LeadId, type LeadOrigin, type OrganizationId, type OwnerId } from "./valueObjects";

export interface LeadProperties {
  id: LeadId;
  organizationId: OrganizationId;
  ownerId: OwnerId;
  primaryContactId: ContactId;
  origin: LeadOrigin;
  status: LeadStatus;
  createdAt: Date;
  createdBy: string;
  archivedAt?: Date;
  archivedBy?: string;
  archiveReason?: string;
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
  get archivedAt() { return this.properties.archivedAt; }
  get archivedBy() { return this.properties.archivedBy; }
  get archiveReason() { return this.properties.archiveReason; }

  changeOwner(ownerId: OwnerId) { this.properties.ownerId = ownerId; }
  changePrimaryContact(input: { contactId: string; eventId: string; occurredAt: Date }) {
    const contactId = ContactId.create(input.contactId);
    this.properties.primaryContactId = contactId;
    this.recordEvent({ ...eventMetadata({ eventId: input.eventId, aggregateId: this.id.value, occurredAt: input.occurredAt }), type: "LeadUpdated", primaryContactId: contactId.value });
  }
  transitionTo(status: LeadStatus) {
    const allowed: Record<string, string[]> = {
      identified: ["discovery_in_progress", "archived"],
      discovery_in_progress: ["discovery_completed", "archived"],
      discovery_completed: ["qualified", "archived"],
      qualified: ["partner_created", "archived"],
      on_hold: ["archived"],
      archived: ["identified"],
    };
    if (!allowed[this.status.value]?.includes(status.value)) throw new InvalidLeadStateError(`Invalid Lead transition: ${this.status.value} -> ${status.value}`);
    this.properties.status = status;
  }
  archive(input: { eventId: string; occurredAt: Date; actorId: string; reason: string }) {
    if (!input.reason.trim()) throw new InvalidLeadStateError("Archiving a Lead requires a reason.");
    this.transitionTo(LeadStatus.create("archived"));
    this.properties.archivedAt = input.occurredAt;
    this.properties.archivedBy = input.actorId;
    this.properties.archiveReason = input.reason;
    this.recordEvent({ ...eventMetadata({ eventId: input.eventId, aggregateId: this.id.value, occurredAt: input.occurredAt }), type: "LeadArchived", reason: input.reason, archivedBy: input.actorId });
  }
  reactivate(input: { eventId: string; occurredAt: Date; actorId: string; reason: string }) {
    if (!input.reason.trim()) throw new InvalidLeadStateError("Reactivating a Lead requires a reason.");
    this.transitionTo(LeadStatus.create("identified"));
    this.recordEvent({ ...eventMetadata({ eventId: input.eventId, aggregateId: this.id.value, occurredAt: input.occurredAt }), type: "LeadReactivated", reason: input.reason, reactivatedBy: input.actorId });
  }
  recordEvent(event: LeadDomainEvent) { this.pendingEvents.push(event); }
  pullDomainEvents() { const events = [...this.pendingEvents]; this.clearDomainEvents(); return events; }
  clearDomainEvents() { this.pendingEvents.length = 0; }
}
