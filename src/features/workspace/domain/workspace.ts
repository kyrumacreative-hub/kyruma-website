import { DuplicateWorkspaceMemberError, InvalidWorkspaceStateError, InvalidWorkspaceValueError, MissingInitialWorkspaceOwnerError, WorkspaceOwnerRemovalError } from "./errors";
import { requireSingleActiveOwner, WorkspaceMember, WorkspaceSettings } from "./entities";
import { CorrelationId, OrganizationId, PartnerId, WorkspaceId, WorkspaceName, WorkspaceStatus, type WorkspaceStatusValue } from "./valueObjects";
import type { WorkspaceDomainEvent } from "./events";

export interface WorkspaceProperties { id: WorkspaceId; partnerId: PartnerId; organizationId: OrganizationId; name: WorkspaceName; primary: boolean; initialOwner: WorkspaceMember; settings: WorkspaceSettings; createdAt: Date; correlationId: CorrelationId; status?: WorkspaceStatusValue; }
const transitions: Record<WorkspaceStatusValue, WorkspaceStatusValue[]> = { provisioning: ["onboarding", "failed"], onboarding: ["active", "failed"], active: ["paused"], paused: ["archived"], archived: [], failed: [] };

export class Workspace {
  readonly id; readonly partnerId; readonly organizationId; readonly name; readonly primary; readonly initialOwner; readonly settings; readonly createdAt; readonly correlationId; private currentStatus: WorkspaceStatus; private members: WorkspaceMember[]; private pendingEvents: WorkspaceDomainEvent[] = [];
  constructor(properties: WorkspaceProperties) {
    if (!properties.primary) throw new InvalidWorkspaceStateError("Initial Workspace must be primary.");
    if (!properties.initialOwner.isActiveOwner) throw new MissingInitialWorkspaceOwnerError();
    if (!properties.settings) throw new InvalidWorkspaceValueError("Workspace settings are required.");
    requireSingleActiveOwner([properties.initialOwner]);
    this.id = properties.id; this.partnerId = properties.partnerId; this.organizationId = properties.organizationId; this.name = properties.name; this.primary = properties.primary; this.initialOwner = properties.initialOwner; this.settings = properties.settings; this.createdAt = properties.createdAt; this.correlationId = properties.correlationId; this.currentStatus = WorkspaceStatus.create(properties.status ?? "provisioning"); this.members = [properties.initialOwner];
  }
  get status() { return this.currentStatus.value; }
  beginOnboarding() { this.transition("onboarding"); }
  activate() { this.transition("active"); }
  pause() { this.transition("paused"); }
  archive() { this.transition("archived"); }
  fail() { this.transition("failed"); }
  getMembers() { return [...this.members]; }
  addMember(member: WorkspaceMember) { if (this.members.some((existing) => existing.membershipId.value === member.membershipId.value)) throw new DuplicateWorkspaceMemberError(); if (member.isActiveOwner) requireSingleActiveOwner([...this.members, member]); this.members.push(member); }
  removeMember(memberId: string, at: Date) { const member = this.members.find((value) => value.id.value === memberId); if (!member) throw new DuplicateWorkspaceMemberError(); if (member.isActiveOwner) throw new WorkspaceOwnerRemovalError(); member.remove(at); }
  recordEvent(event: WorkspaceDomainEvent) { this.pendingEvents.push(event); }
  pullDomainEvents() { const events = [...this.pendingEvents]; this.clearDomainEvents(); return events; }
  clearDomainEvents() { this.pendingEvents = []; }
  private transition(next: WorkspaceStatusValue) { if (!transitions[this.status].includes(next)) throw new InvalidWorkspaceStateError(`Cannot transition Workspace from ${this.status} to ${next}.`); this.currentStatus = WorkspaceStatus.create(next); }
}
