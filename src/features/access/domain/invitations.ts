import { createHash, randomBytes } from "node:crypto";
import { AccessIdentityMismatchError, AccessInvitationError } from "./errors";
import type { AccessInvitation, AccessScope, ExternalIdentity, MembershipProvision } from "./types";
import type { Role } from "../../identity/domain/capabilities";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const hashAccessToken = (token: string) => createHash("sha256").update(token, "utf8").digest("hex");

export function issueAccessInvitation(input: { id: string; email: string; role: Role; scope: AccessScope; createdBy: string; correlationId: string; now: Date; expiresAt: Date; token?: string }): { invitation: AccessInvitation; token: string } {
  if (!input.scope.organizationId || input.expiresAt <= input.now) throw new AccessInvitationError("Invitation scope and future expiry are required.");
  const email = normalizeEmail(input.email);
  if (!email.includes("@")) throw new AccessInvitationError("A valid email is required.");
  const token = input.token ?? randomBytes(32).toString("base64url");
  return { token, invitation: { id: input.id, email, role: input.role, scope: input.scope, tokenHash: hashAccessToken(token), status: "pending", expiresAt: input.expiresAt, createdBy: input.createdBy, createdAt: input.now, correlationId: input.correlationId } };
}

export function acceptAccessInvitation(input: { invitation: AccessInvitation; token: string; identity: ExternalIdentity; userId: string; membershipId: string; now: Date }): MembershipProvision {
  const { invitation, now } = input;
  if (invitation.status !== "pending" || invitation.expiresAt <= now || hashAccessToken(input.token) !== invitation.tokenHash) throw new AccessInvitationError("Invitation is unavailable or expired.");
  if (normalizeEmail(input.identity.email) !== invitation.email) throw new AccessIdentityMismatchError("Sign in with the invited email address.");
  return { id: input.membershipId, userId: input.userId, role: invitation.role, scope: invitation.scope, status: "active", grants: [], revocations: [], joinedAt: now };
}

