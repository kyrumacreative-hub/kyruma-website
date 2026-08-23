import assert from "node:assert/strict";
import test from "node:test";
import type { MembershipProvision } from "../domain/types";
import { ensureAcceptedMembership, type AcceptedMembershipGateway } from "./EnsureAcceptedMembership";

const joinedAt = new Date("2026-08-22T10:00:00Z");
const provision: MembershipProvision = {
  id: "membership-new",
  userId: "user-1",
  role: "partner",
  scope: { organizationId: "org-1", partnerId: "partner-1", workspaceId: "workspace-1" },
  status: "active",
  grants: [],
  revocations: [],
  joinedAt,
};

function gateway(overrides: Partial<AcceptedMembershipGateway> = {}) {
  const calls: string[] = [];
  const value: AcceptedMembershipGateway = {
    findActiveOrInvited: async () => null,
    activate: async () => { calls.push("activate"); },
    create: async () => { calls.push("create"); },
    ensureWorkspaceMember: async ({ membershipId }) => { calls.push(`workspace:${membershipId}`); },
    ...overrides,
  };
  return { calls, value };
}

test("creates both identity and Workspace membership for a new invitee", async () => {
  const fixture = gateway();
  const id = await ensureAcceptedMembership(fixture.value, { provision, invitedAt: joinedAt });
  assert.equal(id, "membership-new");
  assert.deepEqual(fixture.calls, ["create", "workspace:membership-new"]);
});

test("activates an invited membership and reuses it in the Workspace", async () => {
  const fixture = gateway({ findActiveOrInvited: async () => ({ id: "membership-existing", status: "invited" }) });
  const id = await ensureAcceptedMembership(fixture.value, { provision, invitedAt: joinedAt });
  assert.equal(id, "membership-existing");
  assert.deepEqual(fixture.calls, ["activate", "workspace:membership-existing"]);
});
