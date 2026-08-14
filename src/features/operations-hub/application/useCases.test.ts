import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedPartnerContext } from "../../partner-context/domain/types";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import type { Project } from "../domain/project";
import type { ProjectDomainEvent } from "../domain/events";
import type { ProjectRepository } from "../ports/ProjectRepository";
import { CreateProjectUseCase, OperationsHubApplicationError } from "./useCases";

const context = (capabilities = ["project.create"], workspaceId = "workspace-1"): ResolvedPartnerContext => ({
  contextKey: "context-1",
  actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "ops@kyruma.test" }, memberships: [] },
  membership: { id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId: "org-1", partnerId: "partner-1", workspaceId } },
  organization: { id: "org-1", displayName: "KYRUMA" },
  partner: { id: "partner-1", publicId: "KYR-001", status: "active", displayName: "Partner" },
  workspace: { id: workspaceId, displayName: "KYR-001", access: "internal" },
  capabilities: new Set(capabilities as never[]),
  allowedVisibilities: ["internal"],
});

function dependencies() {
  const projects = new Map<string, Project>();
  const dispatched: string[][] = [];
  const transactions: TransactionRunner = { run: <T>(operation: (context: TransactionContext) => Promise<T>) => operation({}) };
  const repository: ProjectRepository = {
    save: async (project) => { projects.set(project.correlationId, project); },
    findById: async () => null,
    findByCorrelationId: async (correlationId) => projects.get(correlationId) ?? null,
  };
  return {
    projects,
    dispatched,
    dependencies: {
      transactions,
      projects: repository,
      events: {
        dispatch: async (events: readonly ProjectDomainEvent[]) => {
          dispatched.push(events.map((event) => event.type));
        },
      },
    },
  };
}

const input = (overrides: Partial<Parameters<CreateProjectUseCase["execute"]>[0]> = {}) => ({ context: context(), projectId: "project-1", name: "Identity renewal", eventId: "event-1", occurredAt: new Date(), correlationId: "correlation-1", ...overrides });

test("creates an idempotent Project scoped to the resolved Workspace", async () => {
  const fake = dependencies(); const useCase = new CreateProjectUseCase(fake.dependencies);
  const first = await useCase.execute(input()); const repeated = await useCase.execute(input());
  assert.equal(first.id, "project-1"); assert.deepEqual(repeated, first); assert.equal(fake.projects.size, 1);
  assert.deepEqual(fake.dispatched, [["ProjectCreated"]]);
});

test("denies missing project capability before persistence", async () => {
  await assert.rejects(() => new CreateProjectUseCase(dependencies().dependencies).execute(input({ context: context([]) })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "FORBIDDEN");
});

test("denies a repeated correlation from another Workspace", async () => {
  const fake = dependencies(); const useCase = new CreateProjectUseCase(fake.dependencies);
  await useCase.execute(input());
  await assert.rejects(() => useCase.execute(input({ context: context(["project.create"], "workspace-2") })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "FORBIDDEN");
});
