import type { LeadDomainEvent } from "../domain/events";

export interface DomainEventDispatcher {
  dispatch(events: readonly LeadDomainEvent[]): Promise<void>;
}
