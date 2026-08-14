import type { ProjectDomainEvent } from "../domain/events";

/**
 * Post-commit boundary. Its future adapter maps these events to the shared
 * Event Bus outbox; Operations Hub does not own a second event bus.
 */
export interface ProjectDomainEventDispatcher {
  dispatch(events: readonly ProjectDomainEvent[]): Promise<void>;
}
