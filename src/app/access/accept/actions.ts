"use server";

import { randomUUID } from "node:crypto";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { hashAccessToken, normalizeEmail } from "@/features/access/domain/invitations";
import { prisma } from "@/lib/prisma";

export async function acceptInvitation(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  if (token.length < 20) throw new Error("ACCESS_INVITATION_INVALID");
  const actor = await requireCurrentActor();
  const now = new Date();
  const providerId = await prisma.$transaction(async (db) => {
    const invitation = await db.accessInvitation.findUnique({ where: { tokenHash: hashAccessToken(token) } });
    if (!invitation || invitation.status !== "pending" || invitation.expiresAt <= now) throw new Error("ACCESS_INVITATION_UNAVAILABLE");
    if (normalizeEmail(actor.user.email) !== invitation.normalizedEmail) throw new Error("ACCESS_IDENTITY_MISMATCH");
    const claimed = await db.accessInvitation.updateMany({ where: { id: invitation.id, status: "pending", acceptedAt: null }, data: { status: "accepted", acceptedBy: actor.user.id, acceptedAt: now } });
    if (claimed.count !== 1) throw new Error("ACCESS_INVITATION_ALREADY_USED");
    const existingMembership = await db.foundationMembership.findFirst({ where: { userId: actor.user.id, organizationId: invitation.organizationId, partnerId: invitation.partnerId, workspaceId: invitation.workspaceId, role: invitation.role, status: { in: ["invited", "active"] } } });
    if (existingMembership?.status === "invited") {
      await db.foundationMembership.update({ where: { id: existingMembership.id }, data: { status: "active", joinedAt: now } });
    } else if (!existingMembership) {
      await db.foundationMembership.create({ data: { id: randomUUID(), userId: actor.user.id, organizationId: invitation.organizationId, partnerId: invitation.partnerId, workspaceId: invitation.workspaceId, role: invitation.role, status: "active", grants: [], revocations: [], invitedAt: invitation.createdAt, joinedAt: now } });
    }
    return invitation.providerId;
  });
  if (providerId) {
    try {
      const client = await clerkClient();
      await client.invitations.revokeInvitation(providerId);
    } catch (error) {
      console.error("CLERK_INVITATION_RECONCILIATION_FAILED", error instanceof Error ? error.message : "Unexpected Clerk reconciliation failure.");
    }
  }
  redirect("/portal");
}
