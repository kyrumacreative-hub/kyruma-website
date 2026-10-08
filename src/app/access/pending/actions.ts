"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { prisma } from "@/lib/prisma";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function notifyKyrumaAccessRequest(input: {
  email: string;
  displayName?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "KYRUMA Platform <hello@kyruma.com>",
      to: ["hello@kyruma.com"],
      reply_to: input.email,
      subject: `Solicitud de acceso · ${input.email}`,
      html: `<p>Nueva solicitud de acceso a KYRUMA Platform.</p>
        <p><strong>Identidad:</strong> ${input.displayName ?? "Sin nombre"}<br>
        <strong>Email:</strong> ${input.email}</p>
        <p>Revisar en <a href="https://www.kyruma.com/access/admin">KYRUMA · Control de acceso</a>.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`ACCESS_REQUEST_NOTIFICATION_FAILED_${response.status}`);
  }
}

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

  const existing = await prisma.accessRequest.findUnique({
    where: { userId: actor.user.id },
    select: { status: true },
  });

  if (existing?.status === "pending") {
    redirect("/access/pending?requested=1");
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

  await notifyKyrumaAccessRequest({
    email: actor.user.email,
    displayName: actor.user.displayName,
  }).catch((error) =>
    console.error(
      "ACCESS_REQUEST_NOTIFICATION_FAILED",
      error instanceof Error ? error.name : "UNKNOWN",
    ),
  );

  redirect("/access/pending?requested=1");
}
