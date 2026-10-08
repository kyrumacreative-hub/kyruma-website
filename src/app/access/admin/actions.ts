"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Role } from "@/features/identity/domain/capabilities";
import {
  parseExternalResourceUrl,
  type ExternalResourceProvider,
} from "@/features/access/domain/externalResources";
import { createInvitationWorker, createInvitePartnerUseCase } from "@/features/access/server/invitationComposition";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import {
  ensureOrganizationAdminMembership,
  requireInternalAdmin,
} from "@/features/access/server/internalAdmin";
import { prisma } from "@/lib/prisma";

const INVITATION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export async function provisionPartnerWorkspace(formData: FormData): Promise<void> {
  const workspaceName = String(formData.get("workspaceName") ?? "").trim();
  const partnerEmail = String(formData.get("partnerEmail") ?? "").trim().toLowerCase();
  const figmaUrl = parseExternalResourceUrl(formData.get("figmaUrl"), "figma");
  const driveUrl = parseExternalResourceUrl(
    formData.get("driveUrl"),
    "google-drive",
  );

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

export async function linkWorkspaceExternalResource(formData: FormData): Promise<void> {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const provider = String(formData.get("provider") ?? "") as ExternalResourceProvider;
  if (!(["figma", "google-drive"] as const).includes(provider)) {
    throw new Error("ACCESS_EXTERNAL_RESOURCE_PROVIDER_INVALID");
  }
  const externalUrl = parseExternalResourceUrl(
    formData.get("externalUrl"),
    provider,
  );
  const title = provider === "figma" ? "Figma" : "Google Drive";
  const settingsKey = provider === "figma" ? "figmaUrl" : "driveUrl";

  if (!workspaceId || !externalUrl) {
    throw new Error("ACCESS_EXTERNAL_RESOURCE_INPUT_REQUIRED");
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
        values: {
          locale: "es",
          externalResources: { [settingsKey]: externalUrl },
        },
      },
      update: {
        version: (settings?.version ?? 0) + 1,
        values: {
          ...currentValues,
          externalResources: {
            ...currentExternalResources,
            [settingsKey]: externalUrl,
          },
        },
      },
    });

    const existingShare = await db.portalShare.findFirst({
      where: { workspaceId, kind: "link", title },
      orderBy: { publishedAt: "desc" },
      select: { id: true },
    });
    const shareData = {
      externalUrl,
      summary: `Recurso oficial de ${workspace.name}`,
      visibility: "shared",
      publishedAt: new Date(),
      publishedBy: actor.user.id,
    };

    if (existingShare) {
      await db.portalShare.update({
        where: { id: existingShare.id },
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
          title,
          ...shareData,
        },
      });
    }
  });

  redirect(
    `/access/admin?linked=${encodeURIComponent(provider)}&workspaceId=${encodeURIComponent(workspaceId)}`,
  );
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

  const inviteUser = createInvitePartnerUseCase();

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

  const worker = createInvitationWorker();
  await worker.dispatch.execute({ workerId: `access-action:${result.eventId}`, limit: 25 });
  await worker.process.execute({ workerId: `access-action:${result.eventId}`, limit: 25 });
  const eventStatus = await worker.status(result.eventId, workspace.organizationId);
  const delivery = eventStatus?.deliveries.find(
    (item) => item.consumer === "access" && item.handler === "deliver-partner-invitation",
  );
  const deliveryState = delivery?.status === "processed"
    ? "sent"
    : delivery?.status === "dead_lettered"
      ? "failed"
      : "queued";
  const error = deliveryState === "failed" && delivery?.errorCode
    ? `&error=${encodeURIComponent(delivery.errorCode)}`
    : "";

  redirect(
    `/access/admin?delivery=${deliveryState}&invitationId=${encodeURIComponent(result.invitationId)}${error}`,
  );
}


