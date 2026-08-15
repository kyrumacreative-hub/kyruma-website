export interface ProjectPersistenceModel {
  id: string;
  organizationId: string;
  partnerId: string;
  workspaceId: string;
  name: string;
  status: string;
  createdAt: Date;
  createdBy: string;
  correlationId: string;
}

export interface ProjectDocumentReferencePersistenceModel {
  id: string;
  projectId: string;
  organizationId: string;
  partnerId: string;
  workspaceId: string;
  provider: string;
  externalReference: string | null;
  externalUrl: string | null;
  idempotencyKey: string;
  status: string;
  lastError: string | null;
  attemptCount: number;
  createdAt: Date;
  updatedAt: Date;
}
