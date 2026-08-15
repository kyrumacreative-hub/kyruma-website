"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { hashAccessToken, normalizeEmail } from "@/features/access/domain/invitations";
import { prisma } from "@/lib/prisma";

export async function acceptInvitation(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  if (token.length < 20) throw new Error("ACCESS_INVITATION_INVALID");
  const actor = await requireCurrentActor();
  const now = new Date();
  await prisma.$transaction(async (db) => {
    const invitation = await db.accessInvitation.findUnique({ where: { tokenHash: hashAccessToken(token) } });
    if (!invitation || invitation.status !== "pending" || invitation.expiresAt <= now) throw new Error("ACCESS_INVITATION_UNAVAILABLE");
    if (normalizeEmail(actor.user.email) !== invitation.normalizedEmail) throw new Error("ACCESS_IDENTITY_MISMATCH");
    const claimed = await db.accessInvitation.updateMany({ where: { id: invitation.id, status: "pending", acceptedAt: null }, data: { status: "accepted", acceptedBy: actor.user.id, acceptedAt: now } });
    if (claimed.count !== 1) throw new Error("ACCESS_INVITATION_ALREADY_USED");
    await db.foundationMembership.create({ data: { id: randomUUID(), userId: actor.user.id, organizationId: invitation.organizationId, partnerId: invitation.partnerId, workspaceId: invitation.workspaceId, role: invitation.role, status: "active", grants: [], revocations: [], invitedAt: invitation.createdAt, joinedAt: now } });
  });
  redirect("/portal");
}

