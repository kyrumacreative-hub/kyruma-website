import { InvalidProjectValueError } from "./errors";
import type { Project } from "./project";

export type ProjectEventType =
  | "ProjectCreated"
  | "ProjectActivated"
  | "ProjectPaused"
  | "ProjectCompleted"
  | "ProjectCancelled";

export interface ProjectEventMetadata {
  eventId: string;
  occurredAt: Date;
  correlationId: string;
  actorId: string;
}

export interface ProjectDomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly aggregateType: "Project";
  readonly version: 1;
  readonly occurredAt: Date;
  readonly correlationId: string;
  readonly actorId: string;
  readonly organizationId: string;
  readonly partnerId: string;
  readonly workspaceId: string;
  readonly type: ProjectEventType;
}

export function projectEvent(
  type: ProjectEventType,
  project: Project,
  metadata: ProjectEventMetadata,
): ProjectDomainEvent {
  if (!metadata.eventId.trim() || !metadata.correlationId.trim() || !metadata.actorId.trim()) {
    throw new InvalidProjectValueError("Project event metadata is required.");
  }
  return Object.freeze({
    eventId: metadata.eventId,
    aggregateId: project.id.value,
    aggregateType: "Project" as const,
    version: 1 as const,
    occurredAt: new Date(metadata.occurredAt),
    correlationId: metadata.correlationId,
    actorId: metadata.actorId,
    organizationId: project.organizationId.value,
    partnerId: project.partnerId.value,
    workspaceId: project.workspaceId.value,
    type,
  });
}
