import { WorkspaceInvitation, WorkspaceMember } from "./entities";
import { workspaceEvent, type WorkspaceEventMetadata } from "./events";
import { Workspace } from "./workspace";
import { CorrelationId, InvitationExpiry, InvitationRecipientReference, InvitationRole, InvitationTokenHash, WorkspaceInvitationId, WorkspaceMemberId, MembershipId } from "./valueObjects";

export class WorkspaceProvisioningService {
  provision(workspace: Workspace, metadata: WorkspaceEventMetadata) { workspace.recordEvent(workspaceEvent("WorkspaceProvisioningStarted", workspace, { ...metadata, eventId: `${metadata.eventId}:started` })); workspace.beginOnboarding(); workspace.recordEvent(workspaceEvent("WorkspaceProvisioned", workspace, metadata)); return workspace; }
}
export class WorkspaceActivationService {
  activate(workspace: Workspace, metadata: WorkspaceEventMetadata) { workspace.activate(); workspace.recordEvent(workspaceEvent("WorkspaceActivated", workspace, metadata)); return workspace; }
}
export class WorkspaceInvitationService {
  create(input: { workspace: Workspace; invitationId: WorkspaceInvitationId; recipientReference: InvitationRecipientReference; intendedRole: InvitationRole; tokenHash: InvitationTokenHash; expiry: InvitationExpiry; createdAt: Date; correlationId: CorrelationId; metadata: WorkspaceEventMetadata }) { const invitation = new WorkspaceInvitation(input.invitationId, input.recipientReference, input.intendedRole, input.tokenHash, input.expiry, input.createdAt, input.correlationId); input.workspace.recordEvent(workspaceEvent("InvitationCreated", input.workspace, input.metadata)); return invitation; }
  accept(input: { workspace: Workspace; invitation: WorkspaceInvitation; at: Date; metadata: WorkspaceEventMetadata }) { input.invitation.accept(input.at); input.workspace.recordEvent(workspaceEvent("InvitationAccepted", input.workspace, input.metadata)); return input.invitation; }
  revoke(input: { workspace: Workspace; invitation: WorkspaceInvitation; at: Date; metadata: WorkspaceEventMetadata }) { input.invitation.revoke(input.at); input.workspace.recordEvent(workspaceEvent("InvitationRevoked", input.workspace, input.metadata)); return input.invitation; }
}
export class WorkspaceMembershipService {
  add(input: { workspace: Workspace; memberId: WorkspaceMemberId; membershipId: MembershipId; joinedAt: Date; metadata: WorkspaceEventMetadata }) { const member = WorkspaceMember.member({ id: input.memberId, membershipId: input.membershipId, joinedAt: input.joinedAt }); input.workspace.addMember(member); input.workspace.recordEvent(workspaceEvent("MemberAdded", input.workspace, input.metadata)); return member; }
  remove(input: { workspace: Workspace; memberId: WorkspaceMemberId; at: Date; metadata: WorkspaceEventMetadata }) { input.workspace.removeMember(input.memberId.value, input.at); input.workspace.recordEvent(workspaceEvent("MemberRemoved", input.workspace, input.metadata)); }
}
