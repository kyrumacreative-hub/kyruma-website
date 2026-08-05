import { requireAuthorization } from "../../identity/application/requireAuthorization";
import type { Capability } from "../../identity/domain/capabilities";
import type { Visibility } from "../../identity/domain/types";
import type { ResolvedPartnerContext } from "../domain/types";

export class ContextAccessDeniedError extends Error {
  readonly code = "CONTEXT_ACCESS_DENIED";

  constructor() { super("The requested resource is outside the active partner context."); }
}

export function requireContextAccess(context: ResolvedPartnerContext, capability: Capability, visibility: Visibility = "internal") {
  if (!context.capabilities.has(capability) || !context.allowedVisibilities.includes(visibility)) throw new ContextAccessDeniedError();
  return requireAuthorization(
    { ...context.actor, memberships: [context.membership] },
    { capability, resource: { organizationId: context.organization.id, partnerId: context.partner.id, workspaceId: context.workspace.id, visibility } },
  );
}
