import type { Capability } from "../../identity/domain/capabilities";
import type { AuthenticatedActor, Membership, Visibility } from "../../identity/domain/types";

export type PartnerStatus = "onboarding" | "active" | "paused" | "growth" | "alumni" | "terminated";
export type WorkspaceAccess = "internal" | "external_disabled" | "external_active";

export interface OrganizationContext { id: string; displayName: string; }
export interface PartnerContext { id: string; publicId: string; status: PartnerStatus; displayName: string; }
export interface WorkspaceContext { id: string; displayName: string; access: WorkspaceAccess; }

export interface PartnerContextRecord {
  organization: OrganizationContext;
  partner: PartnerContext;
  workspaces: WorkspaceContext[];
  primaryWorkspaceId?: string;
}

export interface ContextSelection {
  partnerPublicId: string;
  /** Internal selection only until the business approves a public workspace identifier. */
  workspaceId?: string;
}

export interface ResolvedPartnerContext {
  contextKey: string;
  actor: AuthenticatedActor;
  membership: Membership;
  organization: OrganizationContext;
  partner: PartnerContext;
  workspace: WorkspaceContext;
  capabilities: ReadonlySet<Capability>;
  allowedVisibilities: readonly Visibility[];
}

/**
 * Additive pre-Partner context for domains that operate before a Partner and
 * Workspace exist. It intentionally cannot be used as a Partner Context.
 */
export interface ResolvedOrganizationContext {
  contextKey: string;
  actor: AuthenticatedActor;
  membership: Membership;
  organization: OrganizationContext;
  capabilities: ReadonlySet<Capability>;
  allowedVisibilities: readonly Visibility[];
}

export type ContextEventType = "PartnerContextResolved" | "PartnerContextChanged" | "WorkspaceResolved" | "MembershipResolved" | "ContextUnauthorized";

export interface ContextEvent {
  type: ContextEventType;
  occurredAt: Date;
  actorId: string;
  partnerPublicId?: string;
  workspaceId?: string;
  previousContextKey?: string;
  reason?: string;
}
