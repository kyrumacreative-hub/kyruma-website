import "server-only";

import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  GLOBAL_KYRUMA_ORGANIZATION_ID,
  assertBrainScope,
  assertRadarTransition,
  hookBlocks,
  optionalNonNegativeInteger,
  optionalText,
  parseBrainDna,
  parseBrainScope,
  parseRadarStatus,
  requireText,
  resolveWorkflowKey,
} from "../domain/policy";
import { requireInternalOperatingContext, requireProjectInWorkspace, requireWorkspaceInOrganization } from "./authorization";

type Transaction = Prisma.TransactionClient;

function oneOf<T extends string>(value: unknown, values: readonly T[], code: string): T {
  if (typeof value !== "string" || !values.includes(value as T)) throw new Error(code);
  return value as T;
}

async function appendAudit(db: Transaction, input: {
  organizationId: string; actorId: string; resourceType: string; resourceId: string; action: string;
  partnerId?: string; workspaceId?: string; metadata?: Prisma.InputJsonObject; changes?: Prisma.InputJsonObject;
}) {
  const now = new Date();
  const correlationId = randomUUID();
  await db.auditEvent.create({ data: {
    id: randomUUID(), eventType: `${input.action}.v1`, occurredAt: now, actorId: input.actorId, actorType: "user",
    organizationId: input.organizationId, partnerId: input.partnerId, workspaceId: input.workspaceId,
    resourceType: input.resourceType, resourceId: input.resourceId, action: input.action, result: "success",
    correlationId, source: "operating-intelligence", metadata: input.metadata ?? {}, changes: input.changes ?? {},
    schemaVersion: 1, classification: "internal", retentionCategory: "operational_activity", policyVersion: "audit-v1",
  } });
}

async function resolveScope(organizationId: string, workspaceValue?: unknown, projectValue?: unknown) {
  const workspaceId = optionalText(workspaceValue, 128);
  const projectId = optionalText(projectValue, 128);
  const workspace = await requireWorkspaceInOrganization(organizationId, workspaceId);
  const scopedOrganizationId = workspace?.organizationId ?? organizationId;
  const project = await requireProjectInWorkspace(scopedOrganizationId, workspace?.id, projectId);
  if (project && workspace && project.partnerId !== workspace.partnerId) throw new Error("OPERATING_INTELLIGENCE_PARTNER_SCOPE_INVALID");
  return { organizationId: scopedOrganizationId, workspaceId: workspace?.id, projectId: project?.id, partnerId: workspace?.partnerId };
}

export async function createRadarEntry(input: Readonly<Record<string, unknown>>): Promise<void> {
  const { actor, organizationId } = await requireInternalOperatingContext();
  const radarId = requireText(input.radarId, "radar_id", 32).toUpperCase();
  if (!/^(?:\d{3}|[A-Z0-9][A-Z0-9-]{2,31})$/.test(radarId)) throw new Error("RADAR_ID_INVALID");
  const title = requireText(input.title, "radar_title", 200);
  const now = new Date();
  const id = randomUUID();
  await prisma.$transaction(async (db) => {
    await db.radarEntry.create({ data: {
      id, organizationId, radarId, title,
      description: optionalText(input.description), sourceReference: optionalText(input.sourceReference, 500),
      category: requireText(input.category, "radar_category", 80), observedAt: now,
      problemOpportunity: optionalText(input.problemOpportunity), potentialApplication: optionalText(input.potentialApplication),
      relatedModule: requireText(input.relatedModule, "radar_module", 80),
      impactEstimate: oneOf(input.impactEstimate, ["unknown", "low", "medium", "high"] as const, "RADAR_IMPACT_INVALID"),
      effortEstimate: oneOf(input.effortEstimate, ["unknown", "low", "medium", "high"] as const, "RADAR_EFFORT_INVALID"),
      priority: oneOf(input.priority, ["low", "medium", "high", "critical"] as const, "RADAR_PRIORITY_INVALID"),
      notes: optionalText(input.notes), nextAction: optionalText(input.nextAction), status: "OBSERVED", createdBy: actor.user.id, createdAt: now, updatedAt: now,
      history: { create: { id: randomUUID(), organizationId, toStatus: "OBSERVED", decision: "Observación registrada", changedBy: actor.user.id, changedAt: now } },
    } });
    await appendAudit(db, { organizationId, actorId: actor.user.id, resourceType: "RadarEntry", resourceId: id, action: "radar.entry.create", metadata: { radarId } });
  });
}

