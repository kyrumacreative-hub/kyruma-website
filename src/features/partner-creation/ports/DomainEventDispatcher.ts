import type { PartnerDomainEvent } from "../domain/events";

/** Dispatches Partner events only after their transaction has committed. */
export interface DomainEventDispatcher {
  dispatch(events: readonly PartnerDomainEvent[]): Promise<void>;
}
