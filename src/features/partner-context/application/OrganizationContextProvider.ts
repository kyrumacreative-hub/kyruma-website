import { membershipMatchesScope } from "../../identity/domain/authorization";
import { effectiveCapabilities } from "../../identity/domain/capabilities";
import type { AuthenticatedActor, Membership } from "../../identity/domain/types";
import type { OrganizationContext, ResolvedOrganizationContext } from "../domain/types";
import type { OrganizationContextRepository } from "../ports/OrganizationContextRepository";

export class OrganizationContextNotFoundError extends Error {
  constructor() { super("The requested organization context is not available."); }
}

export class OrganizationContextUnauthorizedError extends Error {
  constructor() { super("The requested organization context is not available."); }
}

function selectMembership(actor: AuthenticatedActor, organization: OrganizationContext): Membership | undefined {
  return actor.memberships.find((membership) => (
    membership.status === "active"
    && membershipMatchesScope(membership, { organizationId: organization.id, visibility: "internal" })
  ));
}

export interface OrganizationContextProvider {
  resolve(actor: AuthenticatedActor, organizationId: string): Promise<ResolvedOrganizationContext>;
}

/** Resolves a scoped Foundation context for resources that do not yet have a Partner. */
export class DefaultOrganizationContextProvider implements OrganizationContextProvider {
  constructor(private readonly repository: OrganizationContextRepository) {}

  async resolve(actor: AuthenticatedActor, organizationId: string): Promise<ResolvedOrganizationContext> {
    const organization = await this.repository.findByOrganizationId(organizationId);
    if (!organization || organization.id !== organizationId) throw new OrganizationContextNotFoundError();
    const membership = selectMembership(actor, organization);
    if (!membership) throw new OrganizationContextUnauthorizedError();

    return {
      contextKey: `${actor.user.id}:${membership.id}:${organization.id}`,
      actor,
      membership,
      organization,
      capabilities: effectiveCapabilities(membership.role, membership.grants, membership.revocations),
      allowedVisibilities: membership.role === "partner" || membership.role === "viewer"
        ? ["shared", "partner_private", "public_link"]
        : ["internal", "shared", "partner_private", "public_link"],
    };
  }
}
