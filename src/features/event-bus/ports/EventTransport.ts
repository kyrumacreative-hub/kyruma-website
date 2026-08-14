import type { EventEnvelope } from "../domain/contracts";
import type { RegisteredHandler } from "./EventBusRepository";
export interface EventTransport { materialize(envelope: EventEnvelope, handlers: readonly RegisteredHandler[], dispatchedAt: Date): Promise<void>; }