export async function updateRadarStatus(input: Readonly<Record<string, unknown>>): Promise<void> {
  const { actor, organizationId } = await requireInternalOperatingContext();
  const id = requireText(input.id, "radar_entry_id", 128);
  const next = parseRadarStatus(input.status);
  const entry = await prisma.radarEntry.findFirst({ where: { id, organizationId: { in: [GLOBAL_KYRUMA_ORGANIZATION_ID, organizationId] } } });
  if (!entry) throw new Error("RADAR_ENTRY_NOT_FOUND");
  const current = parseRadarStatus(entry.status);
  assertRadarTransition(current, next);
  if (current === next) return;
  const now = new Date();
  const notes = optionalText(input.notes, 1_000);
  await prisma.$transaction(async (db) => {
    await db.radarEntry.update({ where: { id }, data: { status: next, updatedAt: now } });
    await db.radarHistory.create({ data: { id: randomUUID(), radarEntryId: id, organizationId: entry.organizationId, fromStatus: current, toStatus: next, notes, changedBy: actor.user.id, changedAt: now } });
    await appendAudit(db, { organizationId, actorId: actor.user.id, resourceType: "RadarEntry", resourceId: id, action: "radar.status.update", changes: { status: { from: current, to: next } } });
  });
}

export async function createBrainRecord(input: Readonly<Record<string, unknown>>): Promise<void> {
  const { actor, organizationId } = await requireInternalOperatingContext();
  const scopeType = parseBrainScope(input.scopeType);
  const dnaType = parseBrainDna(input.dnaType);
  const scope = await resolveScope(organizationId, input.workspaceId, input.projectId);
  assertBrainScope(scopeType, scope.workspaceId, scope.projectId);
  const id = randomUUID();
  const now = new Date();
  await prisma.$transaction(async (db) => {
    await db.brainRecord.create({ data: {
      id, ...scope, scopeType, dnaType,
      recordType: requireText(input.recordType, "brain_record_type", 80), title: requireText(input.title, "brain_title", 200),
      content: { text: requireText(input.content, "brain_content", 10_000) }, sourceReference: optionalText(input.sourceReference, 500),
      status: "active", createdBy: actor.user.id, createdAt: now, updatedAt: now,
    } });
    await appendAudit(db, { organizationId: scope.organizationId, actorId: actor.user.id, resourceType: "BrainRecord", resourceId: id, action: "brain.record.create", partnerId: scope.partnerId, workspaceId: scope.workspaceId, metadata: { scopeType, dnaType } });
  });
}

export async function createContentHook(input: Readonly<Record<string, unknown>>): Promise<void> {
  const { actor, organizationId } = await requireInternalOperatingContext();
  const block = oneOf(input.block, hookBlocks, "CONTENT_HOOK_BLOCK_INVALID");
  const id = randomUUID();
  const now = new Date();
  const applications = optionalText(input.applications)?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  await prisma.$transaction(async (db) => {
    await db.contentHook.create({ data: {
      id, organizationId, hookId: requireText(input.hookId, "hook_id", 40).toUpperCase(), name: requireText(input.name, "hook_name", 160), block,
      explanation: optionalText(input.explanation), structure: optionalText(input.structure), example: optionalText(input.example),
      recommendedObjective: optionalText(input.recommendedObjective, 160), applications, active: true, createdAt: now, updatedAt: now,
    } });
    await appendAudit(db, { organizationId, actorId: actor.user.id, resourceType: "ContentHook", resourceId: id, action: "content.hook.create", metadata: { block } });
  });
}

export async function createOpportunity(input: Readonly<Record<string, unknown>>): Promise<void> {
  const { actor, organizationId } = await requireInternalOperatingContext();
  const scope = await resolveScope(organizationId, input.workspaceId, input.projectId);
  const startsAt = new Date(requireText(input.startsAt, "opportunity_start", 80));
  if (Number.isNaN(startsAt.getTime())) throw new Error("OPPORTUNITY_DATE_INVALID");
  const endsRaw = optionalText(input.endsAt, 80);
  const endsAt = endsRaw ? new Date(endsRaw) : undefined;
  if (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt < startsAt)) throw new Error("OPPORTUNITY_END_DATE_INVALID");
  const id = randomUUID();
  const now = new Date();
  await prisma.$transaction(async (db) => {
    await db.contentOpportunity.create({ data: {
      id, ...scope, title: requireText(input.title, "opportunity_title", 200), description: optionalText(input.description),
      opportunityType: oneOf(input.opportunityType, ["important_date", "commercial", "cultural", "sector", "campaign", "content", "observed", "trend"] as const, "OPPORTUNITY_TYPE_INVALID"),
      sourceReference: optionalText(input.sourceReference, 500), relatedCampaign: optionalText(input.relatedCampaign, 200), startsAt, endsAt,
      status: "observed", createdBy: actor.user.id, createdAt: now, updatedAt: now,
    } });
    await appendAudit(db, { organizationId: scope.organizationId, actorId: actor.user.id, resourceType: "ContentOpportunity", resourceId: id, action: "content.opportunity.create", partnerId: scope.partnerId, workspaceId: scope.workspaceId });
  });
}