export async function approveAccessRequest(formData: FormData): Promise<void> {
  const requestId = String(formData.get("requestId") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();

  if (!requestId || !workspaceId) {
    throw new Error("ACCESS_REQUEST_APPROVAL_INPUT_REQUIRED");
  }

  let actor = await requireCurrentActor();
  requireInternalAdmin(actor);

  const [accessRequest, workspace] = await Promise.all([
    prisma.accessRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        email: true,
        status: true,
      },
    }),
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        organizationId: true,
        partnerId: true,
        status: true,
      },
    }),
  ]);

  if (!accessRequest) throw new Error("ACCESS_REQUEST_NOT_FOUND");
  if (accessRequest.status !== "pending") {
    throw new Error("ACCESS_REQUEST_NOT_PENDING");
  }
  if (!workspace) throw new Error("ACCESS_WORKSPACE_NOT_FOUND");
  if (workspace.status !== "active") {
    throw new Error("ACCESS_WORKSPACE_NOT_ACTIVE");
  }

  await ensureOrganizationAdminMembership(actor, workspace.organizationId);
  actor = await requireCurrentActor();

  const inviteUser = createInvitePartnerUseCase();
  const result = await inviteUser.execute(actor, {
    email: accessRequest.email,
    role: "partner",
    scope: {
      organizationId: workspace.organizationId,
      partnerId: workspace.partnerId,
      workspaceId: workspace.id,
    },
    correlationId: randomUUID(),
    expiresAt: new Date(Date.now() + INVITATION_LIFETIME_MS),
  });

  const worker = createInvitationWorker();
  await worker.dispatch.execute({
    workerId: `access-request:${result.eventId}`,
    limit: 25,
  });
  await worker.process.execute({
    workerId: `access-request:${result.eventId}`,
    limit: 25,
  });

  const eventStatus = await worker.status(result.eventId, workspace.organizationId);
  const delivery = eventStatus?.deliveries.find(
    (item) =>
      item.consumer === "access" &&
      item.handler === "deliver-partner-invitation",
  );
  const deliveryState =
    delivery?.status === "processed"
      ? "sent"
      : delivery?.status === "dead_lettered"
        ? "failed"
        : "queued";

  if (deliveryState !== "failed") {
    await prisma.accessRequest.update({
      where: { id: accessRequest.id },
      data: {
        status: "invited",
        resolvedAt: new Date(),
        resolvedBy: actor.user.id,
        workspaceId: workspace.id,
        updatedAt: new Date(),
      },
    });
  }

  const error =
    deliveryState === "failed" && delivery?.errorCode
      ? `&error=${encodeURIComponent(delivery.errorCode)}`
      : "";

  redirect(
    `/access/admin?requestApproved=${deliveryState === "failed" ? "0" : "1"}&delivery=${deliveryState}&invitationId=${encodeURIComponent(result.invitationId)}${error}`,
  );
}


export async function reissuePartnerInvitation(formData: FormData): Promise<void> {
  const invitationId = String(formData.get("invitationId") ?? "").trim();
  if (!invitationId) {
    throw new Error("ACCESS_INVITATION_REISSUE_INPUT_REQUIRED");
  }

  let actor = await requireCurrentActor();
  requireInternalAdmin(actor);

  const invitation = await prisma.accessInvitation.findUnique({
    where: { id: invitationId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      providerId: true,
      acceptedAt: true,
      organizationId: true,
      partnerId: true,
      workspaceId: true,
    },
  });

  if (!invitation) throw new Error("ACCESS_INVITATION_NOT_FOUND");
  if (invitation.status !== "pending" || invitation.acceptedAt) {
    throw new Error("ACCESS_INVITATION_NOT_REISSUABLE");
  }
  if (!invitation.workspaceId || !invitation.partnerId) {
    throw new Error("ACCESS_INVITATION_SCOPE_INVALID");
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: invitation.workspaceId },
    select: {
      id: true,
      organizationId: true,
      partnerId: true,
      status: true,
    },
  });

  if (!workspace) throw new Error("ACCESS_WORKSPACE_NOT_FOUND");
  if (
    workspace.status !== "active" ||
    workspace.organizationId !== invitation.organizationId ||
    workspace.partnerId !== invitation.partnerId
  ) {
    throw new Error("ACCESS_INVITATION_SCOPE_MISMATCH");
  }

  await ensureOrganizationAdminMembership(actor, workspace.organizationId);
  actor = await requireCurrentActor();

  if (invitation.providerId) {
    const clerk = await clerkClient();
    try {
      await clerk.invitations.revokeInvitation(invitation.providerId);
    } catch {
      throw new Error("ACCESS_INVITATION_PROVIDER_REVOKE_FAILED");
    }
  }

  const revokedAt = new Date();
  const revoked = await prisma.accessInvitation.updateMany({
    where: {
      id: invitation.id,
      status: "pending",
      acceptedAt: null,
    },
    data: {
      status: "revoked",
      deliveryStatus: "revoked",
      revokedAt,
    },
  });

  if (revoked.count !== 1) {
    throw new Error("ACCESS_INVITATION_REISSUE_CONFLICT");
  }

  const inviteUser = createInvitePartnerUseCase();
  const result = await inviteUser.execute(actor, {
    email: invitation.email,
    role: invitation.role as Role,
    scope: {
      organizationId: workspace.organizationId,
      partnerId: workspace.partnerId,
      workspaceId: workspace.id,
    },
    correlationId: randomUUID(),
    expiresAt: new Date(Date.now() + INVITATION_LIFETIME_MS),
  });

  const worker = createInvitationWorker();
  await worker.dispatch.execute({
    workerId: `access-reissue:${result.eventId}`,
    limit: 25,
  });
  await worker.process.execute({
    workerId: `access-reissue:${result.eventId}`,
    limit: 25,
  });

  const eventStatus = await worker.status(result.eventId, workspace.organizationId);
  const delivery = eventStatus?.deliveries.find(
    (item) =>
      item.consumer === "access" &&
      item.handler === "deliver-partner-invitation",
  );
  const deliveryState =
    delivery?.status === "processed"
      ? "sent"
      : delivery?.status === "dead_lettered"
        ? "failed"
        : "queued";
  const error =
    deliveryState === "failed" && delivery?.errorCode
      ? `&error=${encodeURIComponent(delivery.errorCode)}`
      : "";

  redirect(
    `/access/admin?reissued=1&delivery=${deliveryState}&invitationId=${encodeURIComponent(result.invitationId)}${error}`,
  );
}


