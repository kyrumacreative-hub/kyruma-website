import "server-only";

import { prisma } from "@/lib/prisma";
import { hookBlocks } from "../domain/policy";
import { requireInternalOperatingContext } from "./authorization";

export async function getOperatingIntelligenceDashboard() {
  const { organizationId } = await requireInternalOperatingContext();
  const now = new Date();

  const [radar, brain, hookGroups, workflows, opportunities, recipes, frictions, aiRequests, workspaces, projects] = await Promise.all([
    prisma.radarEntry.findMany({
      orderBy: [{ priority: "desc" }, { observedAt: "desc" }],
      take: 50,
      include: { history: { orderBy: { changedAt: "desc" }, take: 5 } },
    }),
    prisma.brainRecord.findMany({ where: { status: "active" }, orderBy: { updatedAt: "desc" }, take: 30 }),
    prisma.contentHook.groupBy({
      by: ["block"],
      where: { active: true },
      _count: { _all: true },
    }),
    prisma.contentWorkflowDefinition.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
      select: { id: true, key: true, name: true, description: true, humanReviewRequired: true, version: true },
    }),
    prisma.contentOpportunity.findMany({
      where: { startsAt: { gte: new Date(now.getTime() - 7 * 86_400_000) }, status: { in: ["observed", "planned", "active"] } },
      orderBy: { startsAt: "asc" },
      take: 30,
    }),
    prisma.visualRecipe.findMany({ orderBy: { name: "asc" }, select: { id: true, key: true, name: true, category: true, version: true, status: true, masterPrompt: true, updatedAt: true } }),
    prisma.operationalFriction.findMany({ orderBy: [{ priority: "desc" }, { updatedAt: "desc" }], take: 30 }),
    prisma.aiWorkRequest.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.workspace.findMany({ where: { status: "active" }, orderBy: { name: "asc" }, select: { id: true, organizationId: true, partnerId: true, name: true } }),
    prisma.project.findMany({ where: { status: "active" }, orderBy: { name: "asc" }, select: { id: true, organizationId: true, partnerId: true, workspaceId: true, name: true } }),
  ]);

  const hooksByBlock = Object.fromEntries(hookBlocks.map((block) => [block, hookGroups.find((row) => row.block === block)?._count._all ?? 0]));
  const hookTotal = Object.values(hooksByBlock).reduce((total, count) => total + count, 0);

  return {
    organizationId,
    radar: radar.map((entry) => ({
      ...entry,
      observedAt: entry.observedAt.toISOString(), createdAt: entry.createdAt.toISOString(), updatedAt: entry.updatedAt.toISOString(),
      history: entry.history.map((item) => ({ ...item, changedAt: item.changedAt.toISOString() })),
    })),
    brain: brain.map((record) => ({ ...record, createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString() })),
    hooks: { total: hookTotal, target: 44, byBlock: hooksByBlock },
    workflows,
    opportunities: opportunities.map((item) => ({ ...item, startsAt: item.startsAt.toISOString(), endsAt: item.endsAt?.toISOString(), createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })),
    recipes: recipes.map(({ masterPrompt, ...recipe }) => ({ ...recipe, promptReady: Boolean(masterPrompt), updatedAt: recipe.updatedAt.toISOString() })),
    frictions: frictions.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })),
    aiRequests: aiRequests.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), reviewedAt: item.reviewedAt?.toISOString() })),
    workspaces: workspaces.map((workspace) => ({ ...workspace, projects: projects.filter((project) => project.workspaceId === workspace.id) })),
  };
}