export async function createOperationalFriction(input: Readonly<Record<string, unknown>>): Promise<void> {
  const { actor, organizationId } = await requireInternalOperatingContext();
  const scope = await resolveScope(organizationId, input.workspaceId, input.projectId);
  const id = randomUUID();
  const now = new Date();
  await prisma.$transaction(async (db) => {
    await db.operationalFriction.create({ data: {
      id, ...scope, problem: requireText(input.problem, "friction_problem", 2_000), area: requireText(input.area, "friction_area", 120),
      affectedPersona: requireText(input.affectedPersona, "friction_persona", 160), frequency: requireText(input.frequency, "friction_frequency", 120),
      minutesLost: optionalNonNegativeInteger(input.minutesLost), impact: requireText(input.impact, "friction_impact", 2_000),
      currentWorkaround: optionalText(input.currentWorkaround), potentialOsSolution: optionalText(input.potentialOsSolution), potentialAiSolution: optionalText(input.potentialAiSolution),
      effortEstimate: oneOf(input.effortEstimate, ["unknown", "low", "medium", "high"] as const, "FRICTION_EFFORT_INVALID"),
      estimatedMinutesSaved: optionalNonNegativeInteger(input.estimatedMinutesSaved), priority: oneOf(input.priority, ["low", "medium", "high", "critical"] as const, "FRICTION_PRIORITY_INVALID"),
      status: "observed", createdBy: actor.user.id, createdAt: now, updatedAt: now,
    } });
    await appendAudit(db, { organizationId: scope.organizationId, actorId: actor.user.id, resourceType: "OperationalFriction", resourceId: id, action: "friction.record.create", partnerId: scope.partnerId, workspaceId: scope.workspaceId });
  });
}

export async function createAiWorkRequest(input: Readonly<Record<string, unknown>>): Promise<void> {
  const { actor, organizationId } = await requireInternalOperatingContext();
  const scope = await resolveScope(organizationId, input.workspaceId, input.projectId);
  const request = requireText(input.request, "ai_request", 8_000);
  const intent = requireText(input.intent, "ai_intent", 80);
  const selectedWorkflowKey = resolveWorkflowKey(intent);
  const brainRecords = await prisma.brainRecord.findMany({
    where: scope.workspaceId
      ? { organizationId: { in: [GLOBAL_KYRUMA_ORGANIZATION_ID, scope.organizationId] }, status: "active", OR: [{ organizationId: GLOBAL_KYRUMA_ORGANIZATION_ID, scopeType: "GLOBAL" }, { organizationId: scope.organizationId, workspaceId: scope.workspaceId }] }
      : { organizationId: GLOBAL_KYRUMA_ORGANIZATION_ID, status: "active", scopeType: "GLOBAL" },
    orderBy: { updatedAt: "desc" }, take: 20, select: { id: true, scopeType: true, dnaType: true, title: true, updatedAt: true },
  });
  const radarEntries = await prisma.radarEntry.findMany({
    where: { organizationId: { in: [GLOBAL_KYRUMA_ORGANIZATION_ID, scope.organizationId] }, status: { in: ["APPROVED", "ACTION", "TEST"] } },
    orderBy: { updatedAt: "desc" }, take: 10, select: { id: true, radarId: true, title: true, status: true, relatedModule: true },
  });
  const workflow = selectedWorkflowKey ? await prisma.contentWorkflowDefinition.findFirst({
    where: { organizationId: { in: [GLOBAL_KYRUMA_ORGANIZATION_ID, scope.organizationId] }, key: selectedWorkflowKey, status: "active" }, orderBy: { version: "desc" },
  }) : undefined;
  const id = randomUUID();
  const now = new Date();
  const contextSnapshot: Prisma.InputJsonObject = {
    organizationId: scope.organizationId, partnerId: scope.partnerId ?? null, workspaceId: scope.workspaceId ?? null, projectId: scope.projectId ?? null,
    brain: brainRecords.map((record) => ({ id: record.id, scope: record.scopeType, dna: record.dnaType, title: record.title, updatedAt: record.updatedAt.toISOString() })),
    radar: radarEntries,
    workflow: workflow ? { id: workflow.id, key: workflow.key, version: workflow.version } : null,
  };
  await prisma.$transaction(async (db) => {
    await db.aiWorkRequest.create({ data: {
      id, ...scope, request, intent, contextSnapshot, selectedWorkflowKey,
      status: "context_ready", humanReviewRequired: true, createdBy: actor.user.id, createdAt: now, updatedAt: now,
    } });
    if (workflow) {
      await db.contentWorkflowRun.create({ data: {
        id: randomUUID(), workflowId: workflow.id, ...scope, aiRequestId: id,
        input: { request }, status: "queued", requestedBy: actor.user.id, requestedAt: now,
      } });
    }
    await appendAudit(db, { organizationId: scope.organizationId, actorId: actor.user.id, resourceType: "AiWorkRequest", resourceId: id, action: "kyruma.ai.request", partnerId: scope.partnerId, workspaceId: scope.workspaceId, metadata: { intent, selectedWorkflowKey: selectedWorkflowKey ?? null, humanReviewRequired: true } });
  });
}
