"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { prisma } from "@/lib/prisma";

export async function requestPlatformAccess(): Promise<void> {
  const actor = await requireCurrentActor();
  const now = new Date();
  const normalizedEmail = actor.user.email.trim().toLowerCase();

  const activeMembership = actor.memberships.find(
    (membership) =>
      membership.status === "active" &&
      Boolean(membership.scope.workspaceId),
  );

  if (activeMembership) {
    redirect("/portal");
  }

  await prisma.accessRequest.upsert({
    where: { userId: actor.user.id },
    create: {
      id: randomUUID(),
      userId: actor.user.id,
      email: actor.user.email,
      normalizedEmail,
      displayName: actor.user.displayName,
      status: "pending",
      requestedAt: now,
      updatedAt: now,
    },
    update: {
      email: actor.user.email,
      normalizedEmail,
      displayName: actor.user.displayName,
      status: "pending",
      requestedAt: now,
      updatedAt: now,
      resolvedAt: null,
      resolvedBy: null,
      workspaceId: null,
    },
  });

  redirect("/access/pending?requested=1");
}
