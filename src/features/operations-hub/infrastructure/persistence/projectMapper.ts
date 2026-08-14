import { ProjectFactory } from "../../domain/projectFactory";
import type { Project } from "../../domain/project";
import {
  OperationsOrganizationId,
  OperationsPartnerId,
  OperationsWorkspaceId,
  ProjectId,
  ProjectName,
  ProjectStatus,
} from "../../domain/valueObjects";
import type { ProjectPersistenceModel } from "./models";

export const ProjectMapper = {
  toPersistence(project: Project): ProjectPersistenceModel {
    return {
      id: project.id.value,
      organizationId: project.organizationId.value,
      partnerId: project.partnerId.value,
      workspaceId: project.workspaceId.value,
      name: project.name.value,
      status: project.status,
      createdAt: project.createdAt,
      createdBy: project.createdBy,
      correlationId: project.correlationId,
    };
  },
  toDomain(model: ProjectPersistenceModel): Project {
    return ProjectFactory.rehydrate({
      id: ProjectId.create(model.id),
      organizationId: OperationsOrganizationId.create(model.organizationId),
      partnerId: OperationsPartnerId.create(model.partnerId),
      workspaceId: OperationsWorkspaceId.create(model.workspaceId),
      name: ProjectName.create(model.name),
      status: ProjectStatus.create(model.status).value,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      correlationId: model.correlationId,
    });
  },
};
