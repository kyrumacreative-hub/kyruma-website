import { randomUUID } from "node:crypto";
import type { AuthenticatedActor } from "@/features/identity/domain/types";
import { normalizeEmail } from "@/features/access/domain/invitations";
import { prisma } from "@/lib/prisma";

function configuredAdminEmails(): Set<string> {
  return new Set(
    (process.env.KYRUMA_INTERNAL_ADMIN_EMAILS ?? "")
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

export function isInternalAdminEmail(email: string): boolean {
  return configuredAdminEmails().has(normalizeEmail(email));
}

export function requireInternalAdmin(actor: AuthenticatedActor): void {
  if (!isInternalAdminEmail(actor.user.email)) {
    throw new Error("ACCESS_ADMIN_DENIED");
  }
}

export async function ensureOrganizationAdminMembership(
  actor: AuthenticatedActor,
  organizationId: string,
): Promise<void> {
  requireInternalAdmin(actor);

  const existing = await prisma.foundationMembership.findFirst({
    where: {
      userId: actor.user.id,
      organizationId,
      status: "active",
      role: { in: ["super_admin", "admin"] },
    },
  });

  if (existing) return;

  await prisma.foundationMembership.create({
    data: {
      id: randomUUID(),
      userId: actor.user.id,
      organizationId,
      role: "super_admin",
      status: "active",
      grants: [],
      revocations: [],
      joinedAt: new Date(),
    },
  });
}
