import type { ProjectDocumentReference } from "../../ports/ProjectDocumentReferencePort";
import type { ProjectDocumentReferencePersistenceModel } from "./models";

function status(value: string): ProjectDocumentReference["status"] {
  if (value === "pending" || value === "linked" || value === "failed") return value;
  throw new Error("Unsupported Project document reference status.");
}

export const ProjectDocumentReferenceMapper = {
  toPersistence(reference: ProjectDocumentReference): ProjectDocumentReferencePersistenceModel {
    return {
      id: reference.id,
      projectId: reference.projectId,
      organizationId: reference.organizationId,
      partnerId: reference.partnerId,
      workspaceId: reference.workspaceId,
      provider: reference.provider,
      externalReference: reference.externalReference,
      externalUrl: reference.externalUrl,
      idempotencyKey: reference.idempotencyKey,
      status: reference.status,
      lastError: reference.lastError,
      attemptCount: reference.attemptCount,
      createdAt: reference.createdAt,
      updatedAt: reference.updatedAt,
    };
  },
  toDomain(model: ProjectDocumentReferencePersistenceModel): ProjectDocumentReference {
    if (model.provider !== "google_drive") throw new Error("Unsupported Project document reference provider.");
    return Object.freeze({
      id: model.id,
      projectId: model.projectId,
      organizationId: model.organizationId,
      partnerId: model.partnerId,
      workspaceId: model.workspaceId,
      provider: "google_drive",
      externalReference: model.externalReference,
      externalUrl: model.externalUrl,
      idempotencyKey: model.idempotencyKey,
      status: status(model.status),
      lastError: model.lastError,
      attemptCount: model.attemptCount,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
    });
  },
};
