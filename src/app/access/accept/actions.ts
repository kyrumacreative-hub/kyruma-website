"use server";

import { randomUUID } from "node:crypto";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureAcceptedMembership } from "@/features/access/application/EnsureAcceptedMembership";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { acceptAccessInvitation, hashAccessToken } from "@/features/access/domain/invitations";
import type { AccessInvitation } from "@/features/access/domain/types";
import { toAccessInvitationDeliveryError } from "@/features/access/infrastructure/ClerkAccessInvitationDelivery";
import { prisma } from "@/lib/prisma";

export async function acceptInvitation(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  if (token.length < 20) throw new Error("ACCESS_INVITATION_INVALID");
  const actor = await requireCurrentActor();
  const now = new Date();
  const reconciliation = await prisma.$transaction(async (db) => {
    const invitation = await db.accessInvitation.findUnique({ where: { tokenHash: hashAccessToken(token) } });
    if (!invitation) throw new Error("ACCESS_INVITATION_UNAVAILABLE");
    if (invitation.status === "accepted" && invitation.acceptedBy === actor.user.id) {
      return { providerId: invitation.providerId, shouldRevoke: false };
    }

    const membershipId = randomUUID();
    const provision = acceptAccessInvitation({
      invitation: {
        id: invitation.id,
        email: invitation.normalizedEmail,
        role: invitation.role as AccessInvitation["role"],
        scope: {
          organizationId: invitation.organizationId,
          ...(invitation.partnerId ? { partnerId: invitation.partnerId } : {}),
          ...(invitation.workspaceId ? { workspaceId: invitation.workspaceId } : {}),
        },
        tokenHash: invitation.tokenHash,
        tokenVersion: invitation.tokenVersion,
        status: invitation.status as AccessInvitation["status"],
        expiresAt: invitation.expiresAt,
        createdBy: invitation.createdBy,
        createdAt: invitation.createdAt,
        correlationId: invitation.correlationId,
      },
      token,
      identity: { subjectId: actor.user.externalSubjectId, email: actor.user.email },
      userId: actor.user.id,
      membershipId,
      now,
    });
    const claimed = await db.accessInvitation.updateMany({ where: { id: invitation.id, status: "pending", acceptedAt: null }, data: { status: "accepted", acceptedBy: actor.user.id, acceptedAt: now } });
    if (claimed.count !== 1) throw new Error("ACCESS_INVITATION_ALREADY_USED");
    await ensureAcceptedMembership({
      findActiveOrInvited: async (value) => {
        const membership = await db.foundationMembership.findFirst({ where: { userId: value.userId, organizationId: value.scope.organizationId, partnerId: value.scope.partnerId, workspaceId: value.scope.workspaceId, role: value.role, status: { in: ["invited", "active"] } }, select: { id: true, status: true } });
        if (!membership) return null;
        if (membership.status !== "invited" && membership.status !== "active") throw new Error("MEMBERSHIP_CONTRACT_INVALID");
        return { id: membership.id, status: membership.status };
      },
      activate: async (id, joinedAt) => { await db.foundationMembership.update({ where: { id }, data: { status: "active", joinedAt } }); },
      create: async (value, invitedAt) => { await db.foundationMembership.create({ data: { id: value.id, userId: value.userId, organizationId: value.scope.organizationId, partnerId: value.scope.partnerId, workspaceId: value.scope.workspaceId, role: value.role, status: value.status, grants: value.grants, revocations: value.revocations, invitedAt, joinedAt: value.joinedAt } }); },
      ensureWorkspaceMember: async ({ workspaceId, membershipId: acceptedMembershipId, joinedAt }) => { await db.workspaceMember.upsert({ where: { workspaceId_membershipId: { workspaceId, membershipId: acceptedMembershipId } }, create: { id: randomUUID(), workspaceId, membershipId: acceptedMembershipId, owner: false, status: "active", joinedAt }, update: { status: "active", removedAt: null } }); },
    }, { provision, invitedAt: invitation.createdAt });
    return { providerId: invitation.providerId, shouldRevoke: true };
  });
  if (reconciliation.providerId && reconciliation.shouldRevoke) {
    try {
      const client = await clerkClient();
      await client.invitations.revokeInvitation(reconciliation.providerId);
    } catch (error) {
      console.error("CLERK_INVITATION_RECONCILIATION_FAILED", toAccessInvitationDeliveryError(error).code);
    }
  }
  redirect("/portal");
}
