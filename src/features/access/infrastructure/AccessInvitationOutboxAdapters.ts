import { randomUUID } from "node:crypto";
import { AuditEvent } from "../../audit/domain/AuditEvent";
import type { AuditRepository } from "../../audit/ports/AuditRepository";
import type { EventBusRepository } from "../../event-bus/ports/EventBusRepository";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { AccessInvitationAudit, AccessInvitationEvents } from "../application/InviteUserUseCase";
import type { DeliveredInvitationAudit } from "../application/DeliverPartnerInvitationHandler";

export const PARTNER_INVITATION_REQUESTED = "partner.invitation.requested.v1";
export interface PartnerInvitationRequestedPayload { invitationId: string; tokenVersion: number }

export const isPartnerInvitationRequestedPayload = (value: unknown): value is PartnerInvitationRequestedPayload => {
  const payload = value as Partial<PartnerInvitationRequestedPayload> | null;
  return typeof payload?.invitationId === "string" && Number.isInteger(payload.tokenVersion) && Number(payload.tokenVersion) > 0;
};

export class AccessInvitationAuditAdapter implements AccessInvitationAudit, DeliveredInvitationAudit {
  constructor(private readonly audit: AuditRepository, private readonly now: () => Date = () => new Date(), private readonly newId: () => string = randomUUID) {}
  async recordRequested(input: Parameters<AccessInvitationAudit["recordRequested"]>[0], context: TransactionContext): Promise<void> {
    const at = this.now();
    await this.audit.append(new AuditEvent({ id: this.newId(), eventType: PARTNER_INVITATION_REQUESTED, occurredAt: at, recordedAt: at, actorId: input.actorId, actorType: "user", organizationId: input.invitation.scope.organizationId, partnerId: input.invitation.scope.partnerId ?? null, workspaceId: input.invitation.scope.workspaceId ?? null, resourceType: "AccessInvitation", resourceId: input.invitation.id, action: "partner.invitation.request", result: "success", correlationId: input.invitation.correlationId, causationId: null, requestId: null, source: "access", metadata: { role: input.invitation.role, tokenVersion: input.invitation.tokenVersion }, changes: { deliveryStatus: "pending" }, schemaVersion: 1, classification: "restricted_security", retentionCategory: "security_identity", policyVersion: "audit-v1" }), context);
  }
  async recordDelivered(input: Parameters<DeliveredInvitationAudit["recordDelivered"]>[0], context: TransactionContext): Promise<void> {
    const at = this.now();
    await this.audit.append(new AuditEvent({ id: this.newId(), eventType: "partner.invitation.delivered.v1", occurredAt: at, recordedAt: at, actorId: input.actorId, actorType: input.actorId === "event-bus" ? "system" : "user", organizationId: input.invitation.scope.organizationId, partnerId: input.invitation.scope.partnerId ?? null, workspaceId: input.invitation.scope.workspaceId ?? null, resourceType: "AccessInvitation", resourceId: input.invitation.id, action: "partner.invitation.deliver", result: "success", correlationId: input.invitation.correlationId, causationId: null, requestId: null, source: "access", metadata: { provider: "clerk" }, changes: { deliveryStatus: "delivered" }, schemaVersion: 1, classification: "restricted_security", retentionCategory: "security_identity", policyVersion: "audit-v1" }), context);
  }
}

export class AccessInvitationEventAdapter implements AccessInvitationEvents {
  constructor(private readonly events: EventBusRepository, private readonly now: () => Date = () => new Date(), private readonly newId: () => string = randomUUID) {}
  async publishRequested(input: Parameters<AccessInvitationEvents["publishRequested"]>[0], context: TransactionContext): Promise<{ eventId: string }> {
    const eventId = this.newId(); const at = this.now().toISOString();
    await this.events.append({ eventId, eventType: PARTNER_INVITATION_REQUESTED, eventVersion: 1, occurredAt: at, publishedAt: at, correlationId: input.invitation.correlationId, causationId: null, organizationId: input.invitation.scope.organizationId, partnerId: input.invitation.scope.partnerId, workspaceId: input.invitation.scope.workspaceId, actorId: input.actorId, source: "access", aggregateType: "AccessInvitation", aggregateId: input.invitation.id, payload: { invitationId: input.invitation.id, tokenVersion: input.invitation.tokenVersion }, metadata: { pii: false, processingDepth: 0 } }, context);
    return { eventId };
  }
}
