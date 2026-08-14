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
