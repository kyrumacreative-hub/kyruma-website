import { requireContextAccess } from "../../partner-context/application/requireContextAccess";
import type { ResolvedPartnerContext } from "../../partner-context/domain/types";
import type { TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { DriveReferenceConfigurationError, DriveReferenceSyncError } from "../domain/errors";
import type { ProjectDocumentReferencePort } from "../ports/ProjectDocumentReferencePort";
import type { ProjectRepository } from "../ports/ProjectRepository";
import { OperationsHubApplicationError } from "./useCases";

export interface EnsureProjectDriveReferenceInput {
  readonly context: ResolvedPartnerContext;
  readonly projectId: string;
}

export interface ProjectDriveReferenceOutput {
  readonly projectId: string;
  readonly provider: "google_drive";
  readonly folderId: string;
  readonly folderUrl: string;
  readonly status: "linked";
}

/**
 * Links an existing, authorized Project to one canonical Drive folder. It
 * deliberately does not change Project state, so Drive errors cannot corrupt
 * the operational aggregate.
 */
export class EnsureProjectDriveReferenceUseCase {
  constructor(
    private readonly transactions: TransactionRunner,
    private readonly projects: ProjectRepository,
    private readonly references: ProjectDocumentReferencePort,
  ) {}

  async execute(input: EnsureProjectDriveReferenceInput): Promise<ProjectDriveReferenceOutput> {
    try {
      requireContextAccess(input.context, "project.read");
    } catch {
      throw new OperationsHubApplicationError("Access denied.", "FORBIDDEN");
    }

    try {
      const project = await this.transactions.run(async (transaction) => {
        const loaded = await this.projects.findById(input.projectId, input.context.organization.id, transaction);
        if (
          !loaded
          || loaded.workspaceId.value !== input.context.workspace.id
          || loaded.partnerId.value !== input.context.partner.id
        ) {
          throw new OperationsHubApplicationError("Project not found.", "NOT_FOUND");
        }
        return loaded;
      });

      const reference = await this.references.ensureCanonicalReference({
        projectId: project.id.value,
        organizationId: project.organizationId.value,
        partnerId: project.partnerId.value,
        workspaceId: project.workspaceId.value,
        projectName: project.name.value,
        idempotencyKey: `project-drive:${project.id.value}`,
      });
      if (reference.status !== "linked" || !reference.externalReference || !reference.externalUrl) {
        throw new DriveReferenceSyncError();
      }
      return {
        projectId: reference.projectId,
        provider: reference.provider,
        folderId: reference.externalReference,
        folderUrl: reference.externalUrl,
        status: "linked",
      };
    } catch (error) {
      if (error instanceof OperationsHubApplicationError) throw error;
      if (error instanceof DriveReferenceConfigurationError) {
        throw new OperationsHubApplicationError("Drive integration is not configured.", "DRIVE_NOT_CONFIGURED");
      }
      if (error instanceof DriveReferenceSyncError) {
        throw new OperationsHubApplicationError("Project Drive synchronization failed and can be retried.", "DRIVE_SYNC_FAILED");
      }
      throw new OperationsHubApplicationError("Operations Hub persistence is unavailable.", "PERSISTENCE");
    }
  }
}
