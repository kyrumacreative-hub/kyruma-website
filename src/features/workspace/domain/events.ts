import type { Workspace } from "./workspace";
import { InvalidWorkspaceValueError } from "./errors";

export type WorkspaceEventType = "WorkspaceProvisioningStarted" | "WorkspaceProvisioned" | "WorkspaceActivated" | "InvitationCreated" | "InvitationAccepted" | "InvitationRevoked" | "MemberAdded" | "MemberRemoved";
export interface WorkspaceEventMetadata { eventId: string; occurredAt: Date; correlationId: string; actorId: string; }
export interface WorkspaceDomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly aggregateType: "Workspace";
  readonly version: 1;
  readonly occurredAt: Date;
  readonly correlationId: string;
  readonly actorId: string;
  readonly organizationId: string;
  readonly partnerId: string;
  readonly type: WorkspaceEventType;
}

export function workspaceEvent(type: WorkspaceEventType, workspace: Workspace, metadata: WorkspaceEventMetadata): WorkspaceDomainEvent {
  if (!metadata.eventId.trim() || !metadata.actorId.trim() || !metadata.correlationId.trim()) throw new InvalidWorkspaceValueError("Workspace event metadata is required.");
  return Object.freeze({ eventId: metadata.eventId, aggregateId: workspace.id.value, aggregateType: "Workspace", version: 1, occurredAt: new Date(metadata.occurredAt), correlationId: metadata.correlationId, actorId: metadata.actorId, organizationId: workspace.organizationId.value, partnerId: workspace.partnerId.value, type });
}
