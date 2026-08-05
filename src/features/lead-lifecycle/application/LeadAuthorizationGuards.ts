import { requireOrganizationContextAccess } from "../../partner-context/application/requireOrganizationContextAccess";
import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import type { LeadAuditContext } from "../ports/AuditContextRecorder";

export class LeadContextMismatchError extends Error {
  readonly code = "LEAD_CONTEXT_MISMATCH";
  constructor() { super("The Lead does not belong to the active organization context."); }
}

/**
 * Application-only guard. Foundation owns capability, membership, scope and
 * visibility evaluation; this class only maps an approved use case to one capability.
 */
export class LeadAuthorizationGuards {
  create(context: ResolvedOrganizationContext, timestamp: Date): LeadAuditContext {
    return this.authorize(context, "lead.create", "create", timestamp);
  }

  changeOwner(context: ResolvedOrganizationContext, timestamp: Date): LeadAuditContext {
    return this.authorize(context, "lead.ownership.update", "ownership.update", timestamp);
  }

  startDiscovery(context: ResolvedOrganizationContext, timestamp: Date): LeadAuditContext {
    return this.authorize(context, "lead.discovery.start", "discovery.start", timestamp);
  }

  completeQualification(context: ResolvedOrganizationContext, timestamp: Date): LeadAuditContext {
    return this.authorize(context, "lead.qualification.approve", "qualification.approve", timestamp);
  }

  createPartner(context: ResolvedOrganizationContext, timestamp: Date): LeadAuditContext {
    return this.authorize(context, "lead.partner.create", "partner.create", timestamp);
  }

  assertLeadOrganization(context: ResolvedOrganizationContext, organizationId: string): void {
    if (context.organization.id !== organizationId) throw new LeadContextMismatchError();
  }

  private authorize(context: ResolvedOrganizationContext, capability: Parameters<typeof requireOrganizationContextAccess>[1], action: string, timestamp: Date): LeadAuditContext {
    requireOrganizationContextAccess(context, capability);
    return {
      actorId: context.actor.user.id,
      organizationId: context.organization.id,
      membershipId: context.membership.id,
      timestamp,
      action,
    };
  }
}
