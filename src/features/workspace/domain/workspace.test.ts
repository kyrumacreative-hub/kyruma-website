import assert from "node:assert/strict";
import test from "node:test";
import { DuplicateWorkspaceOwnerError, InvalidWorkspaceInvitationError, InvalidWorkspaceStateError, InvalidWorkspaceValueError, MissingInitialWorkspaceOwnerError } from "./errors";
import { requireSingleActiveOwner, WorkspaceInvitation, WorkspaceMember } from "./entities";
import { WorkspaceFactory } from "./workspaceFactory";
import { CorrelationId, InvitationExpiry, InvitationTokenHash, MembershipId, OrganizationId, PartnerId, WorkspaceId, WorkspaceInvitationId, WorkspaceMemberId, WorkspaceName, WorkspaceSettingsVersion } from "./valueObjects";

const now = new Date("2026-08-05T12:00:00.000Z");
const owner = () => WorkspaceFactory.createInitialOwner({ id: WorkspaceMemberId.create("workspace-member-1"), membershipId: MembershipId.create("membership-owner-1"), joinedAt: now });
const workspace = () => WorkspaceFactory.create({ id: WorkspaceId.create("workspace-1"), partnerId: PartnerId.create("partner-1"), organizationId: OrganizationId.create("organization-1"), name: WorkspaceName.create("KYRUMA Partner Workspace"), primary: true, initialOwner: owner(), settings: WorkspaceFactory.initialSettings({ locale: "es" }), createdAt: now, correlationId: CorrelationId.create("correlation-1") });

test("creates a primary Workspace in provisioning, never active", () => {
  const value = workspace();
  assert.equal(value.status, "provisioning"); assert.equal(value.initialOwner.isActiveOwner, true); assert.equal(value.primary, true);
});

test("enforces the approved Workspace lifecycle", () => {
  const value = workspace(); value.beginOnboarding(); value.activate(); value.pause(); value.archive(); assert.equal(value.status, "archived");
  assert.throws(() => value.activate(), InvalidWorkspaceStateError);
});

test("requires one active initial Owner and a primary initial Workspace", () => {
  assert.throws(() => WorkspaceFactory.create({ id: WorkspaceId.create("workspace-2"), partnerId: PartnerId.create("partner-2"), organizationId: OrganizationId.create("organization-2"), name: WorkspaceName.create("Invalid"), primary: false, initialOwner: owner(), settings: WorkspaceFactory.initialSettings(), createdAt: now, correlationId: CorrelationId.create("correlation-2") }), InvalidWorkspaceStateError);
  const removedOwner = new WorkspaceMember(WorkspaceMemberId.create("removed-owner"), MembershipId.create("membership-removed"), true, "removed", now, now);
  assert.throws(() => WorkspaceFactory.create({ id: WorkspaceId.create("workspace-3"), partnerId: PartnerId.create("partner-3"), organizationId: OrganizationId.create("organization-3"), name: WorkspaceName.create("No owner"), primary: true, initialOwner: removedOwner, settings: WorkspaceFactory.initialSettings(), createdAt: now, correlationId: CorrelationId.create("correlation-3") }), MissingInitialWorkspaceOwnerError);
  assert.throws(() => requireSingleActiveOwner([owner(), owner()]), DuplicateWorkspaceOwnerError);
});

test("keeps invitation tokens hashed, expiring, single-use and revocable", () => {
  const invitation = new WorkspaceInvitation(WorkspaceInvitationId.create("invitation-1"), InvitationTokenHash.create(`sha256:${"a".repeat(64)}`), InvitationExpiry.create(new Date("2026-08-06T12:00:00.000Z"), now), now);
  invitation.accept(new Date("2026-08-05T13:00:00.000Z")); assert.equal(invitation.status, "accepted"); assert.ok(invitation.acceptedAt);
  assert.throws(() => invitation.accept(new Date("2026-08-05T14:00:00.000Z")), InvalidWorkspaceInvitationError);
  const revoked = new WorkspaceInvitation(WorkspaceInvitationId.create("invitation-2"), InvitationTokenHash.create(`sha256:${"b".repeat(64)}`), InvitationExpiry.create(new Date("2026-08-06T12:00:00.000Z"), now), now);
  revoked.revoke(now); assert.equal(revoked.status, "revoked"); assert.ok(revoked.revokedAt);
  assert.throws(() => InvitationTokenHash.create("plaintext-token"), InvalidWorkspaceValueError);
});

test("rejects expired invitations and validates value objects", () => {
  assert.throws(() => InvitationExpiry.create(now, now), InvalidWorkspaceValueError);
  const invitation = new WorkspaceInvitation(WorkspaceInvitationId.create("invitation-3"), InvitationTokenHash.create(`sha256:${"c".repeat(64)}`), InvitationExpiry.create(new Date("2026-08-05T12:01:00.000Z"), now), now);
  invitation.expire(new Date("2026-08-05T12:02:00.000Z")); assert.equal(invitation.status, "expired");
  assert.throws(() => invitation.accept(new Date("2026-08-05T12:02:00.000Z")), InvalidWorkspaceInvitationError);
  assert.equal(WorkspaceSettingsVersion.initial().next().value, 2);
});
