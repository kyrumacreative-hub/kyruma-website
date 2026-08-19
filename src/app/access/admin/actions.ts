"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
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

function optionalExternalUrl(value: FormDataEntryValue | null, host: string): string | undefined {
  const raw = String(value ?? "").trim();
  if (!raw) return undefined;
  const url = new URL(raw);
  if (url.protocol !== "https:" || !url.hostname.endsWith(host)) {
    throw new Error("ACCESS_EXTERNAL_URL_INVALID");
  }
  return url.toString();
}

export async function provisionPartnerWorkspace(formData: FormData): Promise<void> {
  const workspaceName = String(formData.get("workspaceName") ?? "").trim();
  const partnerEmail = String(formData.get("partnerEmail") ?? "").trim().toLowerCase();
  const figmaUrl = optionalExternalUrl(formData.get("figmaUrl"), "figma.com");
  const driveUrl = optionalExternalUrl(formData.get("driveUrl"), "drive.google.com");

  if (!workspaceName || workspaceName.length > 120 || !partnerEmail.includes("@")) {
    throw new Error("ACCESS_WORKSPACE_INPUT_INVALID");
  }

  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);

  const clerk = await clerkClient();
  const clerkUsers = await clerk.users.getUserList({
    emailAddress: [partnerEmail],
    limit: 2,
  });
  const clerkUser = clerkUsers.data.find((user) =>
    user.emailAddresses.some(
      (address) => address.emailAddress.toLowerCase() === partnerEmail,
    ),
  );
  if (!clerkUser) throw new Error("ACCESS_PARTNER_CLERK_IDENTITY_NOT_FOUND");

  const result = await prisma.$transaction(async (db) => {
    let partnerUser = await db.identityUser.findUnique({
      where: { normalizedEmail: partnerEmail },
    });
    if (!partnerUser) {
      partnerUser = await db.identityUser.create({
        data: {
          id: randomUUID(),
          externalSubjectId: clerkUser.id,
          email: partnerEmail,
          normalizedEmail: partnerEmail,
          displayName:
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            undefined,
          status: "active",
          createdAt: new Date(),
        },
      });
    }
    if (partnerUser.status !== "active") throw new Error("ACCESS_PARTNER_IDENTITY_INACTIVE");

    const existingMembership = await db.foundationMembership.findFirst({
      where: { userId: partnerUser.id, status: "active", role: "partner" },
      select: { workspaceId: true },
    });
    if (existingMembership?.workspaceId) {
      throw new Error("ACCESS_PARTNER_ALREADY_PROVISIONED");
    }

    const sequence = await db.$queryRaw<{ allocated: bigint }[]>(
      Prisma.sql`SELECT nextval('"PartnerCodeSequence_value_seq"') AS allocated`,
    );
    if (sequence.length !== 1) throw new Error("ACCESS_PARTNER_CODE_UNAVAILABLE");

    const now = new Date();
    const code = `KYR-${String(Number(sequence[0].allocated)).padStart(3, "0")}`;
    const organizationId = randomUUID();
    const leadId = randomUUID();
    const partnerId = randomUUID();
    const workspaceId = randomUUID();
    const membershipId = randomUUID();
    const workspaceMemberId = randomUUID();

    await db.lead.create({
      data: {
        id: leadId,
        organizationId,
        ownerId: actor.user.id,
        primaryContactId: `email:${partnerEmail}`,
        origin: "platform_admin_import",
        status: "partner_created",
        createdAt: now,
        createdBy: actor.user.id,
      },
    });

    await db.partner.create({
      data: {
        id: partnerId,
        code,
        leadId,
        organizationId,
        primaryWorkspaceId: workspaceId,
        initialOwnerMembershipId: membershipId,
        status: "active",
        correlationId: `platform-admin:${workspaceId}`,
        createdAt: now,
      },
    });

    await db.partnerWorkspace.create({
      data: { id: workspaceId, partnerId, primary: true },
    });
    await db.partnerMembership.create({
      data: { id: membershipId, partnerId, role: "owner", status: "active" },
    });
    await db.workspace.create({
      data: {
        id: workspaceId,
        partnerId,
        organizationId,
        name: workspaceName,
        primary: true,
        status: "active",
        initialOwnerMemberId: workspaceMemberId,
        initialOwnerMembershipId: membershipId,
        settingsVersion: 1,
        createdAt: now,
        correlationId: `platform-admin:${workspaceId}`,
      },
    });
    await db.workspaceSettings.create({
      data: {
        workspaceId,
        version: 1,
        values: { locale: "es", externalResources: { figmaUrl, driveUrl } },
      },
    });
    await db.foundationMembership.create({
      data: {
        id: membershipId,
        userId: partnerUser.id,
        organizationId,
        partnerId,
        workspaceId,
        role: "partner",
        status: "active",
        grants: [],
        revocations: [],
        invitedAt: now,
        joinedAt: now,
      },
    });
    await db.workspaceMember.create({
      data: {
        id: workspaceMemberId,
        workspaceId,
        membershipId,
        owner: true,
        status: "active",
        joinedAt: now,
      },
    });

    const resources: { id: string; title: string; externalUrl: string }[] = [];
    if (figmaUrl) {
      resources.push({ id: randomUUID(), title: "Figma", externalUrl: figmaUrl });
    }
    if (driveUrl) {
      resources.push({ id: randomUUID(), title: "Google Drive", externalUrl: driveUrl });
    }

    if (resources.length) {
      await db.portalShare.createMany({
        data: resources.map((resource) => ({
          ...resource,
          organizationId,
          partnerId,
          workspaceId,
          kind: "link",
          summary: `Recurso oficial de ${workspaceName}`,
          visibility: "shared",
          publishedAt: now,
          publishedBy: actor.user.id,
        })),
      });
    }

    return { code };
  });

  redirect(`/access/admin?created=1&workspaceCode=${encodeURIComponent(result.code)}`);
}

