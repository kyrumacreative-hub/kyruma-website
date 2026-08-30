import { assertSafeTestDatabase, loadLocalEnvironment } from "./database-safety.mjs";

const environment = loadLocalEnvironment();
const safeTarget = assertSafeTestDatabase(environment);
process.env.DATABASE_URL = environment.TEST_DATABASE_URL;

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const ids = Object.freeze({
  lead: "kyr002-lead-active-client",
  intake: "kyr002-safe-operational-intake",
  ownership: "kyr002-owner-assignment",
  qualification: "kyr002-real-client-qualification",
  partner: "kyr002-partner",
  workspace: "kyr002-workspace",
  membership: "kyr002-owner-membership",
  workspaceMember: "kyr002-workspace-owner",
  project: "kyr002-magic-by-whyso-main-project",
  task: "kyr002-project-active-next-step",
  audit: "kyr002-client-activation-audit",
});

const now = new Date();
const organizationId = "kyr002-organization";
const ownerId = "system:kyruma-operations";
const correlationId = "kyr002:active-client:v1";

try {
  const result = await prisma.$transaction(async (db) => {
    const codeOwner = await db.partner.findUnique({ where: { code: "KYR-002" } });
    if (codeOwner && codeOwner.id !== ids.partner) {
      throw new Error("KYR002_CODE_ALREADY_ASSIGNED_TO_ANOTHER_PARTNER");
    }

    await db.lead.upsert({
      where: { id: ids.lead },
      update: { status: "partner_created" },
      create: {
        id: ids.lead, organizationId, ownerId,
        primaryContactId: "client-reference:KYR-002",
        origin: "confirmed_real_client_safe_seed", status: "partner_created",
        createdAt: now, createdBy: ownerId,
      },
    });
    await db.ownership.upsert({
      where: { id: ids.ownership }, update: { active: true },
      create: { id: ids.ownership, leadId: ids.lead, ownerId, assignedBy: ownerId, assignedAt: now, reason: "Cliente real confirmado; referencia operativa sin PII", active: true },
    });
    await db.leadIntake.upsert({
      where: { id: ids.intake },
      update: { discoveryCompletedAt: now, updatedAt: now },
      create: {
        id: ids.intake, leadId: ids.lead, organizationId,
        normalizedEmail: "kyr-002@operations.kyruma.test", contactName: "Referencia operativa KYR-002",
        company: "Magic By Whyso", serviceInterest: "Identidad, dirección creativa y experiencia web",
        collaboration: "Cliente real activo", source: "confirmed_real_client_safe_seed",
        createdAt: now, updatedAt: now, discoveryStartedAt: now, discoveryCompletedAt: now,
      },
    });
    await db.qualification.upsert({
      where: { id: ids.qualification }, update: { decision: "qualified" },
      create: { id: ids.qualification, leadId: ids.lead, decision: "qualified", reason: "Cliente real confirmado por Operations; Discovery disponible", decidedBy: ownerId, decidedAt: now },
    });
    await db.partner.upsert({
      where: { id: ids.partner },
      update: { status: "active" },
      create: {
        id: ids.partner, code: "KYR-002", leadId: ids.lead, organizationId,
        primaryWorkspaceId: ids.workspace, initialOwnerMembershipId: ids.membership,
        status: "active", correlationId, createdAt: now,
      },
    });
    await db.partnerWorkspace.upsert({
      where: { id: ids.workspace }, update: { primary: true },
      create: { id: ids.workspace, partnerId: ids.partner, primary: true },
    });
    await db.partnerMembership.upsert({
      where: { id: ids.membership }, update: { status: "active" },
      create: { id: ids.membership, partnerId: ids.partner, role: "owner", status: "active" },
    });
    await db.workspace.upsert({
      where: { id: ids.workspace }, update: { name: "Magic By Whyso", status: "active" },
      create: {
        id: ids.workspace, partnerId: ids.partner, organizationId, name: "Magic By Whyso",
        primary: true, status: "active", initialOwnerMemberId: ids.workspaceMember,
        initialOwnerMembershipId: ids.membership, settingsVersion: 1, createdAt: now,
        correlationId: `${correlationId}:workspace`,
      },
    });
    await db.workspaceSettings.upsert({
      where: { workspaceId: ids.workspace }, update: {},
      create: { workspaceId: ids.workspace, version: 1, values: { locale: "es", clientCode: "KYR-002", publicCaseSlug: "magic-by-whyso", publicUrl: "https://magicbywhyso.kyruma.com" } },
    });
    await db.workspaceMember.upsert({
      where: { id: ids.workspaceMember }, update: { status: "active" },
      create: { id: ids.workspaceMember, workspaceId: ids.workspace, membershipId: ids.membership, owner: true, status: "active", joinedAt: now },
    });
    await db.project.upsert({
      where: { id: ids.project }, update: { name: "Magic By Whyso — Brand & Web", status: "active" },
      create: { id: ids.project, organizationId, partnerId: ids.partner, workspaceId: ids.workspace, name: "Magic By Whyso — Brand & Web", status: "active", createdAt: now, createdBy: ownerId, correlationId: `${correlationId}:project` },
    });
    await db.operationalTask.upsert({
      where: { organizationId_sourceEventId_taskType: { organizationId, sourceEventId: correlationId, taskType: "project.delivery.next_step" } },
      update: { partnerId: ids.partner, workspaceId: ids.workspace },
      create: { id: ids.task, organizationId, sourceEventId: correlationId, taskType: "project.delivery.next_step", title: "Mantener actualizado el estado de diseño y web de Magic By Whyso", status: "open", leadId: ids.lead, partnerId: ids.partner, workspaceId: ids.workspace, createdAt: now },
    });
    await db.auditEvent.upsert({
      where: { id: ids.audit }, update: {},
      create: {
        id: ids.audit, eventType: "client.activated.v1", occurredAt: now, actorId: ownerId, actorType: "system",
        organizationId, partnerId: ids.partner, workspaceId: ids.workspace, resourceType: "Partner", resourceId: ids.partner,
        action: "activate_real_client", result: "success", correlationId, source: "kyruma-operations",
        metadata: { clientCode: "KYR-002", containsPii: false, environment: "test" }, changes: { status: { to: "active" }, project: { to: ids.project } },
        schemaVersion: 1, classification: "internal", retentionCategory: "operational_activity", policyVersion: "audit-v1",
      },
    });

    return db.partner.findUniqueOrThrow({
      where: { code: "KYR-002" },
      include: { workspaces: true, memberships: true },
    });
  });

  const project = await prisma.project.findUnique({ where: { id: ids.project } });
  console.log(JSON.stringify({
    database: safeTarget.database, clientCode: result.code, partnerStatus: result.status,
    workspaceId: result.primaryWorkspaceId, project: project?.name, projectStatus: project?.status,
    lifecycle: ["Lead", "Discovery", "Qualification", "Partner", "Workspace", "Project"],
    piiPersisted: false,
  }, null, 2));
} finally {
  await prisma.$disconnect();
}
