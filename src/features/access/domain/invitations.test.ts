import test from "node:test";
import assert from "node:assert/strict";
import { acceptAccessInvitation, issueAccessInvitation } from "./invitations";

test("invitation tokens are hash-only and activate the intended membership", () => {
  const now = new Date("2026-08-15T10:00:00Z");
  const issued = issueAccessInvitation({ id: "invite-1", email: " Partner@Example.com ", role: "partner", scope: { organizationId: "org-1", partnerId: "partner-1", workspaceId: "workspace-1" }, createdBy: "admin-1", correlationId: "correlation-1", now, expiresAt: new Date("2026-08-16T10:00:00Z"), token: "safe-secret-token" });
  assert.notEqual(issued.invitation.tokenHash, issued.token);
  const membership = acceptAccessInvitation({ invitation: issued.invitation, token: issued.token, identity: { subjectId: "clerk-1", email: "partner@example.com" }, userId: "user-1", membershipId: "membership-1", now });
  assert.equal(membership.role, "partner");
  assert.equal(membership.scope.workspaceId, "workspace-1");
});

test("invitation cannot be accepted by another email", () => {
  const now = new Date("2026-08-15T10:00:00Z");
  const issued = issueAccessInvitation({ id: "invite-1", email: "partner@example.com", role: "partner", scope: { organizationId: "org-1" }, createdBy: "admin-1", correlationId: "correlation-1", now, expiresAt: new Date("2026-08-16T10:00:00Z"), token: "safe-secret-token" });
  assert.throws(() => acceptAccessInvitation({ invitation: issued.invitation, token: issued.token, identity: { subjectId: "clerk-2", email: "other@example.com" }, userId: "user-2", membershipId: "membership-2", now }));
});

