import assert from "node:assert/strict";
import test from "node:test";
import { authorize } from "./authorization";
import type { AuthenticatedActor } from "./types";

const resource = { organizationId: "org-1", partnerId: "partner-1", workspaceId: "workspace-1", visibility: "shared" as const };

test("denies revoked memberships even when their role has the requested capability", () => {
  const actor: AuthenticatedActor = {
    user: { id: "user-1", externalSubjectId: "subject-1", email: "admin@example.com" },
    memberships: [{ id: "membership-1", userId: "user-1", role: "admin", status: "revoked", scope: { organizationId: "org-1" } }],
  };

  assert.deepEqual(authorize(actor, { capability: "partner.read", resource }), { allowed: false, reason: "no_active_membership" });
});

test("denies a membership outside the requested organization", () => {
  const actor: AuthenticatedActor = {
    user: { id: "user-1", externalSubjectId: "subject-1", email: "admin@example.com" },
    memberships: [{ id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId: "org-2" } }],
  };

  assert.deepEqual(authorize(actor, { capability: "partner.read", resource }), { allowed: false, reason: "scope_mismatch" });
});
