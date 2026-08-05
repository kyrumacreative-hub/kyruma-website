import type { ContextEvent } from "../domain/types";

/** No business consumers are registered in Foundation Phase 2. */
export interface ContextEventPublisher {
  publish(event: ContextEvent): Promise<void>;
}
