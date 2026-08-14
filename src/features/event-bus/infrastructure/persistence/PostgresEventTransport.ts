import type { EventEnvelope } from "../../domain/contracts";
import type { EventBusRepository, RegisteredHandler } from "../../ports/EventBusRepository";
import type { EventTransport } from "../../ports/EventTransport";
export class PostgresEventTransport implements EventTransport {
  constructor(private readonly repository: EventBusRepository) {}
  materialize(envelope: EventEnvelope, handlers: readonly RegisteredHandler[], dispatchedAt: Date): Promise<void> { return this.repository.materializeDeliveries(envelope, handlers, dispatchedAt); }
}
