import { auth, currentUser } from "@clerk/nextjs/server";
import { capabilityCatalog, roles, type Capability, type Role } from "../../identity/domain/capabilities";
import type { AuthenticatedActor } from "../../identity/domain/types";
import { prisma } from "../../../lib/prisma";

export async function requireCurrentActor(): Promise<AuthenticatedActor> {
  const { userId: subjectId } = await auth();
  if (!subjectId) throw new Error("UNAUTHENTICATED");
  const external = await currentUser();
  const email = external?.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("IDENTITY_EMAIL_REQUIRED");
  const user = await prisma.identityUser.upsert({ where: { externalSubjectId: subjectId }, update: { email, normalizedEmail: email.toLowerCase(), displayName: external.fullName ?? undefined, lastSignedInAt: new Date() }, create: { id: crypto.randomUUID(), externalSubjectId: subjectId, email, normalizedEmail: email.toLowerCase(), displayName: external.fullName ?? undefined, status: "active", createdAt: new Date(), lastSignedInAt: new Date() }, include: { memberships: true } });
  if (user.status !== "active") throw new Error("IDENTITY_SUSPENDED");
  const rows = user.memberships;
  return { user: { id: user.id, externalSubjectId: subjectId, email, displayName: user.displayName ?? undefined }, memberships: rows.map((membership) => {
    if (!roles.includes(membership.role as Role) || !["invited", "active", "revoked"].includes(membership.status)) throw new Error("MEMBERSHIP_CONTRACT_INVALID");
    const validCapabilities = (value: unknown): Capability[] => Array.isArray(value) ? value.filter((item): item is Capability => typeof item === "string" && capabilityCatalog.includes(item as Capability)) : [];
    return { id: membership.id, userId: membership.userId, role: membership.role as Role, status: membership.status as "invited" | "active" | "revoked", scope: { organizationId: membership.organizationId, partnerId: membership.partnerId ?? undefined, workspaceId: membership.workspaceId ?? undefined }, grants: validCapabilities(membership.grants), revocations: validCapabilities(membership.revocations), joinedAt: membership.joinedAt ?? undefined, revokedAt: membership.revokedAt ?? undefined };
  }) };
}
