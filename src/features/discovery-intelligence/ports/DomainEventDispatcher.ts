import type { IntelligenceDomainEvent } from "../domain/events";
export interface DomainEventDispatcher { dispatch(events: readonly IntelligenceDomainEvent[]): Promise<void>; }
