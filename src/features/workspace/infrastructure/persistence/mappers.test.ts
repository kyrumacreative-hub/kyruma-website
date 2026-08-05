import assert from "node:assert/strict";
import test from "node:test";
import { WorkspaceFactory } from "../../domain/workspaceFactory";
import { WorkspaceInvitation } from "../../domain/entities";
import { CorrelationId, InvitationExpiry, InvitationRecipientReference, InvitationRole, InvitationTokenHash, MembershipId, OrganizationId, PartnerId, WorkspaceId, WorkspaceInvitationId, WorkspaceMemberId, WorkspaceName } from "../../domain/valueObjects";
import { WorkspacePersistenceNotConfiguredError } from "./WorkspacePersistenceNotConfiguredError";
import { WorkspaceInvitationMapper, WorkspaceMapper, WorkspaceMemberMapper, WorkspaceSettingsMapper } from "./mappers";
import { PrismaWorkspaceInvitationRepository, PrismaWorkspaceMemberRepository, PrismaWorkspaceRepository, PrismaWorkspaceSettingsRepository } from "./repositories/PrismaWorkspaceRepositories";

const now = new Date("2026-08-05T12:00:00.000Z");
const workspace = () => WorkspaceFactory.create({ id: WorkspaceId.create("workspace-persistence"), partnerId: PartnerId.create("partner-persistence"), organizationId: OrganizationId.create("organization-persistence"), name: WorkspaceName.create("Persistence Workspace"), primary: true, initialOwner: WorkspaceFactory.createInitialOwner({ id: WorkspaceMemberId.create("member-owner"), membershipId: MembershipId.create("membership-owner"), joinedAt: now }), settings: WorkspaceFactory.initialSettings({ locale: "es" }), createdAt: now, correlationId: CorrelationId.create("correlation-persistence") });

test("round-trips Workspace, Member and Settings persistence models without business changes", () => {
  const value = workspace(); const workspaceModel = WorkspaceMapper.toPersistence(value); const settingsModel = WorkspaceSettingsMapper.toPersistence(value.settings, value.id.value); const restoredSettings = WorkspaceSettingsMapper.toDomain(settingsModel); const restored = WorkspaceMapper.toDomain(workspaceModel, restoredSettings);
  assert.deepEqual(WorkspaceMapper.toPersistence(restored), workspaceModel);
  const memberModel = WorkspaceMemberMapper.toPersistence(value.initialOwner, value.id.value); assert.deepEqual(WorkspaceMemberMapper.toPersistence(WorkspaceMemberMapper.toDomain(memberModel), value.id.value), memberModel);
});

test("round-trips hash-only invitations, including accepted history", () => {
  const invitation = new WorkspaceInvitation(WorkspaceInvitationId.create("invitation-persistence"), InvitationRecipientReference.create("recipient-ref"), InvitationRole.create("viewer"), InvitationTokenHash.create(`sha256:${"e".repeat(64)}`), InvitationExpiry.create(new Date("2026-08-06T12:00:00.000Z"), now), now, CorrelationId.create("correlation-invitation"));
  invitation.accept(new Date("2026-08-05T13:00:00.000Z")); const model = WorkspaceInvitationMapper.toPersistence(invitation, "workspace-persistence"); const restored = WorkspaceInvitationMapper.toDomain(model);
  assert.deepEqual(WorkspaceInvitationMapper.toPersistence(restored, "workspace-persistence"), model);
});

test("unconfigured Prisma adapters fail safely and never return placeholder data", async () => {
  const context = {}; const repository = new PrismaWorkspaceRepository();
  await assert.rejects(() => repository.findById("workspace", context), WorkspacePersistenceNotConfiguredError);
  await assert.rejects(() => new PrismaWorkspaceInvitationRepository().findById("invitation", context), WorkspacePersistenceNotConfiguredError);
  await assert.rejects(() => new PrismaWorkspaceMemberRepository().listActive("workspace", context), WorkspacePersistenceNotConfiguredError);
  await assert.rejects(() => new PrismaWorkspaceSettingsRepository().findCurrent("workspace", context), WorkspacePersistenceNotConfiguredError);
});
