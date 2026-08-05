import { WorkspaceInvitation, WorkspaceMember, WorkspaceSettings } from "../../domain/entities";
import { Workspace } from "../../domain/workspace";
import { CorrelationId, InvitationExpiry, InvitationRecipientReference, InvitationRole, InvitationTokenHash, MembershipId, OrganizationId, PartnerId, WorkspaceId, WorkspaceInvitationId, WorkspaceMemberId, WorkspaceName, WorkspaceSettingsVersion, type InvitationStatusValue, type WorkspaceStatusValue } from "../../domain/valueObjects";
import type { WorkspaceInvitationPersistenceModel, WorkspaceMemberPersistenceModel, WorkspacePersistenceModel, WorkspaceSettingsPersistenceModel } from "./models";

export const WorkspaceMapper = {
  toPersistence: (workspace: Workspace): WorkspacePersistenceModel => ({ id: workspace.id.value, partnerId: workspace.partnerId.value, organizationId: workspace.organizationId.value, name: workspace.name.value, primary: workspace.primary, status: workspace.status, initialOwnerMemberId: workspace.initialOwner.id.value, initialOwnerMembershipId: workspace.initialOwner.membershipId.value, settingsVersion: workspace.settings.version.value, createdAt: workspace.createdAt, correlationId: workspace.correlationId.value }),
  toDomain: (model: WorkspacePersistenceModel, settings: WorkspaceSettings): Workspace => new Workspace({ id: WorkspaceId.create(model.id), partnerId: PartnerId.create(model.partnerId), organizationId: OrganizationId.create(model.organizationId), name: WorkspaceName.create(model.name), primary: model.primary, initialOwner: WorkspaceMember.initialOwner({ id: WorkspaceMemberId.create(model.initialOwnerMemberId), membershipId: MembershipId.create(model.initialOwnerMembershipId), joinedAt: model.createdAt }), settings, createdAt: model.createdAt, correlationId: CorrelationId.create(model.correlationId), status: model.status as WorkspaceStatusValue }),
};
export const WorkspaceMemberMapper = {
  toPersistence: (member: WorkspaceMember, workspaceId: string): WorkspaceMemberPersistenceModel => ({ id: member.id.value, workspaceId, membershipId: member.membershipId.value, owner: member.owner, status: member.status, joinedAt: member.joinedAt, removedAt: member.removedAt }),
  toDomain: (model: WorkspaceMemberPersistenceModel): WorkspaceMember => new WorkspaceMember(WorkspaceMemberId.create(model.id), MembershipId.create(model.membershipId), model.owner, model.status, model.joinedAt, model.removedAt),
};
export const WorkspaceInvitationMapper = {
  toPersistence: (invitation: WorkspaceInvitation, workspaceId: string): WorkspaceInvitationPersistenceModel => ({ id: invitation.id.value, workspaceId, recipientReference: invitation.recipientReference.value, intendedRole: invitation.intendedRole.value, tokenHash: invitation.tokenHash.value, expiresAt: invitation.expiry.value, status: invitation.status, createdAt: invitation.createdAt, acceptedAt: invitation.acceptedAt, revokedAt: invitation.revokedAt, correlationId: invitation.correlationId.value }),
  toDomain: (model: WorkspaceInvitationPersistenceModel): WorkspaceInvitation => new WorkspaceInvitation(WorkspaceInvitationId.create(model.id), InvitationRecipientReference.create(model.recipientReference), InvitationRole.create(model.intendedRole), InvitationTokenHash.create(model.tokenHash), InvitationExpiry.restore(model.expiresAt), model.createdAt, CorrelationId.create(model.correlationId), model.status as InvitationStatusValue, model.acceptedAt, model.revokedAt),
};
export const WorkspaceSettingsMapper = {
  toPersistence: (settings: WorkspaceSettings, workspaceId: string): WorkspaceSettingsPersistenceModel => ({ workspaceId, version: settings.version.value, values: settings.values }),
  toDomain: (model: WorkspaceSettingsPersistenceModel): WorkspaceSettings => new WorkspaceSettings(WorkspaceSettingsVersion.create(model.version), { ...model.values }),
};
