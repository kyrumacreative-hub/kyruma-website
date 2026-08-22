import type { PrismaClient } from "@prisma/client";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { AccessInvitationRepository } from "../application/InviteUserUseCase";
import type { AccessInvitation } from "../domain/types";

export class PrismaAccessInvitationRepository implements AccessInvitationRepository {
  constructor(private readonly client: PrismaClient, private readonly contexts?: PrismaTransactionContextStore) {}
  async save(invitation: AccessInvitation, context?: TransactionContext): Promise<void> {
    const db = context && this.contexts ? this.contexts.get(context) : this.client;
    await db.accessInvitation.create({ data: { id: invitation.id, organizationId: invitation.scope.organizationId, partnerId: invitation.scope.partnerId, workspaceId: invitation.scope.workspaceId, email: invitation.email, normalizedEmail: invitation.email, role: invitation.role, tokenHash: invitation.tokenHash, tokenVersion: invitation.tokenVersion, status: invitation.status, deliveryStatus: "pending", expiresAt: invitation.expiresAt, createdBy: invitation.createdBy, createdAt: invitation.createdAt, correlationId: invitation.correlationId } });
  }
  async findActive(input: { normalizedEmail: string; scope: AccessInvitation["scope"]; now: Date }, context: TransactionContext): Promise<AccessInvitation | null> {
    const row = await this.contexts!.get(context).accessInvitation.findFirst({ where: { normalizedEmail: input.normalizedEmail, organizationId: input.scope.organizationId, partnerId: input.scope.partnerId ?? null, workspaceId: input.scope.workspaceId ?? null, status: "pending", expiresAt: { gt: input.now } } });
    return row ? { id: row.id, email: row.normalizedEmail, role: row.role as AccessInvitation["role"], scope: { organizationId: row.organizationId, ...(row.partnerId ? { partnerId: row.partnerId } : {}), ...(row.workspaceId ? { workspaceId: row.workspaceId } : {}) }, tokenHash: row.tokenHash, tokenVersion: row.tokenVersion, status: row.status as AccessInvitation["status"], expiresAt: row.expiresAt, createdBy: row.createdBy, createdAt: row.createdAt, correlationId: row.correlationId, ...(row.acceptedBy ? { acceptedBy: row.acceptedBy } : {}), ...(row.acceptedAt ? { acceptedAt: row.acceptedAt } : {}), ...(row.revokedAt ? { revokedAt: row.revokedAt } : {}) } : null;
  }
  async findById(id: string): Promise<{ invitation: AccessInvitation; deliveryStatus: string; providerId: string | null } | null> {
    const row = await this.client.accessInvitation.findUnique({ where: { id } });
    return row ? { invitation: { id: row.id, email: row.normalizedEmail, role: row.role as AccessInvitation["role"], scope: { organizationId: row.organizationId, ...(row.partnerId ? { partnerId: row.partnerId } : {}), ...(row.workspaceId ? { workspaceId: row.workspaceId } : {}) }, tokenHash: row.tokenHash, tokenVersion: row.tokenVersion, status: row.status as AccessInvitation["status"], expiresAt: row.expiresAt, createdBy: row.createdBy, createdAt: row.createdAt, correlationId: row.correlationId }, deliveryStatus: row.deliveryStatus, providerId: row.providerId } : null;
  }
  async markDelivered(id: string, providerId: string, deliveredAt: Date, context: TransactionContext): Promise<void> {
    await this.contexts!.get(context).accessInvitation.update({ where: { id }, data: { deliveryStatus: "delivered", providerId, deliveredAt } });
  }
}
