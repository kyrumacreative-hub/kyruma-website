import assert from "node:assert/strict";
import test from "node:test";
import { DuplicateWorkspaceMemberError, DuplicateWorkspaceOwnerError, InvalidWorkspaceInvitationError, InvalidWorkspaceStateError, InvalidWorkspaceValueError, MissingInitialWorkspaceOwnerError, WorkspaceOwnerRemovalError } from "./errors";
import { requireSingleActiveOwner, WorkspaceInvitation, WorkspaceMember } from "./entities";
import { WorkspaceFactory } from "./workspaceFactory";
import { CorrelationId, InvitationExpiry, InvitationTokenHash, MembershipId, OrganizationId, PartnerId, WorkspaceId, WorkspaceInvitationId, WorkspaceMemberId, WorkspaceName, WorkspaceSettingsVersion } from "./valueObjects";
import { workspaceEvent } from "./events";
import { WorkspaceActivationService, WorkspaceInvitationService, WorkspaceMembershipService, WorkspaceProvisioningService } from "./services";

const now = new Date("2026-08-05T12:00:00.000Z");
const owner = () => WorkspaceFactory.createInitialOwner({ id: WorkspaceMemberId.create("workspace-member-1"), membershipId: MembershipId.create("membership-owner-1"), joinedAt: now });
const workspace = () => WorkspaceFactory.create({ id: WorkspaceId.create("workspace-1"), partnerId: PartnerId.create("partner-1"), organizationId: OrganizationId.create("organization-1"), name: WorkspaceName.create("KYRUMA Partner Workspace"), primary: true, initialOwner: owner(), settings: WorkspaceFactory.initialSettings({ locale: "es" }), createdAt: now, correlationId: CorrelationId.create("correlation-1") });
const metadata = (eventId = "event-1") => ({ eventId, occurredAt: now, correlationId: "correlation-1", actorId: "admin-1" });

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
  assert.throws(() => WorkspaceFactory.create({ id: WorkspaceId.create("workspace-4"), partnerId: PartnerId.create("partner-4"), organizationId: OrganizationId.create("organization-4"), name: WorkspaceName.create("No settings"), primary: true, initialOwner: owner(), settings: undefined as unknown as ReturnType<typeof WorkspaceFactory.initialSettings>, createdAt: now, correlationId: CorrelationId.create("correlation-4") }), InvalidWorkspaceValueError);
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

test("coordinates provisioning and activation through pure services with versioned events", () => {
  const value = workspace(); new WorkspaceProvisioningService().provision(value, metadata("provision"));
  assert.equal(value.status, "onboarding"); new WorkspaceActivationService().activate(value, metadata("activate")); assert.equal(value.status, "active");
  assert.deepEqual(value.pullDomainEvents().map((event) => event.type), ["WorkspaceProvisioningStarted", "WorkspaceProvisioned", "WorkspaceActivated"]);
  assert.throws(() => new WorkspaceActivationService().activate(value, metadata("activate-again")), InvalidWorkspaceStateError);
});

test("coordinates invitation lifecycle and rejects expired or revoked reuse", () => {
  const value = workspace(); const service = new WorkspaceInvitationService();
  const invitation = service.create({ workspace: value, invitationId: WorkspaceInvitationId.create("invitation-service"), tokenHash: InvitationTokenHash.create(`sha256:${"d".repeat(64)}`), expiry: InvitationExpiry.create(new Date("2026-08-06T12:00:00.000Z"), now), createdAt: now, metadata: metadata("invite") });
  service.accept({ workspace: value, invitation, at: new Date("2026-08-05T13:00:00.000Z"), metadata: metadata("accept") });
  assert.equal(invitation.status, "accepted"); assert.throws(() => service.revoke({ workspace: value, invitation, at: now, metadata: metadata("revoke") }), InvalidWorkspaceInvitationError);
  assert.deepEqual(value.pullDomainEvents().map((event) => event.type), ["InvitationCreated", "InvitationAccepted"]);
});

test("maintains Member lifecycle without removing the initial Owner", () => {
  const value = workspace(); const service = new WorkspaceMembershipService(); const member = service.add({ workspace: value, memberId: WorkspaceMemberId.create("workspace-member-2"), membershipId: MembershipId.create("membership-member-2"), joinedAt: now, metadata: metadata("member-added") });
  service.remove({ workspace: value, memberId: member.id, at: new Date("2026-08-05T13:00:00.000Z"), metadata: metadata("member-removed") });
  assert.equal(member.status, "removed"); assert.equal(value.getMembers().length, 2);
  assert.throws(() => service.add({ workspace: value, memberId: WorkspaceMemberId.create("workspace-member-3"), membershipId: member.membershipId, joinedAt: now, metadata: metadata("duplicate") }), DuplicateWorkspaceMemberError);
  assert.throws(() => service.remove({ workspace: value, memberId: value.initialOwner.id, at: now, metadata: metadata("owner-remove") }), WorkspaceOwnerRemovalError);
});

test("requires mandatory event metadata", () => {
  assert.throws(() => workspaceEvent("WorkspaceProvisioned", workspace(), { ...metadata(), eventId: "" }), InvalidWorkspaceValueError);
});
