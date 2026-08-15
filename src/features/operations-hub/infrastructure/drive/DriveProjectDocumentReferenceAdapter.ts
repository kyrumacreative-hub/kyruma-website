import type { TransactionRunner } from "../../../lead-lifecycle/ports/TransactionRunner";
import { DriveReferenceConfigurationError, DriveReferenceSyncError } from "../../domain/errors";
import type { DriveFolderGateway } from "../../ports/DriveFolderGateway";
import type { ProjectDocumentReferenceRepository } from "../../ports/ProjectDocumentReferenceRepository";
import type {
  EnsureProjectDocumentReferenceInput,
  ProjectDocumentReference,
  ProjectDocumentReferencePort,
  ProjectDocumentReferenceScope,
} from "../../ports/ProjectDocumentReferencePort";

const now = () => new Date();

/**
 * Persists one canonical external reference per Project. Provider calls happen
 * outside database transactions; a provider failure can only update the sync
 * record and can never mutate the Project aggregate.
 */
export class DriveProjectDocumentReferenceAdapter implements ProjectDocumentReferencePort {
  constructor(
    private readonly transactions: TransactionRunner,
    private readonly references: ProjectDocumentReferenceRepository,
    private readonly drive: DriveFolderGateway,
    private readonly clock: () => Date = now,
  ) {}

  async ensureCanonicalReference(input: EnsureProjectDocumentReferenceInput): Promise<ProjectDocumentReference> {
    const scope = projectScope(input);
    const current = await this.transactions.run((transaction) => this.references.findByProject(scope, transaction));
    if (current?.status === "linked") return current;

    await this.transactions.run((transaction) => this.references.beginSync({
      scope,
      idempotencyKey: input.idempotencyKey,
      now: this.clock(),
    }, transaction));

    try {
      const folder = await this.drive.ensureProjectFolder(input);
      return await this.transactions.run((transaction) => this.references.completeSync({
        scope,
        idempotencyKey: input.idempotencyKey,
        externalReference: folder.folderId,
        externalUrl: folder.folderUrl,
        now: this.clock(),
      }, transaction));
    } catch (error) {
      await this.transactions.run((transaction) => this.references.failSync({
        scope,
        idempotencyKey: input.idempotencyKey,
        error: error instanceof Error ? error.message : "Drive sync failed.",
        now: this.clock(),
      }, transaction));
      if (error instanceof DriveReferenceSyncError || error instanceof DriveReferenceConfigurationError) throw error;
      throw new DriveReferenceSyncError();
    }
  }

  listByProject(scope: ProjectDocumentReferenceScope): Promise<readonly ProjectDocumentReference[]> {
    return this.transactions.run((transaction) => this.references.listByProject(scope, transaction));
  }
}

/** A fail-closed adapter used when Drive credentials have not been configured. */
export class UnconfiguredDriveFolderGateway implements DriveFolderGateway {
  async ensureProjectFolder(): Promise<{ readonly folderId: string; readonly folderUrl: string }> {
    throw new DriveReferenceConfigurationError();
  }
}

function projectScope(input: EnsureProjectDocumentReferenceInput): ProjectDocumentReferenceScope {
  return {
    projectId: input.projectId,
    organizationId: input.organizationId,
    partnerId: input.partnerId,
    workspaceId: input.workspaceId,
  };
}
