import type { EventEnvelope } from "../../event-bus/domain/contracts";
import { NonRetryableEventError } from "../../event-bus/domain/errors";
import type { EventHandler } from "../../event-bus/ports/EventBusRepository";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import type { AccessInvitation } from "../domain/types";
import type { AccessInvitationGateway } from "../infrastructure/ClerkAccessInvitationDelivery";
import { isPartnerInvitationRequestedPayload } from "../infrastructure/AccessInvitationOutboxAdapters";
import type { InvitationTokenFactory } from "../ports/InvitationTokenFactory";

export interface DeliverableInvitationRepository {
  findById(id: string): Promise<{ invitation: AccessInvitation; deliveryStatus: string; providerId: string | null } | null>;
  markDelivered(id: string, providerId: string, deliveredAt: Date, context: TransactionContext): Promise<void>;
}
export interface DeliveredInvitationAudit { recordDelivered(input: { invitation: AccessInvitation; actorId: string }, context: TransactionContext): Promise<void> }

export class DeliverPartnerInvitationHandler implements EventHandler {
  constructor(private readonly repository: DeliverableInvitationRepository, private readonly gateway: AccessInvitationGateway, private readonly tokens: InvitationTokenFactory, private readonly transactions: TransactionRunner, private readonly audit: DeliveredInvitationAudit, private readonly publicOrigin: string, private readonly now: () => Date = () => new Date()) {}
  async handle(envelope: EventEnvelope): Promise<void> {
    if (!isPartnerInvitationRequestedPayload(envelope.payload)) throw new NonRetryableEventError("INVITATION_EVENT_INVALID", "Partner invitation event is invalid.");
    const current = await this.repository.findById(envelope.payload.invitationId);
    if (!current) throw new NonRetryableEventError("INVITATION_NOT_FOUND", "Partner invitation no longer exists.");
    if (current.deliveryStatus === "delivered" && current.providerId) return;
    if (current.invitation.status !== "pending" || current.invitation.expiresAt <= this.now()) throw new NonRetryableEventError("INVITATION_UNAVAILABLE", "Partner invitation is no longer deliverable.");
    const token = this.tokens.create(current.invitation.id, envelope.payload.tokenVersion);
    const acceptanceUrl = new URL("/access/accept", this.publicOrigin); acceptanceUrl.searchParams.set("token", token);
    const existing = await this.gateway.findPending({ email: current.invitation.email, invitationId: current.invitation.id });
    const delivered = existing ?? await this.gateway.create({ email: current.invitation.email, invitationId: current.invitation.id, workspaceId: current.invitation.scope.workspaceId, acceptanceUrl: acceptanceUrl.toString(), expiresInDays: Math.max(1, Math.ceil((current.invitation.expiresAt.getTime() - this.now().getTime()) / 86_400_000)) });
    await this.transactions.run(async (context) => { await this.repository.markDelivered(current.invitation.id, delivered.id, this.now(), context); await this.audit.recordDelivered({ invitation: current.invitation, actorId: envelope.actorId ?? "event-bus" }, context); });
  }
}
