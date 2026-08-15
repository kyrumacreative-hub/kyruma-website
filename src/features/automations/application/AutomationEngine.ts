import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { EventEnvelope } from "../../event-bus/domain/contracts";
import { matchesAutomation, validateAutomation } from "../domain/policy";
import type { AutomationAction, AutomationRepository } from "../ports/AutomationPorts";

export class AutomationEngine {
  private readonly actions: Map<string, AutomationAction>;
  constructor(private readonly repository: AutomationRepository, actions: readonly AutomationAction[], private readonly newId: () => string, private readonly now: () => Date) { this.actions = new Map(actions.map((action) => [action.type, action])); }
  async handle(event: EventEnvelope, context: TransactionContext): Promise<void> {
    const definitions = await this.repository.findActiveFor(event);
    for (const definition of definitions) {
      validateAutomation(definition);
      if (!matchesAutomation(definition, event) || await this.repository.findRun(definition.id, event.eventId)) continue;
      const action = this.actions.get(definition.actionType);
      if (!action) throw new Error("AUTOMATION_ACTION_UNAVAILABLE");
      const startedAt = this.now(); const runId = this.newId();
      await this.repository.startRun({ id: runId, automationId: definition.id, organizationId: event.organizationId, sourceEventId: event.eventId, correlationId: event.correlationId, status: "running", attemptCount: 1, startedAt }, context);
      try { const result = await action.execute({ definition, event }, context); await this.repository.completeRun(runId, result, this.now(), context); }
      catch (error) { await this.repository.failRun(runId, error instanceof Error ? error.message : "AUTOMATION_FAILED", this.now(), context); throw error; }
    }
  }
}

