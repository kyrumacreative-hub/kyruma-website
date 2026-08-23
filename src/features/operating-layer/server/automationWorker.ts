import "server-only";

import { randomUUID } from "node:crypto";
import type { EventEnvelope } from "../../event-bus/domain/contracts";
import type { EventHandler } from "../../event-bus/ports/EventBusRepository";
import { EventHandlerRegistry } from "../../event-bus/application/EventHandlerRegistry";
import { DispatchPendingEventsUseCase, ProcessEventUseCase } from "../../event-bus/application/useCases";
import { PostgresEventTransport } from "../../event-bus/infrastructure/persistence/PostgresEventTransport";
import { PrismaEventBusRepository } from "../../event-bus/infrastructure/persistence/PrismaEventBusRepository";
import { AutomationEngine } from "../../automations/application/AutomationEngine";
import { PrismaAutomationRepository } from "../../automations/infrastructure/PrismaAutomationRepository";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { prisma } from "../../../lib/prisma";
import { LEAD_CREATED, LEAD_DISCOVERY_COMPLETED, LEAD_QUALIFIED } from "../domain/contracts";
import { PrismaOperationalTaskAction } from "../infrastructure/PrismaOperationalTaskAction";

class AutomationEventHandler implements EventHandler {
  constructor(private readonly engine: AutomationEngine, private readonly transactions: PrismaTransactionRunner) {}
  async handle(envelope: EventEnvelope): Promise<void> {
    await this.transactions.run((context) => this.engine.handle(envelope, context));
  }
}

export function createAutomationWorker(): { dispatch: DispatchPendingEventsUseCase; process: ProcessEventUseCase } {
  const contexts = new PrismaTransactionContextStore();
  const transactions = new PrismaTransactionRunner(prisma, contexts);
  const events = new PrismaEventBusRepository(prisma, contexts);
  const repository = new PrismaAutomationRepository(prisma, contexts);
  const engine = new AutomationEngine(repository, [new PrismaOperationalTaskAction(contexts)], randomUUID, () => new Date());
  const implementation = new AutomationEventHandler(engine, transactions);
  const handlers = new EventHandlerRegistry();
  for (const eventType of [LEAD_CREATED, LEAD_DISCOVERY_COMPLETED, LEAD_QUALIFIED]) {
    handlers.register({ consumer: "automations", handler: "create-operational-task", eventType, eventVersion: 1, implementation });
  }
  const clock = { now: () => new Date() };
  return {
    dispatch: new DispatchPendingEventsUseCase(events, new PostgresEventTransport(events), handlers, clock),
    process: new ProcessEventUseCase(events, handlers, transactions, clock),
  };
}
