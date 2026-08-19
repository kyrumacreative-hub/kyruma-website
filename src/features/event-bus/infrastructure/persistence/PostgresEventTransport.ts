import type { ClaimedEvent, EventBusRepository, RegisteredHandler } from "../../ports/EventBusRepository";
import type { EventTransport } from "../../ports/EventTransport";
export class PostgresEventTransport implements EventTransport {
  constructor(private readonly repository: EventBusRepository) {}
  materialize(claim: ClaimedEvent, handlers: readonly RegisteredHandler[], dispatchedAt: Date): Promise<void> { return this.repository.materializeDeliveries(claim, handlers, dispatchedAt); }
}
