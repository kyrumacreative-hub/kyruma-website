import type { Capability, Role } from "./capabilities";

export type MembershipStatus = "invited" | "active" | "revoked";
export type Visibility = "internal" | "shared" | "partner_private" | "public_link";

export interface UserIdentity { id: string; externalSubjectId: string; email: string; displayName?: string; }

export interface MembershipScope { organizationId?: string; partnerId?: string; workspaceId?: string; platform?: boolean; }

export interface Membership {
  id: string;
  userId: string;
  role: Role;
  status: MembershipStatus;
  scope: MembershipScope;
  grants?: Capability[];
  revocations?: Capability[];
  joinedAt?: Date;
  revokedAt?: Date;
}

export interface AuthenticatedActor { user: UserIdentity; memberships: Membership[]; }
export interface ResourceScope { organizationId?: string; partnerId?: string; workspaceId?: string; visibility?: Visibility; }
export interface AuthorizationRequest { capability: Capability; resource: ResourceScope; }
export type AuthorizationReason = "allowed" | "no_active_membership" | "capability_missing" | "scope_mismatch" | "visibility_denied";
export interface AuthorizationDecision { allowed: boolean; reason: AuthorizationReason; membershipId?: string; }
