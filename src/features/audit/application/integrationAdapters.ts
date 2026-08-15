import { randomUUID } from "node:crypto";
import type { AuditRecorder as EventBusAuditRecorderPort } from "../../event-bus/ports/EventBusRepository";
import type { AuditContextRecorder, LeadAuditContext } from "../../lead-lifecycle/ports/AuditContextRecorder";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import { AuditContractRegistry } from "../domain/contracts";
import { RecordAuditEventUseCase } from "./useCases";

export const createKyrumaAuditContractRegistry = (): AuditContractRegistry => {
  const contracts = new AuditContractRegistry();
  contracts.register({ eventType: "lead.operation.recorded.v1", schemaVersion: 1, metadataFields: ["membershipId"], changeFields: [] });
  contracts.register({ eventType: "event-bus.dead-letter.reprocessed.v1", schemaVersion: 1, metadataFields: ["eventId"], changeFields: ["deliveryStatus"] });
  contracts.register({ eventType: "audit.export.completed.v1", schemaVersion: 1, metadataFields: ["format", "profile", "reason"], changeFields: ["rowCount"] });
  contracts.register({ eventType: "audit.retention.applied.v1", schemaVersion: 1, metadataFields: ["policyVersion", "category"], changeFields: ["affectedCount"] });
  return contracts;
};

export class LeadAuditRecorderAdapter implements AuditContextRecorder {
  constructor(private readonly recorder: RecordAuditEventUseCase, private readonly newId: () => string = randomUUID) {}
  record(entry: LeadAuditContext, context: TransactionContext): Promise<void> {
    return this.recorder.execute({ eventType: "lead.operation.recorded.v1", occurredAt: entry.timestamp, actorId: entry.actorId, actorType: "user", organizationId: entry.organizationId, partnerId: null, workspaceId: null, resourceType: "LeadOperation", resourceId: this.newId(), action: entry.action, result: "success", correlationId: this.newId(), causationId: null, requestId: null, source: "lead-lifecycle", metadata: { membershipId: entry.membershipId }, changes: {}, schemaVersion: 1, classification: "internal", retentionCategory: "operational_activity", policyVersion: "audit-v1" }, context).then(() => undefined);
  }
}

export class EventBusAuditRecorderAdapter implements EventBusAuditRecorderPort {
  constructor(private readonly recorder: RecordAuditEventUseCase) {}
  recordDeadLetterReprocessed(input: { organizationId: string; eventId: string; deliveryId: string; actorId: string; occurredAt: Date }, context: TransactionContext): Promise<void> {
    return this.recorder.execute({ eventType: "event-bus.dead-letter.reprocessed.v1", occurredAt: input.occurredAt, actorId: input.actorId, actorType: "user", organizationId: input.organizationId, partnerId: null, workspaceId: null, resourceType: "EventProcessingRecord", resourceId: input.deliveryId, action: "dead-letter.reprocess", result: "success", correlationId: input.eventId, causationId: input.eventId, requestId: null, source: "event-bus", metadata: { eventId: input.eventId }, changes: { deliveryStatus: "pending" }, schemaVersion: 1, classification: "restricted_security", retentionCategory: "operational_activity", policyVersion: "audit-v1" }, context).then(() => undefined);
  }
}
