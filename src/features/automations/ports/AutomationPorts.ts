import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { EventEnvelope } from "../../event-bus/domain/contracts";
import type { AutomationActionType, AutomationDefinition, AutomationRun } from "../domain/types";

export interface AutomationRepository {
  findActiveFor(event: EventEnvelope): Promise<readonly AutomationDefinition[]>;
  findRun(automationId: string, sourceEventId: string): Promise<AutomationRun | null>;
  startRun(run: AutomationRun, context: TransactionContext): Promise<void>;
  completeRun(runId: string, result: Readonly<Record<string, unknown>>, completedAt: Date, context: TransactionContext): Promise<void>;
  failRun(runId: string, code: string, completedAt: Date, context: TransactionContext): Promise<void>;
}
export interface AutomationAction { readonly type: AutomationActionType; execute(input: { definition: AutomationDefinition; event: EventEnvelope }, context: TransactionContext): Promise<Readonly<Record<string, unknown>>> }

