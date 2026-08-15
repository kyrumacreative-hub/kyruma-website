import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { ProjectDomainEvent } from "../domain/events";

/**
 * Shared Event Bus boundary. Implementations append the event envelope to the
 * transactional outbox; delivery happens only after the enclosing commit.
 */
export interface ProjectEventOutbox {
  append(events: readonly ProjectDomainEvent[], context: TransactionContext): Promise<void>;
}
