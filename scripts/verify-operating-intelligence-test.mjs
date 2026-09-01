import assert from "node:assert/strict";
import { assertSafeTestDatabase, loadLocalEnvironment } from "./database-safety.mjs";

const environment = loadLocalEnvironment();
const safeTarget = assertSafeTestDatabase(environment);
process.env.DATABASE_URL = environment.TEST_DATABASE_URL;

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const [radar, radarHistory, experiencesBrain, workflows, recipes, hooks, opportunities, frictions, aiRequests, clients] = await Promise.all([
    prisma.radarEntry.findMany({
      where: { organizationId: "kyruma-global", radarId: { in: ["020", "021", "022", "023"] } },
      orderBy: { radarId: "asc" },
    }),
    prisma.radarHistory.count({
      where: {
        organizationId: "kyruma-global",
        entry: { radarId: { in: ["020", "021", "022", "023"] } },
      },
    }),
    prisma.brainRecord.findUnique({ where: { id: "brain-global-kyruma-experiences-strategy-v1" } }),
    prisma.contentWorkflowDefinition.findMany({ where: { organizationId: "kyruma-global", status: "active" } }),
    prisma.visualRecipe.findMany({ orderBy: { key: "asc" } }),
    prisma.contentHook.count(),
    prisma.contentOpportunity.count(),
    prisma.operationalFriction.count(),
    prisma.aiWorkRequest.count(),
    prisma.partner.findMany({
      where: { code: { in: ["KYR-002", "KYR-003"] } },
      select: {
        code: true,
        organizationId: true,
        id: true,
        primaryWorkspaceId: true,
      },
      orderBy: { code: "asc" },
    }),
  ]);

  assert.deepEqual(radar.map((entry) => entry.radarId), ["020", "021", "022", "023"]);
  assert.equal(radarHistory, 4);
  assert.equal(experiencesBrain?.organizationId, "kyruma-global");
  assert.equal(experiencesBrain?.scopeType, "GLOBAL");
  assert.equal(experiencesBrain?.dnaType, "STRATEGY");
  assert.equal(workflows.length, 7);
  assert.ok(workflows.every((workflow) => workflow.humanReviewRequired));
  assert.equal(recipes.length, 6);
  assert.ok(recipes.every((recipe) => recipe.masterPrompt === null && recipe.status === "draft"));
  assert.deepEqual(clients.map(({ code }) => code), ["KYR-002", "KYR-003"]);
  assert.notEqual(clients[0].organizationId, clients[1].organizationId);
  assert.notEqual(clients[0].primaryWorkspaceId, clients[1].primaryWorkspaceId);

  const clientProjects = await Promise.all(clients.map((client) => prisma.project.findFirst({
    where: {
      organizationId: client.organizationId,
      partnerId: client.id,
      workspaceId: client.primaryWorkspaceId,
      status: "active",
    },
    select: { id: true },
  })));
  assert.ok(clientProjects.every(Boolean));

  const crossClientProject = await prisma.project.findFirst({
    where: {
      id: clientProjects[0].id,
      organizationId: clients[1].organizationId,
      workspaceId: clients[1].primaryWorkspaceId,
    },
  });
  assert.equal(crossClientProject, null);

  console.log(JSON.stringify({
    database: safeTarget.database,
    radar: radar.map(({ radarId, title, status }) => ({ radarId, title, status })),
    radarHistory,
    experiencesBrain: experiencesBrain ? { title: experiencesBrain.title, scopeType: experiencesBrain.scopeType, dnaType: experiencesBrain.dnaType } : null,
    workflows: workflows.map(({ key }) => key).sort(),
    visualRecipes: recipes.map(({ key, status }) => ({ key, status })),
    emptyStates: { hooks, opportunities, frictions, aiRequests },
    clientIsolation: clients.map(({ code, organizationId, primaryWorkspaceId }, index) => ({
      code,
      organizationId,
      workspaceId: primaryWorkspaceId,
      projectId: clientProjects[index].id,
    })),
    crossClientProjectVisible: false,
    humanReviewRequired: true,
    productionTouched: false,
  }, null, 2));
} finally {
  await prisma.$disconnect();
}
