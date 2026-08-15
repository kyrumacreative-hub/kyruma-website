import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedPartnerContext } from "../../partner-context/domain/types";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import type { ProjectDomainEvent } from "../domain/events";
import type { Project } from "../domain/project";
import { ProjectFactory } from "../domain/projectFactory";
import type { ProjectEventOutbox } from "../ports/ProjectEventOutbox";
import type { ProjectRepository } from "../ports/ProjectRepository";
import {
  ActivateProjectUseCase,
  CancelProjectUseCase,
  CompleteProjectUseCase,
  CreateProjectUseCase,
  OperationsHubApplicationError,
  PauseProjectUseCase,
} from "./useCases";

const context = (capabilities = ["project.create", "project.update"], workspaceId = "workspace-1", organizationId = "org-1"): ResolvedPartnerContext => ({
  contextKey: "context-1",
  actor: { user: { id: "user-1", externalSubjectId: "subject-1", email: "ops@kyruma.test" }, memberships: [] },
  membership: { id: "membership-1", userId: "user-1", role: "admin", status: "active", scope: { organizationId, partnerId: "partner-1", workspaceId } },
  organization: { id: organizationId, displayName: "KYRUMA" },
  partner: { id: "partner-1", publicId: "KYR-001", status: "active", displayName: "Partner" },
  workspace: { id: workspaceId, displayName: "KYR-001", access: "internal" },
  capabilities: new Set(capabilities as never[]),
  allowedVisibilities: ["internal"],
});

function clone(project: Project): Project {
  return ProjectFactory.rehydrate({
    id: project.id,
    organizationId: project.organizationId,
    partnerId: project.partnerId,
    workspaceId: project.workspaceId,
    name: project.name,
    createdAt: project.createdAt,
    createdBy: project.createdBy,
    correlationId: project.correlationId,
    status: project.status,
  });
}

function dependencies() {
  const projects = new Map<string, Project>();
  const outbox: ProjectDomainEvent[][] = [];
  let updateFailure: Error | undefined;
  const transactions: TransactionRunner = { run: <T>(operation: (context: TransactionContext) => Promise<T>) => operation({}) };
  const repository: ProjectRepository = {
    save: async (project) => { projects.set(project.id.value, clone(project)); },
    update: async (project, expectedStatus) => {
      const persisted = projects.get(project.id.value);
      if (updateFailure) throw updateFailure;
      if (!persisted || persisted.status !== expectedStatus) throw new Error("concurrency");
      projects.set(project.id.value, clone(project));
    },
    findById: async (projectId, organizationId) => {
      const project = projects.get(projectId);
      return project?.organizationId.value === organizationId ? clone(project) : null;
    },
    findByCorrelationId: async (correlationId) => {
      const project = [...projects.values()].find((candidate) => candidate.correlationId === correlationId);
      return project ? clone(project) : null;
    },
  };
  const eventOutbox: ProjectEventOutbox = { append: async (events) => { outbox.push([...events]); } };
  return {
    projects,
    outbox,
    failNextUpdate: (error: Error) => { updateFailure = error; },
    dependencies: { transactions, projects: repository, outbox: eventOutbox },
  };
}

const createInput = (overrides: Partial<Parameters<CreateProjectUseCase["execute"]>[0]> = {}) => ({
  context: context(), projectId: "project-1", name: "Identity renewal", eventId: "event-1", occurredAt: new Date("2026-08-14T10:00:00.000Z"), correlationId: "correlation-1", ...overrides,
});
const lifecycleInput = (overrides: Record<string, unknown> = {}) => ({
  context: context(), projectId: "project-1", eventId: "event-2", occurredAt: new Date("2026-08-14T10:01:00.000Z"), correlationId: "correlation-2", ...overrides,
});

test("creates an idempotent Project scoped to the resolved Workspace and outbox", async () => {
  const fake = dependencies(); const useCase = new CreateProjectUseCase(fake.dependencies);
  const first = await useCase.execute(createInput()); const repeated = await useCase.execute(createInput());
  assert.equal(first.id, "project-1"); assert.deepEqual(repeated, first); assert.equal(fake.projects.size, 1);
  assert.deepEqual(fake.outbox.map((events) => events.map((event) => event.type)), [["ProjectCreated"]]);
});

