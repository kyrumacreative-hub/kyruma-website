import type { Prisma, PrismaClient } from "@prisma/client";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { EventEnvelope } from "../../event-bus/domain/contracts";
import type { AutomationActionType, AutomationDefinition, AutomationRun, AutomationStatus } from "../domain/types";
import type { AutomationRepository } from "../ports/AutomationPorts";

export class PrismaAutomationRepository implements AutomationRepository {
  constructor(private readonly client: PrismaClient, private readonly contexts: PrismaTransactionContextStore) {}
  async findActiveFor(event: EventEnvelope): Promise<readonly AutomationDefinition[]> { const rows = await this.client.automationDefinition.findMany({ where: { organizationId: event.organizationId, status: "active", triggerType: event.eventType, triggerVersion: event.eventVersion } }); return rows.map((row) => ({ ...row, status: row.status as AutomationStatus, conditions: row.conditions as Record<string, string | number | boolean>, actionType: row.actionType as AutomationActionType, actionConfig: row.actionConfig as Record<string, unknown> })); }
  async findRun(automationId: string, sourceEventId: string): Promise<AutomationRun | null> { const row = await this.client.automationRun.findUnique({ where: { automationId_sourceEventId: { automationId, sourceEventId } } }); return row ? { ...row, status: row.status as AutomationRun["status"], result: row.result as Record<string, unknown> | undefined, completedAt: row.completedAt ?? undefined, errorCode: row.errorCode ?? undefined } : null; }
  async startRun(run: AutomationRun, context: TransactionContext): Promise<void> { await this.contexts.get(context).automationRun.create({ data: { ...run, result: run.result as Prisma.InputJsonValue | undefined } }); }
  async completeRun(runId: string, result: Readonly<Record<string, unknown>>, completedAt: Date, context: TransactionContext): Promise<void> { await this.contexts.get(context).automationRun.update({ where: { id: runId }, data: { status: "completed", result: result as Prisma.InputJsonValue, completedAt } }); }
  async failRun(runId: string, errorCode: string, completedAt: Date, context: TransactionContext): Promise<void> { await this.contexts.get(context).automationRun.update({ where: { id: runId }, data: { status: "failed", errorCode, completedAt } }); }
}

