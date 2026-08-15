import test from "node:test";
import assert from "node:assert/strict";
import { PartnerPortalService } from "./portalService";

const scope = { organizationId: "org-1", partnerId: "partner-1", workspaceId: "workspace-1" };
const view = { workspace: { id: "workspace-1", name: "Partner", status: "active" }, shared: [], activity: [], deliverables: [] };

test("partner reads only its scoped portal", async () => {
  const service = new PartnerPortalService({ read: async () => view });
  const result = await service.get({ user: { id: "user-1", externalSubjectId: "ext-1", email: "p@example.com" }, memberships: [{ id: "m-1", userId: "user-1", role: "partner", status: "active", scope }] }, scope);
  assert.equal(result.workspace.id, "workspace-1");
});

test("cross workspace access is denied", async () => {
  const service = new PartnerPortalService({ read: async () => view });
  await assert.rejects(service.get({ user: { id: "user-1", externalSubjectId: "ext-1", email: "p@example.com" }, memberships: [{ id: "m-1", userId: "user-1", role: "partner", status: "active", scope: { ...scope, workspaceId: "other" } }] }, scope));
});

