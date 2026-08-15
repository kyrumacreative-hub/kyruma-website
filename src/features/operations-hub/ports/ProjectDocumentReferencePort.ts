/** Canonical scope carried by every document reference. */
export interface ProjectDocumentReferenceScope {
  readonly projectId: string;
  readonly organizationId: string;
  readonly partnerId: string;
  readonly workspaceId: string;
}

export type ProjectDocumentReferenceStatus = "pending" | "linked" | "failed";

/**
 * A provider-neutral pointer to the single documentary destination of a
 * Project. Operations stores this pointer, never a document or its contents.
 */
export interface ProjectDocumentReference extends ProjectDocumentReferenceScope {
  readonly id: string;
  readonly provider: "google_drive";
  readonly externalReference: string | null;
  readonly externalUrl: string | null;
  readonly idempotencyKey: string;
  readonly status: ProjectDocumentReferenceStatus;
  readonly lastError: string | null;
  readonly attemptCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface EnsureProjectDocumentReferenceInput extends ProjectDocumentReferenceScope {
  readonly projectName: string;
  readonly idempotencyKey: string;
}

/**
 * Document-system boundary. The concrete adapter is responsible for safe,
 * retryable provider interaction and persistent canonical reference handling.
 */
export interface ProjectDocumentReferencePort {
  ensureCanonicalReference(input: EnsureProjectDocumentReferenceInput): Promise<ProjectDocumentReference>;
  listByProject(scope: ProjectDocumentReferenceScope): Promise<readonly ProjectDocumentReference[]>;
}
