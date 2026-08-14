import { InvalidProjectStateError } from "./errors";
import type { ProjectDomainEvent } from "./events";
import {
  OperationsOrganizationId,
  OperationsPartnerId,
  OperationsWorkspaceId,
  ProjectId,
  ProjectName,
  ProjectStatus,
  type ProjectStatusValue,
} from "./valueObjects";

export interface ProjectProperties {
  id: ProjectId;
  organizationId: OperationsOrganizationId;
  partnerId: OperationsPartnerId;
  workspaceId: OperationsWorkspaceId;
  name: ProjectName;
  createdAt: Date;
  createdBy: string;
  correlationId: string;
  status?: ProjectStatusValue;
}

const transitions: Record<ProjectStatusValue, readonly ProjectStatusValue[]> = {
  planned: ["active", "cancelled"],
  active: ["on_hold", "completed", "cancelled"],
  on_hold: ["active", "cancelled"],
  completed: [],
  cancelled: [],
};

export class Project {
  readonly id: ProjectId;
  readonly organizationId: OperationsOrganizationId;
  readonly partnerId: OperationsPartnerId;
  readonly workspaceId: OperationsWorkspaceId;
  readonly name: ProjectName;
  readonly createdAt: Date;
  readonly createdBy: string;
  readonly correlationId: string;
  private currentStatus: ProjectStatus;
  private pendingEvents: ProjectDomainEvent[] = [];

  constructor(properties: ProjectProperties) {
    if (!properties.createdBy.trim() || !properties.correlationId.trim()) {
      throw new InvalidProjectStateError("Project audit metadata is required.");
    }
    this.id = properties.id;
    this.organizationId = properties.organizationId;
    this.partnerId = properties.partnerId;
    this.workspaceId = properties.workspaceId;
    this.name = properties.name;
    this.createdAt = new Date(properties.createdAt);
    this.createdBy = properties.createdBy;
    this.correlationId = properties.correlationId;
    this.currentStatus = ProjectStatus.create(properties.status ?? "planned");
  }

  get status() { return this.currentStatus.value; }
  activate() { this.transition("active"); }
  pause() { this.transition("on_hold"); }
  complete() { this.transition("completed"); }
  cancel() { this.transition("cancelled"); }
  recordEvent(event: ProjectDomainEvent) { this.pendingEvents.push(event); }
  pullDomainEvents() { const events = [...this.pendingEvents]; this.clearDomainEvents(); return events; }
  clearDomainEvents() { this.pendingEvents = []; }

  private transition(next: ProjectStatusValue) {
    if (!transitions[this.status].includes(next)) {
      throw new InvalidProjectStateError(`Cannot transition Project from ${this.status} to ${next}.`);
    }
    this.currentStatus = ProjectStatus.create(next);
  }
}
