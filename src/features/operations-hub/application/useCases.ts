import { requireContextAccess } from "../../partner-context/application/requireContextAccess";
import type { ResolvedPartnerContext } from "../../partner-context/domain/types";
import type { TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { projectEvent } from "../domain/events";
import { ProjectFactory } from "../domain/projectFactory";
import {
  OperationsOrganizationId,
  OperationsPartnerId,
  OperationsWorkspaceId,
  ProjectId,
  ProjectName,
} from "../domain/valueObjects";
import type { ProjectRepository } from "../ports/ProjectRepository";
import type { ProjectDomainEventDispatcher } from "../ports/ProjectDomainEventDispatcher";

export class OperationsHubApplicationError extends Error {
  constructor(message: string, readonly code: "FORBIDDEN" | "CONFLICT" | "PERSISTENCE") {
    super(message);
  }
}

type Dependencies = {
  transactions: TransactionRunner;
  projects: ProjectRepository;
  events: ProjectDomainEventDispatcher;
};

export interface CreateProjectInput {
  context: ResolvedPartnerContext;
  projectId: string;
  name: string;
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

function requireProjectAccess(context: ResolvedPartnerContext, capability: "project.create" | "project.read") {
  try { requireContextAccess(context, capability); }
  catch { throw new OperationsHubApplicationError("Access denied.", "FORBIDDEN"); }
}

export class CreateProjectUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(input: CreateProjectInput): Promise<ProjectSummary> {
    requireProjectAccess(input.context, "project.create");
    try {
      const result = await this.deps.transactions.run(async (transaction) => {
        const existing = await this.deps.projects.findByCorrelationId(input.correlationId, transaction);
        if (existing) {
          if (existing.workspaceId.value !== input.context.workspace.id) {
            throw new OperationsHubApplicationError("Project not found.", "FORBIDDEN");
          }
          return { project: existing, created: false };
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
        return { project: created, created: true };
      });
      if (result.created) await this.deps.events.dispatch(result.project.pullDomainEvents());
      return {
        id: result.project.id.value,
        name: result.project.name.value,
        status: result.project.status,
        workspaceId: result.project.workspaceId.value,
      };
    } catch (error) {
      if (error instanceof OperationsHubApplicationError) throw error;
      throw new OperationsHubApplicationError("Operations Hub persistence is unavailable.", "PERSISTENCE");
    }
  }
}
