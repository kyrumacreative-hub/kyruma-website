import { randomUUID } from "node:crypto";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { AutomationAction } from "../../automations/ports/AutomationPorts";
import { parseOperationalTaskConfiguration } from "../domain/taskPolicy";

export class PrismaOperationalTaskAction implements AutomationAction {
  readonly type = "operations.task.create" as const;

  constructor(private readonly contexts: PrismaTransactionContextStore, private readonly now: () => Date = () => new Date()) {}

  async execute(input: Parameters<AutomationAction["execute"]>[0], context: TransactionContext): Promise<Readonly<Record<string, unknown>>> {
    const configuration = parseOperationalTaskConfiguration(input.definition.actionConfig);
    const payload = input.event.payload && typeof input.event.payload === "object"
      ? input.event.payload as Record<string, unknown>
      : {};
    const createdAt = this.now();
    const dueAt = new Date(createdAt.getTime() + configuration.dueHours * 60 * 60 * 1000);
    const task = await this.contexts.get(context).operationalTask.upsert({
      where: { organizationId_sourceEventId_taskType: {
        organizationId: input.event.organizationId, sourceEventId: input.event.eventId, taskType: configuration.taskType,
      } },
      update: {},
      create: {
        id: randomUUID(), organizationId: input.event.organizationId, sourceEventId: input.event.eventId,
        taskType: configuration.taskType, title: configuration.title, status: "open",
        leadId: typeof payload.leadId === "string" ? payload.leadId : undefined,
        partnerId: input.event.partnerId, workspaceId: input.event.workspaceId,
        dueAt, createdAt,
      },
      select: { id: true, dueAt: true },
    });
    return { taskId: task.id, dueAt: task.dueAt?.toISOString() ?? null };
  }
}