export async function linkWorkspaceFigmaResource(formData: FormData): Promise<void> {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const figmaUrl = optionalExternalUrl(formData.get("figmaUrl"), "figma.com");

  if (!workspaceId || !figmaUrl) {
    throw new Error("ACCESS_FIGMA_RESOURCE_INPUT_REQUIRED");
  }

  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      organizationId: true,
      partnerId: true,
      status: true,
    },
  });

  if (!workspace) throw new Error("ACCESS_WORKSPACE_NOT_FOUND");
  if (workspace.status !== "active") throw new Error("ACCESS_WORKSPACE_NOT_ACTIVE");

  await prisma.$transaction(async (db) => {
    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId },
      select: { values: true, version: true },
    });
    const currentValues =
      settings?.values &&
      typeof settings.values === "object" &&
      !Array.isArray(settings.values)
        ? (settings.values as Prisma.JsonObject)
        : {};
    const currentExternalResources =
      currentValues.externalResources &&
      typeof currentValues.externalResources === "object" &&
      !Array.isArray(currentValues.externalResources)
        ? (currentValues.externalResources as Prisma.JsonObject)
        : {};

    await db.workspaceSettings.upsert({
      where: { workspaceId },
      create: {
        workspaceId,
        version: 1,
        values: { locale: "es", externalResources: { figmaUrl } },
      },
      update: {
        version: (settings?.version ?? 0) + 1,
        values: {
          ...currentValues,
          externalResources: {
            ...currentExternalResources,
            figmaUrl,
          },
        },
      },
    });

    const existingFigmaShare = await db.portalShare.findFirst({
      where: { workspaceId, kind: "link", title: "Figma" },
      orderBy: { publishedAt: "desc" },
      select: { id: true },
    });
    const shareData = {
      externalUrl: figmaUrl,
      summary: `Recurso oficial de ${workspace.name}`,
      visibility: "shared",
      publishedAt: new Date(),
      publishedBy: actor.user.id,
    };

    if (existingFigmaShare) {
      await db.portalShare.update({
        where: { id: existingFigmaShare.id },
        data: shareData,
      });
    } else {
      await db.portalShare.create({
        data: {
          id: randomUUID(),
          organizationId: workspace.organizationId,
          partnerId: workspace.partnerId,
          workspaceId,
          kind: "link",
          title: "Figma",
          ...shareData,
        },
      });
    }
  });

  redirect(`/access/admin?linked=figma&workspaceId=${encodeURIComponent(workspaceId)}`);
}

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
