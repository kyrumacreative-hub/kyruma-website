import { DuplicateWorkspaceOwnerError, InvalidWorkspaceInvitationError, InvalidWorkspaceStateError, MissingInitialWorkspaceOwnerError } from "./errors";
import { InvitationExpiry, InvitationStatus, type InvitationStatusValue, InvitationTokenHash, MembershipId, WorkspaceMemberId, WorkspaceInvitationId, WorkspaceSettingsVersion } from "./valueObjects";

export type WorkspaceMemberStatus = "active" | "removed";
export class WorkspaceMember {
  private currentStatus: WorkspaceMemberStatus;
  private removedAtValue?: Date;
  constructor(readonly id: WorkspaceMemberId, readonly membershipId: MembershipId, readonly owner: boolean, status: WorkspaceMemberStatus, readonly joinedAt: Date, removedAt?: Date) { this.currentStatus = status; this.removedAtValue = removedAt; }
  static initialOwner(input: { id: WorkspaceMemberId; membershipId: MembershipId; joinedAt: Date }) { return new WorkspaceMember(input.id, input.membershipId, true, "active", input.joinedAt); }
  static member(input: { id: WorkspaceMemberId; membershipId: MembershipId; joinedAt: Date }) { return new WorkspaceMember(input.id, input.membershipId, false, "active", input.joinedAt); }
  get status() { return this.currentStatus; }
  get removedAt() { return this.removedAtValue; }
  get isActiveOwner() { return this.owner && this.status === "active"; }
  remove(at: Date) { if (this.status !== "active") throw new InvalidWorkspaceStateError("Only an active Member can be removed."); this.currentStatus = "removed"; this.removedAtValue = new Date(at); }
}

export class WorkspaceInvitation {
  private currentStatus: InvitationStatus;
  private acceptedAtValue?: Date;
  private revokedAtValue?: Date;
  constructor(readonly id: WorkspaceInvitationId, readonly tokenHash: InvitationTokenHash, readonly expiry: InvitationExpiry, readonly createdAt: Date, status: InvitationStatusValue = "pending", acceptedAt?: Date, revokedAt?: Date) { this.currentStatus = InvitationStatus.create(status); this.acceptedAtValue = acceptedAt; this.revokedAtValue = revokedAt; }
  get status() { return this.currentStatus.value; }
  get acceptedAt() { return this.acceptedAtValue; }
  get revokedAt() { return this.revokedAtValue; }
  isValidAt(at: Date) { return this.status === "pending" && !this.expiry.isExpired(at); }
  accept(at: Date) { if (!this.isValidAt(at)) throw new InvalidWorkspaceInvitationError("Invitation cannot be accepted."); this.currentStatus = InvitationStatus.create("accepted"); this.acceptedAtValue = new Date(at); }
  revoke(at: Date) { if (this.status !== "pending") throw new InvalidWorkspaceInvitationError("Only a pending invitation can be revoked."); this.currentStatus = InvitationStatus.create("revoked"); this.revokedAtValue = new Date(at); }
  expire(at: Date) { if (this.status === "pending" && this.expiry.isExpired(at)) this.currentStatus = InvitationStatus.create("expired"); }
}

export class WorkspaceSettings {
  readonly values: Readonly<Record<string, unknown>>;
  constructor(readonly version: WorkspaceSettingsVersion, values: Record<string, unknown> = {}) { this.values = Object.freeze({ ...values }); }
  static initial(values: Record<string, unknown> = {}) { return new WorkspaceSettings(WorkspaceSettingsVersion.initial(), values); }
}

export function requireSingleActiveOwner(members: readonly WorkspaceMember[]) {
  const owners = members.filter((member) => member.isActiveOwner);
  if (!owners.length) throw new MissingInitialWorkspaceOwnerError();
  if (owners.length > 1) throw new DuplicateWorkspaceOwnerError();
}