test("denies missing project capability before persistence", async () => {
  await assert.rejects(() => new CreateProjectUseCase(dependencies().dependencies).execute(createInput({ context: context([]) })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "FORBIDDEN");
});

test("does not disclose a repeated correlation outside the active Workspace", async () => {
  const fake = dependencies(); const useCase = new CreateProjectUseCase(fake.dependencies);
  await useCase.execute(createInput());
  await assert.rejects(() => useCase.execute(createInput({ context: context(["project.create"], "workspace-2") })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "NOT_FOUND");
});

test("activates a Project, persists the transition and records its business fact", async () => {
  const fake = dependencies(); await new CreateProjectUseCase(fake.dependencies).execute(createInput());
  const result = await new ActivateProjectUseCase(fake.dependencies).execute(lifecycleInput());
  assert.equal(result.status, "active");
  assert.equal(fake.projects.get("project-1")?.status, "active");
  assert.deepEqual(fake.outbox.at(-1)?.map((event) => event.type), ["ProjectActivated"]);
});

test("pauses, resumes through the existing activate transition, then completes", async () => {
  const fake = dependencies(); await new CreateProjectUseCase(fake.dependencies).execute(createInput());
  const activate = new ActivateProjectUseCase(fake.dependencies); await activate.execute(lifecycleInput());
  await new PauseProjectUseCase(fake.dependencies).execute(lifecycleInput({ eventId: "event-3" }));
  assert.equal(fake.projects.get("project-1")?.status, "on_hold");
  await activate.execute(lifecycleInput({ eventId: "event-4" }));
  const completed = await new CompleteProjectUseCase(fake.dependencies).execute(lifecycleInput({ eventId: "event-5" }));
  assert.equal(completed.status, "completed");
});

test("cancels an active Project through the approved lifecycle", async () => {
  const fake = dependencies(); await new CreateProjectUseCase(fake.dependencies).execute(createInput());
  await new ActivateProjectUseCase(fake.dependencies).execute(lifecycleInput());
  const result = await new CancelProjectUseCase(fake.dependencies).execute(lifecycleInput({ eventId: "event-3" }));
  assert.equal(result.status, "cancelled");
  assert.deepEqual(fake.outbox.at(-1)?.map((event) => event.type), ["ProjectCancelled"]);
});

test("rejects repeated or invalid transitions without recording another event", async () => {
  const fake = dependencies(); await new CreateProjectUseCase(fake.dependencies).execute(createInput());
  const activate = new ActivateProjectUseCase(fake.dependencies); await activate.execute(lifecycleInput());
  const outboxCount = fake.outbox.length;
  await assert.rejects(() => activate.execute(lifecycleInput({ eventId: "event-repeat" })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "CONFLICT");
  assert.equal(fake.outbox.length, outboxCount);
});

test("rejects unsupported pause, completion and cancellation transitions", async () => {
  const fake = dependencies(); await new CreateProjectUseCase(fake.dependencies).execute(createInput());
  const pause = new PauseProjectUseCase(fake.dependencies);
  const complete = new CompleteProjectUseCase(fake.dependencies);
  const cancel = new CancelProjectUseCase(fake.dependencies);
  await assert.rejects(() => pause.execute(lifecycleInput()), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "CONFLICT");
  await assert.rejects(() => complete.execute(lifecycleInput({ eventId: "event-complete" })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "CONFLICT");
  await new ActivateProjectUseCase(fake.dependencies).execute(lifecycleInput({ eventId: "event-activate" }));
  await complete.execute(lifecycleInput({ eventId: "event-complete-valid" }));
  await assert.rejects(() => cancel.execute(lifecycleInput({ eventId: "event-cancel" })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "CONFLICT");
});

test("denies a lifecycle change without project.update and hides a Workspace mismatch", async () => {
  const fake = dependencies(); await new CreateProjectUseCase(fake.dependencies).execute(createInput());
  const action = new ActivateProjectUseCase(fake.dependencies);
  await assert.rejects(() => action.execute(lifecycleInput({ context: context(["project.read"]) })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "FORBIDDEN");
  await assert.rejects(() => action.execute(lifecycleInput({ context: context(["project.update"], "workspace-2") })), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "NOT_FOUND");
});

test("does not append an event when the persistent update fails", async () => {
  const fake = dependencies(); await new CreateProjectUseCase(fake.dependencies).execute(createInput());
  const outboxCount = fake.outbox.length; fake.failNextUpdate(new Error("database unavailable"));
  await assert.rejects(() => new ActivateProjectUseCase(fake.dependencies).execute(lifecycleInput()), (error: unknown) => error instanceof OperationsHubApplicationError && error.code === "PERSISTENCE");
  assert.equal(fake.outbox.length, outboxCount);
  assert.equal(fake.projects.get("project-1")?.status, "planned");
});
