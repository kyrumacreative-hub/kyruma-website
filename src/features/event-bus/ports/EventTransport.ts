import type { ClaimedEvent, RegisteredHandler } from "./EventBusRepository";
export interface EventTransport { materialize(claim: ClaimedEvent, handlers: readonly RegisteredHandler[], dispatchedAt: Date): Promise<void>; }
