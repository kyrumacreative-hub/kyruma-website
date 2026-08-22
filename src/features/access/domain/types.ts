import type { Capability, Role } from "../../identity/domain/capabilities";

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";
export interface AccessScope { organizationId: string; partnerId?: string; workspaceId?: string }
export interface AccessInvitation {
  id: string; email: string; role: Role; scope: AccessScope; tokenHash: string;
  tokenVersion: number;
  status: InvitationStatus; expiresAt: Date; createdBy: string; createdAt: Date;
  correlationId: string; acceptedBy?: string; acceptedAt?: Date; revokedAt?: Date;
}
export interface ExternalIdentity { subjectId: string; email: string; displayName?: string }
export interface MembershipProvision {
  id: string; userId: string; role: Role; scope: AccessScope; status: "active";
  grants: Capability[]; revocations: Capability[]; joinedAt: Date;
}