export async function revokePartnerMembership(formData: FormData): Promise<void> {
  const membershipId = String(formData.get("membershipId") ?? "").trim();
  if (!membershipId) {
    throw new Error("ACCESS_MEMBERSHIP_REVOKE_INPUT_REQUIRED");
  }

  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);

  const membership = await prisma.foundationMembership.findUnique({
    where: { id: membershipId },
    select: {
      id: true,
      userId: true,
      role: true,
      status: true,
      organizationId: true,
      partnerId: true,
      workspaceId: true,
    },
  });

  if (!membership) throw new Error("ACCESS_MEMBERSHIP_NOT_FOUND");
  if (membership.role !== "partner") {
    throw new Error("ACCESS_MEMBERSHIP_REVOKE_ROLE_INVALID");
  }
  if (membership.status !== "active") {
    throw new Error("ACCESS_MEMBERSHIP_NOT_ACTIVE");
  }
  if (!membership.workspaceId || !membership.partnerId) {
    throw new Error("ACCESS_MEMBERSHIP_SCOPE_INVALID");
  }
  if (membership.userId === actor.user.id) {
    throw new Error("ACCESS_MEMBERSHIP_SELF_REVOKE_DENIED");
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: membership.workspaceId },
    select: {
      id: true,
      organizationId: true,
      partnerId: true,
    },
  });

  if (
    !workspace ||
    workspace.organizationId !== membership.organizationId ||
    workspace.partnerId !== membership.partnerId
  ) {
    throw new Error("ACCESS_MEMBERSHIP_SCOPE_MISMATCH");
  }

  const revokedAt = new Date();
  await prisma.$transaction(async (db) => {
    const revoked = await db.foundationMembership.updateMany({
      where: {
        id: membership.id,
        status: "active",
        role: "partner",
      },
      data: {
        status: "revoked",
        revokedAt,
      },
    });

    if (revoked.count !== 1) {
      throw new Error("ACCESS_MEMBERSHIP_REVOKE_CONFLICT");
    }

    const removed = await db.workspaceMember.updateMany({
      where: {
        membershipId: membership.id,
        workspaceId: membership.workspaceId!,
        status: "active",
      },
      data: {
        status: "removed",
        removedAt: revokedAt,
      },
    });

    if (removed.count !== 1) {
      throw new Error("ACCESS_WORKSPACE_MEMBER_REVOKE_CONFLICT");
    }
  });

  redirect(
    `/access/admin?membershipRevoked=1&workspaceId=${encodeURIComponent(membership.workspaceId)}`,
  );
}
