import { randomUUID } from "node:crypto";
import type { Capability } from "../../identity/domain/capabilities";
import type { ResolvedOrganizationContext, ResolvedPartnerContext } from "../../partner-context/domain/types";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { AuditEvent } from "../domain/AuditEvent";
import { AuditContractRegistry } from "../domain/contracts";
import { AuditAuthorizationError, AuditExportUnavailableError, AuditIntegrityConflictError, AuditNotFoundError } from "../domain/errors";
import type { ExportPolicy, RetentionPolicy } from "../domain/policies";
import type { AuditWriteRequest, RetentionCategory } from "../domain/types";
import type { AuditExportArtifactPort } from "../ports/AuditExportArtifactPort";
import type { AuditRepository, AuditSearchPage, AuditSearchQuery } from "../ports/AuditRepository";
import type { Clock } from "../ports/Clock";

type AuditContext = ResolvedOrganizationContext | ResolvedPartnerContext;
const requireCapability = (context: AuditContext, capability: Capability): void => { if (!context.capabilities.has(capability)) throw new AuditAuthorizationError(); };
const sameEvidence = (left: AuditEvent, right: AuditEvent): boolean => {
  const comparable = (event: AuditEvent) => ({ ...event.properties, id: undefined, recordedAt: undefined });
  return JSON.stringify(comparable(left)) === JSON.stringify(comparable(right));
};

export class RecordAuditEventUseCase {
  constructor(private readonly repository: AuditRepository, private readonly contracts: AuditContractRegistry, private readonly clock: Clock, private readonly newId: () => string = randomUUID) {}
  async execute(request: AuditWriteRequest, context: TransactionContext): Promise<AuditEvent> {
    this.contracts.validate(request);
    const event = new AuditEvent({ ...request, id: request.id ?? this.newId(), recordedAt: this.clock.now() });
    const existing = await this.repository.findIdempotent(event, context);
    if (existing) { if (!sameEvidence(existing, event)) throw new AuditIntegrityConflictError(); return existing; }
    return this.repository.append(event, context);
  }
}

export class GetAuditEventUseCase {
  constructor(private readonly repository: AuditRepository) {}
  async execute(input: { context: AuditContext; auditEventId: string }): Promise<AuditEvent> { requireCapability(input.context, "audit.read"); const event = await this.repository.findById(input.auditEventId, input.context.organization.id); if (!event) throw new AuditNotFoundError(); if (event.properties.classification === "restricted_security") requireCapability(input.context, "audit.read.security"); return event; }
}

export class SearchAuditEventsUseCase {
  constructor(private readonly repository: AuditRepository) {}
  execute(input: { context: AuditContext; query: Omit<AuditSearchQuery, "organizationId" | "includeRestrictedSecurity"> }): Promise<AuditSearchPage> { requireCapability(input.context, "audit.read"); return this.repository.search({ ...input.query, organizationId: input.context.organization.id, includeRestrictedSecurity: input.context.capabilities.has("audit.read.security") }); }
}

export class ExportAuditEventsUseCase {
  constructor(private readonly search: SearchAuditEventsUseCase, private readonly artifacts: AuditExportArtifactPort, private readonly repository: AuditRepository, private readonly recorder: RecordAuditEventUseCase, private readonly transactions: TransactionRunner, private readonly clock: Clock, private readonly policy: ExportPolicy, private readonly newId: () => string = randomUUID) {}
  async execute(input: { context: AuditContext; from: Date; to: Date; format: "json" | "csv"; profile: string; reason: string; correlationId: string }): Promise<{ exportId: string; artifactReference: string; expiresAt: Date }> {
    requireCapability(input.context, "audit.export");
    if (input.to.getTime() - input.from.getTime() > this.policy.maxRangeDays * 86_400_000) throw new AuditExportUnavailableError();
    const page = await this.search.execute({ context: input.context, query: { from: input.from, to: input.to, limit: this.policy.maxRows } });
    const expiresAt = new Date(this.clock.now().getTime() + this.policy.expiresAfterMinutes * 60_000);
    const artifact = await this.artifacts.generate({ organizationId: input.context.organization.id, events: page.events, format: input.format, profile: input.profile, expiresAt });
    const exportId = this.newId();
    await this.transactions.run(async (transaction) => {
      await this.repository.saveExport({ id: exportId, organizationId: input.context.organization.id, requestedBy: input.context.actor.user.id, from: input.from, to: input.to, format: input.format, profile: input.profile, rowCount: artifact.rowCount, artifactReference: artifact.reference, expiresAt, createdAt: this.clock.now() }, transaction);
      await this.recorder.execute({ eventType: "audit.export.completed.v1", occurredAt: this.clock.now(), actorId: input.context.actor.user.id, actorType: "user", organizationId: input.context.organization.id, partnerId: "partner" in input.context ? input.context.partner.id : null, workspaceId: "workspace" in input.context ? input.context.workspace.id : null, resourceType: "AuditExport", resourceId: exportId, action: "export", result: "success", correlationId: input.correlationId, causationId: null, requestId: null, source: "audit", metadata: { format: input.format, profile: input.profile, reason: input.reason }, changes: { rowCount: artifact.rowCount }, schemaVersion: 1, classification: "restricted_security", retentionCategory: "export_privacy", policyVersion: "audit-v1" }, transaction);
    });
    return { exportId, artifactReference: artifact.reference, expiresAt };
  }
}

export class ApplyRetentionPolicyUseCase {
  constructor(private readonly repository: AuditRepository, private readonly recorder: RecordAuditEventUseCase, private readonly transactions: TransactionRunner, private readonly clock: Clock, private readonly newId: () => string = randomUUID) {}
  async execute(input: { context: AuditContext; policy: RetentionPolicy; category: RetentionCategory; dryRun: boolean; correlationId: string }): Promise<{ executionId: string; affectedCount: number }> {
    requireCapability(input.context, "audit.retention.manage");
    const rule = input.policy.rules.find((candidate) => candidate.category === input.category); if (!rule) throw new AuditNotFoundError();
    const before = new Date(this.clock.now().getTime() - rule.afterDays * 86_400_000);
    const affectedCount = await this.repository.countRetentionCandidates({ organizationId: input.context.organization.id, category: input.category, before });
    const executionId = this.newId();
    await this.transactions.run(async (transaction) => {
      await this.repository.saveRetentionExecution({ id: executionId, organizationId: input.context.organization.id, policyVersion: input.policy.version, category: input.category, dryRun: input.dryRun, affectedCount, executedBy: input.context.actor.user.id, executedAt: this.clock.now() }, transaction);
      await this.recorder.execute({ eventType: "audit.retention.applied.v1", occurredAt: this.clock.now(), actorId: input.context.actor.user.id, actorType: "user", organizationId: input.context.organization.id, partnerId: null, workspaceId: null, resourceType: "AuditRetentionExecution", resourceId: executionId, action: input.dryRun ? "retention.dry-run" : "retention.apply", result: "success", correlationId: input.correlationId, causationId: null, requestId: null, source: "audit", metadata: { policyVersion: input.policy.version, category: input.category }, changes: { affectedCount }, schemaVersion: 1, classification: "restricted_security", retentionCategory: "export_privacy", policyVersion: input.policy.version }, transaction);
    });
    return { executionId, affectedCount };
  }
}
