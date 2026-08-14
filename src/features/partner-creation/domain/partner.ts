import {
  InvalidPartnerStateError,
  MissingInitialOwnerError,
  MissingPrimaryWorkspaceError,
} from "./errors";
import {
  LeadId,
  MembershipId,
  OrganizationId,
  PartnerCode,
  PartnerId,
  PartnerStatus,
  type PartnerStatusValue,
  WorkspaceId,
} from "./valueObjects";
import type { PartnerDomainEvent } from "./events";

export interface PartnerProperties {
  id: PartnerId;
  code: PartnerCode;
  leadId: LeadId;
  organizationId: OrganizationId;
  primaryWorkspaceId: WorkspaceId;
  initialOwnerMembershipId: MembershipId;
  createdAt: Date;
  correlationId?: string;
  status?: PartnerStatusValue;
}

const transitions: Record<PartnerStatusValue, PartnerStatusValue[]> = {
  pending_approval: ["approved", "rejected"],
  approved: ["workspace_activated", "failed"],
  workspace_activated: ["active"],
  active: [],
  rejected: [],
  failed: [],
};

export class Partner {
  readonly id;
  readonly code;
  readonly leadId;
  readonly organizationId;
  readonly primaryWorkspaceId;
  readonly initialOwnerMembershipId;
  readonly createdAt;
  readonly correlationId?: string;
  private currentStatus = PartnerStatus.pendingApproval();
  private pendingEvents: PartnerDomainEvent[] = [];

  constructor(properties: PartnerProperties) {
    if (!properties.primaryWorkspaceId)
      throw new MissingPrimaryWorkspaceError();
    if (!properties.initialOwnerMembershipId)
      throw new MissingInitialOwnerError();
    this.id = properties.id;
    this.code = properties.code;
    this.leadId = properties.leadId;
    this.organizationId = properties.organizationId;
    this.primaryWorkspaceId = properties.primaryWorkspaceId;
    this.initialOwnerMembershipId = properties.initialOwnerMembershipId;
    this.createdAt = properties.createdAt;
    this.correlationId = properties.correlationId;
    this.currentStatus = PartnerStatus.create(
      properties.status ?? "pending_approval",
    );
  }

  get status() {
    return this.currentStatus.value;
  }

  approve() {
    this.transition("approved");
  }
  reject() {
    this.transition("rejected");
  }
  activateWorkspace() {
    this.transition("workspace_activated");
  }
  activate() {
    this.transition("active");
  }
  fail() {
    this.transition("failed");
  }

  private transition(next: PartnerStatusValue) {
    if (!transitions[this.status].includes(next))
      throw new InvalidPartnerStateError(
        `Cannot transition Partner from ${this.status} to ${next}.`,
      );
    this.currentStatus = PartnerStatus.create(next);
  }

  recordEvent(event: PartnerDomainEvent) {
    this.pendingEvents.push(event);
  }
  pullDomainEvents() {
    const events = [...this.pendingEvents];
    this.clearDomainEvents();
    return events;
  }
  clearDomainEvents() {
    this.pendingEvents = [];
  }
}
