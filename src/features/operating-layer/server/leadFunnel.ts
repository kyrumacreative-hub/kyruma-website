import "server-only";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { requireCurrentActor } from "../../access/server/currentActor";
import { requireInternalAdmin } from "../../access/server/internalAdmin";
import { PublishEventUseCase } from "../../event-bus/application/useCases";
import { EventContractRegistry } from "../../event-bus/domain/validation";
import { PrismaEventBusRepository } from "../../event-bus/infrastructure/persistence/PrismaEventBusRepository";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { prisma } from "../../../lib/prisma";
import { LEAD_CREATED, LEAD_DISCOVERY_COMPLETED, LEAD_QUALIFIED, registerLeadFunnelContracts, type LeadFunnelEventPayload } from "../domain/contracts";
import { assertSubmissionId, normalizeFunnelEmail } from "../domain/taskPolicy";

export interface PublicLeadIntakeInput {
  readonly submissionId: string;
  readonly email: string;
  readonly contactName: string;
  readonly company: string;
  readonly serviceInterest: string;
  readonly collaboration: string;
}

function foundation() {
  const contexts = new PrismaTransactionContextStore();
  const transactions = new PrismaTransactionRunner(prisma, contexts);
  const events = new PrismaEventBusRepository(prisma, contexts);
  const contracts = new EventContractRegistry();
  registerLeadFunnelContracts(contracts);
  const clock = { now: () => new Date() };
  return { contexts, transactions, publish: new PublishEventUseCase(events, contracts, clock) };
}

async function publishLeadFact(input: {
  eventId: string;
  eventType: typeof LEAD_CREATED | typeof LEAD_DISCOVERY_COMPLETED | typeof LEAD_QUALIFIED;
  organizationId: string;
  leadId: string;
  status: LeadFunnelEventPayload["status"];
  occurredAt: Date;
  actorId?: string;
}, context: Parameters<PublishEventUseCase["execute"]>[1], publish: PublishEventUseCase): Promise<void> {
  await publish.execute({
    eventId: input.eventId,
    eventType: input.eventType,
    eventVersion: 1,
    occurredAt: input.occurredAt.toISOString(),
    correlationId: input.eventId,
    causationId: null,
    organizationId: input.organizationId,
    source: "operating-layer",
    aggregateType: "Lead",
    aggregateId: input.leadId,
    payload: { leadId: input.leadId, status: input.status },
    metadata: { pii: false, processingDepth: 0 },
    ...(input.actorId ? { actorId: input.actorId } : {}),
  }, context);
}

function text(value: string, field: string, max: number): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > max) throw new Error(`LEAD_${field}_INVALID`);
  return normalized;
}

