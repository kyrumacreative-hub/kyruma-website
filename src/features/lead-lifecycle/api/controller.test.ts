import assert from "node:assert/strict";
import test from "node:test";
import { effectiveCapabilities } from "../../identity/domain/capabilities";
import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import { ApplicationError } from "../application/useCases";
import { AuthorizationDeniedError } from "../../identity/application/requireAuthorization";
import { composeLeadLifecycleApi } from "./composition";
import type { InternalApiRequest, LeadLifecycleApiDependencies } from "./contracts";
import { LeadLifecycleController } from "./controller";
import { InfrastructureNotConfiguredError, MissingOrganizationContextError } from "./errors";

function context(): ResolvedOrganizationContext {
  const membership = { id: "membership-1", userId: "user-1", role: "admin" as const, status: "active" as const, scope: { organizationId: "org-1" } };
  return { contextKey: "ctx-1", actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "admin@example.com" }, memberships: [membership] }, membership, organization: { id: "org-1", displayName: "Organization" }, capabilities: effectiveCapabilities("admin"), allowedVisibilities: ["internal", "shared", "partner_private", "public_link"] };
}

function dependencies(overrides: Partial<LeadLifecycleApiDependencies> = {}) {
  const calls: { name: string; input: unknown }[] = [];
  const execute = (name: string, response: unknown = { id: "lead-1", status: "identified" }) => async (input: unknown) => { calls.push({ name, input }); return response; };
  const deps: LeadLifecycleApiDependencies = {
    contextAdapter: { resolve: async () => context() },
    operationMetadata: { create: () => ({ eventId: "request-1", occurredAt: new Date("2026-08-05") }) },
    createLead: { execute: execute("create") }, getLead: { execute: execute("get", { id: "lead-1", status: "identified", organizationId: "org-1" }) },
    updateLead: { execute: execute("update") }, archiveLead: { execute: execute("archive") }, reactivateLead: { execute: execute("reactivate") },
    changeOwner: { execute: execute("owner") }, ownershipHistory: { execute: execute("history", []) }, startDiscovery: { execute: execute("start-discovery") },
    discoveryStatus: { execute: execute("discovery-status", { leadId: "lead-1", status: "completed", version: 1 }) }, startQualification: { execute: execute("start-qualification") },
    completeQualification: { execute: execute("complete-qualification") }, createPartner: { execute: execute("partner", { id: "lead-1", status: "partner_created", partner: { partnerId: "partner-1", publicId: "KYR-001", workspaceId: "workspace-1", membershipId: "membership-2" } }) },
    ...overrides,
  } as LeadLifecycleApiDependencies;
  return { deps, calls };
}

const leadRequest: InternalApiRequest = { params: { leadId: "lead-1" } };

test("controller validates input and invokes CreateLead with trusted context metadata", async () => {
  const { deps, calls } = dependencies(); const controller = new LeadLifecycleController(deps);
  const response = await controller.createLead({ body: { id: "lead-1", organizationId: "org-1", ownerId: "owner-1", primaryContactId: "contact-1", origin: "manual" } });
  assert.equal(response.status, 201);
  assert.equal(calls[0]?.name, "create");
  assert.deepEqual(calls[0]?.input, { id: "lead-1", organizationId: "org-1", ownerId: "owner-1", primaryContactId: "contact-1", origin: "manual", createdAt: new Date("2026-08-05"), createdBy: "user-1" });
});

test("controller rejects invalid route and body data before invoking a use case", async () => {
  const { deps, calls } = dependencies(); const controller = new LeadLifecycleController(deps);
  const missingId = await controller.getLead({ params: {} });
  const badArchive = await controller.archiveLead({ ...leadRequest, body: { reason: "" } });
  assert.equal(missingId.status, 400); assert.equal(badArchive.status, 400); assert.equal(calls.length, 0);
});

test("controllers route every approved endpoint to its application handler", async () => {
  const { deps, calls } = dependencies(); const controller = new LeadLifecycleController(deps);
  await controller.getLead(leadRequest); await controller.updateLead({ ...leadRequest, body: { primaryContactId: "contact-2" } });
  await controller.archiveLead({ ...leadRequest, body: { reason: "pause" } }); await controller.reactivateLead({ ...leadRequest, body: { reason: "resume" } });
  await controller.changeOwner({ ...leadRequest, body: { ownerId: "owner-2", reason: "capacity" } }); await controller.getOwnershipHistory(leadRequest);
  await controller.startDiscovery(leadRequest); await controller.getDiscoveryStatus(leadRequest);
  await controller.startQualification({ ...leadRequest, body: { hasCompletedDiscovery: true } });
  await controller.completeQualification({ ...leadRequest, body: { hasCompletedDiscovery: true, qualificationId: "qualification-1", decision: "continue", reason: "fit" } });
  await controller.createPartner({ ...leadRequest, body: { qualificationDecisionId: "qualification-1" } });
  assert.deepEqual(calls.map((call) => call.name), ["get", "update", "archive", "reactivate", "owner", "history", "start-discovery", "discovery-status", "start-qualification", "complete-qualification", "partner"]);
});

test("controllers map context absence, authorization, conflicts and infrastructure safely", async () => {
  const missing = dependencies({ contextAdapter: { resolve: async () => { throw new MissingOrganizationContextError("missing"); } } });
  assert.equal((await new LeadLifecycleController(missing.deps).getLead(leadRequest)).status, 401);
  const conflict = dependencies({ getLead: { execute: async () => { throw new ApplicationError("not found", "LEAD_NOT_FOUND"); } } });
  assert.equal((await new LeadLifecycleController(conflict.deps).getLead(leadRequest)).status, 404);
  const unavailable = dependencies({ getLead: { execute: async () => { throw new ApplicationError("offline", "LEAD_INFRASTRUCTURE_ERROR"); } } });
  assert.equal((await new LeadLifecycleController(unavailable.deps).getLead(leadRequest)).status, 503);
  const denied = dependencies({ getLead: { execute: async () => { throw new AuthorizationDeniedError(); } } });
  assert.equal((await new LeadLifecycleController(denied.deps).getLead(leadRequest)).status, 403);
});

test("composition fails closed when real infrastructure is not configured", () => {
  assert.throws(() => composeLeadLifecycleApi({}), InfrastructureNotConfiguredError);
  const { deps } = dependencies();
  assert.ok(composeLeadLifecycleApi(deps) instanceof LeadLifecycleController);
});
