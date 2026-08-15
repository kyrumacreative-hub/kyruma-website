import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { ProjectDocumentReferenceRepository } from "../../../ports/ProjectDocumentReferenceRepository";
import type { ProjectDocumentReference, ProjectDocumentReferenceScope } from "../../../ports/ProjectDocumentReferencePort";
import { ProjectDocumentReferenceMapper } from "../projectDocumentReferenceMapper";

export class PrismaProjectDocumentReferenceRepository implements ProjectDocumentReferenceRepository {
  constructor(
    private readonly contexts: PrismaTransactionContextStore,
    private readonly newId: () => string = randomUUID,
  ) {}

  async findByProject(scope: ProjectDocumentReferenceScope, context: TransactionContext): Promise<ProjectDocumentReference | null> {
    const record = await this.contexts.get(context).projectDocumentReference.findFirst({ where: scope });
    return record ? ProjectDocumentReferenceMapper.toDomain(fromRecord(record)) : null;
  }

  async beginSync(input: {
    readonly scope: ProjectDocumentReferenceScope;
    readonly idempotencyKey: string;
    readonly now: Date;
  }, context: TransactionContext): Promise<ProjectDocumentReference> {
    const record = await this.contexts.get(context).projectDocumentReference.upsert({
      where: { projectId: input.scope.projectId },
      create: {
        id: this.newId(),
        ...input.scope,
        provider: "google_drive",
        externalReference: null,
        externalUrl: null,
        idempotencyKey: input.idempotencyKey,
        status: "pending",
        lastError: null,
        attemptCount: 1,
        createdAt: input.now,
        updatedAt: input.now,
      },
      update: {
        status: "pending",
        lastError: null,
        attemptCount: { increment: 1 },
        updatedAt: input.now,
      },
    });
    return ProjectDocumentReferenceMapper.toDomain(fromRecord(record));
  }

  async completeSync(input: {
    readonly scope: ProjectDocumentReferenceScope;
    readonly idempotencyKey: string;
    readonly externalReference: string;
    readonly externalUrl: string;
    readonly now: Date;
  }, context: TransactionContext): Promise<ProjectDocumentReference> {
    const record = await this.contexts.get(context).projectDocumentReference.update({
      where: { projectId: input.scope.projectId },
      data: {
        status: "linked",
        externalReference: input.externalReference,
        externalUrl: input.externalUrl,
        idempotencyKey: input.idempotencyKey,
        lastError: null,
        updatedAt: input.now,
      },
    });
    return ProjectDocumentReferenceMapper.toDomain(fromRecord(record));
  }

  async failSync(input: {
    readonly scope: ProjectDocumentReferenceScope;
    readonly idempotencyKey: string;
    readonly error: string;
    readonly now: Date;
  }, context: TransactionContext): Promise<ProjectDocumentReference> {
    const record = await this.contexts.get(context).projectDocumentReference.update({
      where: { projectId: input.scope.projectId },
      data: {
        status: "failed",
        idempotencyKey: input.idempotencyKey,
        lastError: input.error.slice(0, 500),
        updatedAt: input.now,
      },
    });
    return ProjectDocumentReferenceMapper.toDomain(fromRecord(record));
  }

  async listByProject(scope: ProjectDocumentReferenceScope, context: TransactionContext): Promise<readonly ProjectDocumentReference[]> {
    const records = await this.contexts.get(context).projectDocumentReference.findMany({ where: scope, orderBy: { createdAt: "asc" } });
    return records.map((record) => ProjectDocumentReferenceMapper.toDomain(fromRecord(record)));
  }
}

function fromRecord(
  record: Prisma.ProjectDocumentReferenceGetPayload<Record<string, never>>,
): ReturnType<typeof ProjectDocumentReferenceMapper.toPersistence> {
  return record;
}
