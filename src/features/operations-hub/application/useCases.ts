import { requireContextAccess } from "../../partner-context/application/requireContextAccess";
import type { ResolvedPartnerContext } from "../../partner-context/domain/types";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { InvalidProjectStateError, ProjectConcurrencyError } from "../domain/errors";
import { projectEvent, type ProjectEventType } from "../domain/events";
import type { Project } from "../domain/project";
import { ProjectFactory } from "../domain/projectFactory";
import {
  OperationsOrganizationId,
  OperationsPartnerId,
  OperationsWorkspaceId,
  ProjectId,
  ProjectName,
  type ProjectStatusValue,
} from "../domain/valueObjects";
import type { ProjectEventOutbox } from "../ports/ProjectEventOutbox";
import type { ProjectRepository } from "../ports/ProjectRepository";

export class OperationsHubApplicationError extends Error {
  constructor(message: string, readonly code: "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "PERSISTENCE") {
    super(message);
  }
}

type Dependencies = {
  transactions: TransactionRunner;
  projects: ProjectRepository;
  outbox: ProjectEventOutbox;
};

export interface CreateProjectInput {
  context: ResolvedPartnerContext;
  projectId: string;
  name: string;
  eventId: string;
  occurredAt: Date;
  correlationId: string;
}

export interface ProjectLifecycleInput {
  context: ResolvedPartnerContext;
  projectId: string;
  eventId: string;
  occurredAt: Date;
  correlationId: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  workspaceId: string;
}

type LifecycleDefinition = Readonly<{
  capability: "project.update";
  eventType: Exclude<ProjectEventType, "ProjectCreated">;
  transition: (project: Project) => void;
}>;

function requireProjectAccess(
  context: ResolvedPartnerContext,
  capability: "project.create" | "project.update",
): void {
  try {
    requireContextAccess(context, capability);
  } catch {
    throw new OperationsHubApplicationError("Access denied.", "FORBIDDEN");
  }
}

function summary(project: Project): ProjectSummary {
  return {
    id: project.id.value,
    name: project.name.value,
    status: project.status,
    workspaceId: project.workspaceId.value,
  };
}

function mapError(error: unknown): never {
  if (error instanceof OperationsHubApplicationError) throw error;
  if (error instanceof InvalidProjectStateError || error instanceof ProjectConcurrencyError) {
    throw new OperationsHubApplicationError(error.message, "CONFLICT");
  }
  throw new OperationsHubApplicationError("Operations Hub persistence is unavailable.", "PERSISTENCE");
}

async function loadProjectInContext(
  projects: ProjectRepository,
  input: ProjectLifecycleInput,
  transaction: TransactionContext,
): Promise<Project> {
  const project = await projects.findById(input.projectId, input.context.organization.id, transaction);
  if (!project || project.workspaceId.value !== input.context.workspace.id) {
    // This neutral response does not disclose a Project outside the active scope.
    throw new OperationsHubApplicationError("Project not found.", "NOT_FOUND");
  }
  return project;
}

export class CreateProjectUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(input: CreateProjectInput): Promise<ProjectSummary> {
    requireProjectAccess(input.context, "project.create");
    try {
      const project = await this.deps.transactions.run(async (transaction) => {
        const existing = await this.deps.projects.findByCorrelationId(input.correlationId, transaction);
        if (existing) {
          if (existing.workspaceId.value !== input.context.workspace.id) {
            throw new OperationsHubApplicationError("Project not found.", "NOT_FOUND");
          }
          return existing;
        }
        const created = ProjectFactory.create({
          id: ProjectId.create(input.projectId),
          organizationId: OperationsOrganizationId.create(input.context.organization.id),
          partnerId: OperationsPartnerId.create(input.context.partner.id),
          workspaceId: OperationsWorkspaceId.create(input.context.workspace.id),
          name: ProjectName.create(input.name),
          createdAt: input.occurredAt,
          createdBy: input.context.actor.user.id,
          correlationId: input.correlationId,
        });
        created.recordEvent(projectEvent("ProjectCreated", created, {
          eventId: input.eventId,
          occurredAt: input.occurredAt,
          correlationId: input.correlationId,
          actorId: input.context.actor.user.id,
        }));
        await this.deps.projects.save(created, transaction);
        await this.deps.outbox.append(created.pullDomainEvents(), transaction);
        return created;
      });
      return summary(project);
    } catch (error) {
      return mapError(error);
    }
  }
}

abstract class ProjectLifecycleUseCase {
  protected constructor(private readonly deps: Dependencies, private readonly definition: LifecycleDefinition) {}

  async execute(input: ProjectLifecycleInput): Promise<ProjectSummary> {
    requireProjectAccess(input.context, this.definition.capability);
    try {
      const project = await this.deps.transactions.run(async (transaction) => {
        const existing = await loadProjectInContext(this.deps.projects, input, transaction);
        const expectedStatus: ProjectStatusValue = existing.status;
        this.definition.transition(existing);
        existing.recordEvent(projectEvent(this.definition.eventType, existing, {
          eventId: input.eventId,
          occurredAt: input.occurredAt,
          correlationId: input.correlationId,
          actorId: input.context.actor.user.id,
        }));
        await this.deps.projects.update(existing, expectedStatus, transaction);
        await this.deps.outbox.append(existing.pullDomainEvents(), transaction);
        return existing;
      });
      return summary(project);
    } catch (error) {
      return mapError(error);
    }
  }
}

export class ActivateProjectUseCase extends ProjectLifecycleUseCase {
  constructor(deps: Dependencies) {
    super(deps, { capability: "project.update", eventType: "ProjectActivated", transition: (project) => project.activate() });
  }
}

export class PauseProjectUseCase extends ProjectLifecycleUseCase {
  constructor(deps: Dependencies) {
    super(deps, { capability: "project.update", eventType: "ProjectPaused", transition: (project) => project.pause() });
  }
}

export class CompleteProjectUseCase extends ProjectLifecycleUseCase {
  constructor(deps: Dependencies) {
    super(deps, { capability: "project.update", eventType: "ProjectCompleted", transition: (project) => project.complete() });
  }
}

export class CancelProjectUseCase extends ProjectLifecycleUseCase {
  constructor(deps: Dependencies) {
    super(deps, { capability: "project.update", eventType: "ProjectCancelled", transition: (project) => project.cancel() });
  }
}
