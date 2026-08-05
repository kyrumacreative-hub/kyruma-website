import assert from "node:assert/strict";
import test from "node:test";
import { DefaultOrganizationContextProvider, OrganizationContextUnauthorizedError } from "./OrganizationContextProvider";
import { OrganizationContextAccessDeniedError, requireOrganizationContextAccess } from "./requireOrganizationContextAccess";
import type { OrganizationContextRepository } from "../ports/OrganizationContextRepository";
import type { AuthenticatedActor } from "../../identity/domain/types";

const repository: OrganizationContextRepository = {
  findByOrganizationId: async (id) => id === "org-1" ? { id, displayName: "Organization One" } : null,
};

function actor(input: Partial<AuthenticatedActor["memberships"][number]> = {}): AuthenticatedActor {
  return {
    user: { id: "user-1", externalSubjectId: "subject-1", email: "admin@example.com" },
    memberships: [{ id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId: "org-1" }, ...input }],
  };
}

test("resolves a pre-Partner Organization Context with Lead capabilities", async () => {
  const context = await new DefaultOrganizationContextProvider(repository).resolve(actor(), "org-1");
  assert.equal(context.organization.id, "org-1");
  assert.equal(context.capabilities.has("lead.create"), true);
  assert.equal(context.capabilities.has("lead.partner.create"), true);
  assert.equal(context.contextKey, "user-1:membership-1:org-1");
});

test("applies grants and revocations to Organization Context capabilities", async () => {
  const strategist = await new DefaultOrganizationContextProvider(repository).resolve(actor({ role: "strategist", revocations: ["lead.create"] }), "org-1");
  assert.equal(strategist.capabilities.has("lead.create"), false);
  assert.equal(strategist.capabilities.has("lead.discovery.start"), true);
});

test("denies a Membership outside the requested Organization", async () => {
  await assert.rejects(
    () => new DefaultOrganizationContextProvider(repository).resolve(actor({ scope: { organizationId: "org-2" } }), "org-1"),
    OrganizationContextUnauthorizedError,
  );
});

test("Organization Context guard denies a capability missing from an active Membership", async () => {
  const context = await new DefaultOrganizationContextProvider(repository).resolve(actor({ role: "viewer" }), "org-1");
  assert.throws(() => requireOrganizationContextAccess(context, "lead.create"), OrganizationContextAccessDeniedError);
});

test("Organization Context guard uses Foundation authorization for a permitted capability", async () => {
  const context = await new DefaultOrganizationContextProvider(repository).resolve(actor({ role: "strategist" }), "org-1");
  assert.equal(requireOrganizationContextAccess(context, "lead.discovery.start").allowed, true);
});
