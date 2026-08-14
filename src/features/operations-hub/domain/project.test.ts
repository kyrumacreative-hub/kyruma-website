import assert from "node:assert/strict";
import test from "node:test";
import { InvalidProjectStateError, InvalidProjectValueError } from "./errors";
import { projectEvent } from "./events";
import { ProjectFactory } from "./projectFactory";
import { OperationsOrganizationId, OperationsPartnerId, OperationsWorkspaceId, ProjectId, ProjectName, ProjectStatus } from "./valueObjects";

const now = new Date("2026-08-14T10:00:00.000Z");
const project = () => ProjectFactory.create({ id: ProjectId.create("project-1"), organizationId: OperationsOrganizationId.create("org-1"), partnerId: OperationsPartnerId.create("partner-1"), workspaceId: OperationsWorkspaceId.create("workspace-1"), name: ProjectName.create("Identity renewal"), createdAt: now, createdBy: "user-1", correlationId: "correlation-1" });

test("creates the approved operational work unit in planned state", () => {
  assert.equal(project().status, "planned");
});

test("enforces the Project lifecycle and rejects invalid transitions", () => {
  const value = project();
  value.activate(); value.pause(); value.activate(); value.complete();
  assert.equal(value.status, "completed");
  assert.throws(() => value.activate(), InvalidProjectStateError);
});

test("validates Project identity, name and state", () => {
  assert.throws(() => ProjectId.create(" "), InvalidProjectValueError);
  assert.throws(() => ProjectName.create(" "), InvalidProjectValueError);
  assert.throws(() => ProjectStatus.create("unknown"), InvalidProjectStateError);
});

test("records versioned business events with Partner and Workspace scope", () => {
  const value = project();
  value.recordEvent(projectEvent("ProjectCreated", value, { eventId: "event-1", occurredAt: now, correlationId: "correlation-1", actorId: "user-1" }));
  const events = value.pullDomainEvents();
  assert.equal(events[0].workspaceId, "workspace-1");
  assert.equal(events[0].partnerId, "partner-1");
  assert.equal(value.pullDomainEvents().length, 0);
});
