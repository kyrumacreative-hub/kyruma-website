import type { Prisma } from "@prisma/client";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { Project } from "../../../domain/project";
import type { ProjectRepository } from "../../../ports/ProjectRepository";
import { ProjectMapper } from "../projectMapper";

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(project: Project, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).project.create({ data: toRecord(ProjectMapper.toPersistence(project)) });
  }

  async findById(projectId: string, organizationId: string, context: TransactionContext): Promise<Project | null> {
    const record = await this.contexts.get(context).project.findFirst({ where: { id: projectId, organizationId } });
    return record ? ProjectMapper.toDomain(fromRecord(record)) : null;
  }

  async findByCorrelationId(correlationId: string, context: TransactionContext): Promise<Project | null> {
    const record = await this.contexts.get(context).project.findUnique({ where: { correlationId } });
    return record ? ProjectMapper.toDomain(fromRecord(record)) : null;
  }
}

function toRecord(model: ReturnType<typeof ProjectMapper.toPersistence>): Prisma.ProjectUncheckedCreateInput {
  return model;
}

function fromRecord(record: Prisma.ProjectGetPayload<Record<string, never>>): ReturnType<typeof ProjectMapper.toPersistence> {
  return record;
}
