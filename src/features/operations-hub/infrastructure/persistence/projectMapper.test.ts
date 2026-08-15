import assert from "node:assert/strict";
import test from "node:test";
import { ProjectFactory } from "../../domain/projectFactory";
import { OperationsOrganizationId, OperationsPartnerId, OperationsWorkspaceId, ProjectId, ProjectName } from "../../domain/valueObjects";
import { ProjectMapper } from "./projectMapper";

test("round-trips Project persistence without losing scope, status or identity", () => {
  const project = ProjectFactory.create({
    id: ProjectId.create("project-1"), organizationId: OperationsOrganizationId.create("org-1"),
    partnerId: OperationsPartnerId.create("partner-1"), workspaceId: OperationsWorkspaceId.create("workspace-1"),
    name: ProjectName.create("Identity renewal"), createdAt: new Date("2026-08-14T10:00:00.000Z"),
    createdBy: "user-1", correlationId: "correlation-1",
  });
  project.activate();
  const restored = ProjectMapper.toDomain(ProjectMapper.toPersistence(project));
  assert.deepEqual(
    { id: restored.id.value, organizationId: restored.organizationId.value, partnerId: restored.partnerId.value, workspaceId: restored.workspaceId.value, name: restored.name.value, status: restored.status, correlationId: restored.correlationId },
    { id: "project-1", organizationId: "org-1", partnerId: "partner-1", workspaceId: "workspace-1", name: "Identity renewal", status: "active", correlationId: "correlation-1" },
  );
  assert.equal(restored.pullDomainEvents().length, 0);
});
