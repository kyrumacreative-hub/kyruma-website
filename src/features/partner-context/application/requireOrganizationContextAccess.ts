import { requireAuthorization } from "../../identity/application/requireAuthorization";
import type { Capability } from "../../identity/domain/capabilities";
import type { Visibility } from "../../identity/domain/types";
import type { ResolvedOrganizationContext } from "../domain/types";

export class OrganizationContextAccessDeniedError extends Error {
  readonly code = "ORGANIZATION_CONTEXT_ACCESS_DENIED";
  constructor() { super("The requested resource is outside the active organization context."); }
}

/** Server guard for pre-Partner operations. It delegates capability and scope checks to Identity. */
export function requireOrganizationContextAccess(
  context: ResolvedOrganizationContext,
  capability: Capability,
  visibility: Visibility = "internal",
) {
  if (!context.capabilities.has(capability) || !context.allowedVisibilities.includes(visibility)) {
    throw new OrganizationContextAccessDeniedError();
  }
  return requireAuthorization(
    { ...context.actor, memberships: [context.membership] },
    { capability, resource: { organizationId: context.organization.id, visibility } },
  );
}
