"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { InviteUserUseCase } from "@/features/access/application/InviteUserUseCase";
import { ClerkAccessInvitationDelivery } from "@/features/access/infrastructure/ClerkAccessInvitationDelivery";
import { PrismaAccessInvitationRepository } from "@/features/access/infrastructure/PrismaAccessInvitationRepository";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import {
  ensureOrganizationAdminMembership,
  requireInternalAdmin,
} from "@/features/access/server/internalAdmin";
import { prisma } from "@/lib/prisma";

const INVITATION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export async function issuePartnerInvitation(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();

  if (!email || !workspaceId) {
    throw new Error("ACCESS_INVITATION_INPUT_REQUIRED");
  }

  let actor = await requireCurrentActor();
  requireInternalAdmin(actor);

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      organizationId: true,
      partnerId: true,
      status: true,
    },
  });

  if (!workspace) {
    throw new Error("ACCESS_WORKSPACE_NOT_FOUND");
  }

  if (workspace.status !== "active") {
    throw new Error("ACCESS_WORKSPACE_NOT_ACTIVE");
  }

  await ensureOrganizationAdminMembership(actor, workspace.organizationId);

  actor = await requireCurrentActor();

  const inviteUser = new InviteUserUseCase(
    new PrismaAccessInvitationRepository(prisma),
    new ClerkAccessInvitationDelivery(),
    "https://www.kyruma.com",
  );

  const result = await inviteUser.execute(actor, {
    email,
    role: "partner",
    scope: {
      organizationId: workspace.organizationId,
      partnerId: workspace.partnerId,
      workspaceId: workspace.id,
    },
    correlationId: randomUUID(),
    expiresAt: new Date(Date.now() + INVITATION_LIFETIME_MS),
  });

  redirect(
    `/access/admin?sent=1&invitationId=${encodeURIComponent(result.invitationId)}`,
  );
}
