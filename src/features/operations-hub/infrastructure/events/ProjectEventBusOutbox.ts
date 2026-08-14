import type { TransactionContext } from "../../../lead-lifecycle/ports/TransactionRunner";
import type { EventContractRegistry } from "../../../event-bus/domain/validation";
import type { PublishEventUseCase } from "../../../event-bus/application/useCases";
import type { ProjectDomainEvent } from "../../domain/events";
import type { ProjectEventOutbox } from "../../ports/ProjectEventOutbox";

export type ProjectEventPayload = Readonly<{
  projectId: string;
  status: string;
  partnerId: string;
  workspaceId: string;
}>;

const eventTypes: Record<ProjectDomainEvent["type"], string> = {
  ProjectCreated: "operations.project-created.v1",
  ProjectActivated: "operations.project-activated.v1",
  ProjectPaused: "operations.project-paused.v1",
  ProjectCompleted: "operations.project-completed.v1",
  ProjectCancelled: "operations.project-cancelled.v1",
};

function payload(event: ProjectDomainEvent): ProjectEventPayload {
  return Object.freeze({
    projectId: event.aggregateId,
    status: statusFor(event.type),
    partnerId: event.partnerId,
    workspaceId: event.workspaceId,
  });
}

function statusFor(type: ProjectDomainEvent["type"]): string {
  switch (type) {
    case "ProjectCreated": return "planned";
    case "ProjectActivated": return "active";
    case "ProjectPaused": return "on_hold";
    case "ProjectCompleted": return "completed";
    case "ProjectCancelled": return "cancelled";
  }
}

/** Registers the stable v1 contracts produced by Operations Hub. */
export function registerProjectEventContracts(registry: EventContractRegistry): void {
  for (const eventType of Object.values(eventTypes)) {
    registry.register({
      eventType,
      eventVersion: 1,
      owner: "operations-hub",
      validate: (value): value is ProjectEventPayload => {
        if (!value || typeof value !== "object") return false;
        const candidate = value as Partial<ProjectEventPayload>;
        return [candidate.projectId, candidate.status, candidate.partnerId, candidate.workspaceId]
          .every((field) => typeof field === "string" && field.trim().length > 0);
      },
    });
  }
}

/** Appends Project facts to KYRUMA's shared transactional Event Bus outbox. */
export class ProjectEventBusOutbox implements ProjectEventOutbox {
  constructor(private readonly publish: PublishEventUseCase) {}

  async append(events: readonly ProjectDomainEvent[], context: TransactionContext): Promise<void> {
    for (const event of events) {
      await this.publish.execute({
        eventId: event.eventId,
        eventType: eventTypes[event.type],
        eventVersion: event.version,
        occurredAt: event.occurredAt.toISOString(),
        correlationId: event.correlationId,
        causationId: null,
        organizationId: event.organizationId,
        partnerId: event.partnerId,
        workspaceId: event.workspaceId,
        actorId: event.actorId,
        source: "operations-hub",
        aggregateType: event.aggregateType,
        aggregateId: event.aggregateId,
        payload: payload(event),
        metadata: { pii: false, processingDepth: 0 },
      }, context);
    }
  }
}
