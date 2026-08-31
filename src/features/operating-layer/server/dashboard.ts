import "server-only";

import { requireCurrentActor } from "../../access/server/currentActor";
import { requireInternalAdmin } from "../../access/server/internalAdmin";
import { prisma } from "../../../lib/prisma";

export interface OperatingDashboard {
  readonly funnel: Readonly<Record<string, number>>;
  readonly taskCounts: Readonly<Record<string, number>>;
  readonly automationCounts: Readonly<Record<string, number>>;
  readonly intelligenceCounts: Readonly<Record<string, number>>;
  readonly leads: readonly {
    id: string; company: string; contactName: string; email: string; status: string; createdAt: string; discoveryCompletedAt?: string;
  }[];
  readonly openTasks: readonly { id: string; title: string; taskType: string; leadId?: string; dueAt?: string }[];
  readonly clients: readonly {
    code: string; present: boolean; status?: string; partnerId?: string; workspaceId?: string;
    workspaceName?: string; projectCount: number; activeProjectCount: number;
  }[];
  readonly eventBus: {
    outbox: Readonly<Record<string, number>>;
    deliveries: Readonly<Record<string, number>>;
    retryAttempts: number;
    recentRuns: readonly { id: string; name: string; status: string; attemptCount: number; startedAt: string; completedAt?: string }[];
  };
}

function counts(rows: readonly { status: string; _count: { _all: number } }[]): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row.status, row._count._all]));
}

const operationalClientCodes = ["KYR-001", "KYR-002", "KYR-003"] as const;

export async function getOperatingDashboard(): Promise<OperatingDashboard> {
  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);
  const [leadGroups, taskGroups, automationGroups, intelligenceGroups, leads, openTasks, partners, outboxGroups, deliveryGroups, retryAttempts, recentRuns] = await Promise.all([
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.operationalTask.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.automationRun.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.intelligenceAnalysis.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { intake: true } }),
    prisma.operationalTask.findMany({ where: { status: "open" }, orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }], take: 50 }),
    prisma.partner.findMany({ where: { code: { in: [...operationalClientCodes] } }, orderBy: { code: "asc" } }),
    prisma.eventOutbox.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.eventProcessingRecord.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.eventProcessingRecord.aggregate({ _sum: { reprocessCount: true } }),
    prisma.automationRun.findMany({
      orderBy: { startedAt: "desc" }, take: 10,
      include: { automation: { select: { name: true } } },
    }),
  ]);

  const clientRows = await Promise.all(operationalClientCodes.map(async (code) => {
    const partner = partners.find((candidate) => candidate.code === code);
    if (!partner) return { code, present: false, projectCount: 0, activeProjectCount: 0 };
    const [workspace, projectCounts] = await Promise.all([
      prisma.workspace.findUnique({ where: { id: partner.primaryWorkspaceId }, select: { name: true } }),
      prisma.project.groupBy({ by: ["status"], where: { workspaceId: partner.primaryWorkspaceId }, _count: { _all: true } }),
    ]);
    return {
      code, present: true, status: partner.status, partnerId: partner.id,
      workspaceId: partner.primaryWorkspaceId, workspaceName: workspace?.name,
      projectCount: projectCounts.reduce((sum, row) => sum + row._count._all, 0),
      activeProjectCount: projectCounts.find((row) => row.status === "active")?._count._all ?? 0,
    };
  }));

  return {
    funnel: counts(leadGroups),
    taskCounts: counts(taskGroups),
    automationCounts: counts(automationGroups),
    intelligenceCounts: counts(intelligenceGroups),
    leads: leads.map((lead) => ({
      id: lead.id,
      company: lead.intake?.company ?? "Lead importado",
      contactName: lead.intake?.contactName ?? "—",
      email: lead.intake?.normalizedEmail ?? lead.primaryContactId.replace(/^email:/, ""),
      status: lead.status,
      createdAt: lead.createdAt.toISOString(),
      ...(lead.intake?.discoveryCompletedAt ? { discoveryCompletedAt: lead.intake.discoveryCompletedAt.toISOString() } : {}),
    })),
    openTasks: openTasks.map((task) => ({
      id: task.id, title: task.title, taskType: task.taskType,
      ...(task.leadId ? { leadId: task.leadId } : {}), ...(task.dueAt ? { dueAt: task.dueAt.toISOString() } : {}),
    })),
    clients: clientRows,
    eventBus: {
      outbox: counts(outboxGroups), deliveries: counts(deliveryGroups),
      retryAttempts: retryAttempts._sum.reprocessCount ?? 0,
      recentRuns: recentRuns.map((run) => ({
        id: run.id, name: run.automation.name, status: run.status, attemptCount: run.attemptCount,
        startedAt: run.startedAt.toISOString(), ...(run.completedAt ? { completedAt: run.completedAt.toISOString() } : {}),
      })),
    },
  };
}
