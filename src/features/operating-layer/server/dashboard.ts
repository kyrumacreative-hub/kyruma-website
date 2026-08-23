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
  readonly kyr001: { present: boolean; partnerId?: string; workspaceId?: string; workspaceName?: string; projectCount: number; activeProjectCount: number };
}

function counts(rows: readonly { status: string; _count: { _all: number } }[]): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row.status, row._count._all]));
}

export async function getOperatingDashboard(): Promise<OperatingDashboard> {
  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);
  const [leadGroups, taskGroups, automationGroups, intelligenceGroups, leads, openTasks, kyr001] = await Promise.all([
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.operationalTask.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.automationRun.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.intelligenceAnalysis.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { intake: true } }),
    prisma.operationalTask.findMany({ where: { status: "open" }, orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }], take: 50 }),
    prisma.partner.findUnique({ where: { code: "KYR-001" }, include: { workspaces: true } }),
  ]);

  const workspaceId = kyr001?.primaryWorkspaceId;
  const [workspace, projectCounts] = workspaceId
    ? await Promise.all([
      prisma.workspace.findUnique({ where: { id: workspaceId }, select: { name: true } }),
      prisma.project.groupBy({ by: ["status"], where: { workspaceId }, _count: { _all: true } }),
    ])
    : [null, []] as const;
  const projectCount = projectCounts.reduce((sum, row) => sum + row._count._all, 0);
  const activeProjectCount = projectCounts.find((row) => row.status === "active")?._count._all ?? 0;

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
    kyr001: kyr001 ? {
      present: true, partnerId: kyr001.id, workspaceId, workspaceName: workspace?.name,
      projectCount, activeProjectCount,
    } : { present: false, projectCount: 0, activeProjectCount: 0 },
  };
}