export async function capturePublicLead(input: PublicLeadIntakeInput): Promise<{ leadId: string; created: boolean }> {
  const submissionId = assertSubmissionId(input.submissionId);
  const normalizedEmail = normalizeFunnelEmail(input.email);
  const ownerId = process.env.KYRUMA_DEFAULT_LEAD_OWNER_ID?.trim();
  if (!ownerId) throw new Error("KYRUMA_DEFAULT_LEAD_OWNER_ID_REQUIRED");
  const contactName = text(input.contactName, "CONTACT_NAME", 100);
  const company = text(input.company, "COMPANY", 140);
  const serviceInterest = text(input.serviceInterest, "SERVICE_INTEREST", 120);
  const collaboration = text(input.collaboration, "COLLABORATION", 160);
  const value = foundation();

  return value.transactions.run(async (context) => {
    const db = value.contexts.get(context);
    await db.$queryRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended(${`lead-intake:${submissionId}`}, 0))::text AS "lock"`);
    const existing = await db.leadIntake.findUnique({ where: { id: submissionId }, select: { leadId: true } });
    if (existing) return { leadId: existing.leadId, created: false };

    const now = new Date();
    const leadId = randomUUID();
    const organizationId = randomUUID();
    await db.lead.create({ data: {
      id: leadId, organizationId, ownerId, primaryContactId: `email:${normalizedEmail}`,
      origin: "website_contact", status: "identified", createdAt: now, createdBy: "system:public-intake",
    } });
    await db.ownership.create({ data: {
      id: randomUUID(), leadId, ownerId, assignedBy: "system:public-intake", assignedAt: now, reason: "Default website intake owner", active: true,
    } });
    await db.leadIntake.create({ data: {
      id: submissionId, leadId, organizationId, normalizedEmail, contactName, company,
      serviceInterest, collaboration, source: "website_contact", createdAt: now, updatedAt: now,
    } });
    await db.automationDefinition.createMany({ data: [
      {
        id: randomUUID(), organizationId, name: "Lead intake follow-up", status: "active",
        triggerType: LEAD_CREATED, triggerVersion: 1, conditions: { status: "identified" },
        actionType: "operations.task.create", actionConfig: { taskType: "lead.follow-up", title: "Revisar nuevo Lead", dueHours: 24 },
        version: 1, createdBy: "system:operating-layer", createdAt: now, updatedAt: now,
      },
      {
        id: randomUUID(), organizationId, name: "Discovery qualification", status: "active",
        triggerType: LEAD_DISCOVERY_COMPLETED, triggerVersion: 1, conditions: { status: "discovery_completed" },
        actionType: "operations.task.create", actionConfig: { taskType: "lead.qualify", title: "Calificar Discovery completado", dueHours: 24 },
        version: 1, createdBy: "system:operating-layer", createdAt: now, updatedAt: now,
      },
    ] });
    await publishLeadFact({ eventId: randomUUID(), eventType: LEAD_CREATED, organizationId, leadId, status: "identified", occurredAt: now }, context, value.publish);
    return { leadId, created: true };
  });
}

export async function completeDiscoveryForEmail(email: string): Promise<{ matched: boolean; leadId?: string }> {
  const normalizedEmail = normalizeFunnelEmail(email);
  const value = foundation();
  return value.transactions.run(async (context) => {
    const db = value.contexts.get(context);
    const intake = await db.leadIntake.findFirst({
      where: { normalizedEmail }, orderBy: { createdAt: "desc" }, include: { lead: { select: { id: true, organizationId: true, status: true } } },
    });
    if (!intake) return { matched: false };
    await db.$queryRaw(Prisma.sql`SELECT "id" FROM "Lead" WHERE "id" = ${intake.leadId} FOR UPDATE`);
    const lead = await db.lead.findUniqueOrThrow({ where: { id: intake.leadId }, select: { id: true, organizationId: true, status: true } });
    if (["discovery_completed", "qualified", "partner_created"].includes(lead.status)) return { matched: true, leadId: lead.id };
    if (!["identified", "discovery_in_progress"].includes(lead.status)) return { matched: true, leadId: lead.id };

    const now = new Date();
    await db.lead.update({ where: { id: lead.id }, data: { status: "discovery_completed" } });
    await db.leadIntake.update({ where: { id: intake.id }, data: {
      discoveryStartedAt: intake.discoveryStartedAt ?? now, discoveryCompletedAt: now, updatedAt: now,
    } });
    await publishLeadFact({ eventId: randomUUID(), eventType: LEAD_DISCOVERY_COMPLETED, organizationId: lead.organizationId, leadId: lead.id, status: "discovery_completed", occurredAt: now }, context, value.publish);
    return { matched: true, leadId: lead.id };
  });
}

export async function qualifyLead(leadId: string, reason: string): Promise<void> {
  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);
  const normalizedLeadId = text(leadId, "ID", 100);
  const normalizedReason = text(reason, "QUALIFICATION_REASON", 1000);
  const value = foundation();
  await value.transactions.run(async (context) => {
    const db = value.contexts.get(context);
    await db.$queryRaw(Prisma.sql`SELECT "id" FROM "Lead" WHERE "id" = ${normalizedLeadId} FOR UPDATE`);
    const lead = await db.lead.findUnique({ where: { id: normalizedLeadId } });
    if (!lead) throw new Error("LEAD_NOT_FOUND");
    if (lead.status === "qualified") return;
    if (lead.status !== "discovery_completed") throw new Error("LEAD_DISCOVERY_REQUIRED");
    const now = new Date();
    await db.qualification.create({ data: {
      id: randomUUID(), leadId: lead.id, decision: "qualified", reason: normalizedReason, decidedBy: actor.user.id, decidedAt: now,
    } });
    await db.lead.update({ where: { id: lead.id }, data: { status: "qualified" } });
    await publishLeadFact({ eventId: randomUUID(), eventType: LEAD_QUALIFIED, organizationId: lead.organizationId, leadId: lead.id, status: "qualified", occurredAt: now, actorId: actor.user.id }, context, value.publish);
  });
}

export async function completeOperationalTask(taskId: string): Promise<void> {
  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);
  const id = text(taskId, "TASK_ID", 100);
  const updated = await prisma.operationalTask.updateMany({ where: { id, status: "open" }, data: { status: "completed", completedAt: new Date(), assigneeId: actor.user.id } });
  if (updated.count !== 1) throw new Error("OPERATIONAL_TASK_NOT_OPEN");
}

