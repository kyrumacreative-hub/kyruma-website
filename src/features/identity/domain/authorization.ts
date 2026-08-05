import { effectiveCapabilities } from "./capabilities";
import type { AuthenticatedActor, AuthorizationDecision, AuthorizationRequest, Membership, ResourceScope } from "./types";

export function membershipMatchesScope(membership: Membership, resource: ResourceScope) {
  if (membership.scope.platform) return true;
  if (!membership.scope.organizationId) return false;
  if (membership.scope.organizationId !== resource.organizationId) return false;
  if (membership.scope.partnerId && membership.scope.partnerId !== resource.partnerId) return false;
  if (membership.scope.workspaceId && membership.scope.workspaceId !== resource.workspaceId) return false;
  return true;
}

function visibilityAllows(membership: Membership, resource: ResourceScope) {
  if (resource.visibility !== "internal") return true;
  return membership.role !== "partner" && membership.role !== "viewer";
}

export function authorize(actor: AuthenticatedActor, request: AuthorizationRequest): AuthorizationDecision {
  const activeMemberships = actor.memberships.filter((membership) => membership.status === "active");
  if (activeMemberships.length === 0) return { allowed: false, reason: "no_active_membership" };
  const scopedMemberships = activeMemberships.filter((membership) => membershipMatchesScope(membership, request.resource));
  if (scopedMemberships.length === 0) return { allowed: false, reason: "scope_mismatch" };
  const capableMembership = scopedMemberships.find((membership) => effectiveCapabilities(membership.role, membership.grants, membership.revocations).has(request.capability));
  if (!capableMembership) return { allowed: false, reason: "capability_missing" };
  if (!visibilityAllows(capableMembership, request.resource)) return { allowed: false, reason: "visibility_denied" };
  return { allowed: true, reason: "allowed", membershipId: capableMembership.id };
}
