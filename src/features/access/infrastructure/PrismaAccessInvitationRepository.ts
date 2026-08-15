import type { PrismaClient } from "@prisma/client";
import type { AccessInvitationRepository } from "../application/InviteUserUseCase";
import type { AccessInvitation } from "../domain/types";

export class PrismaAccessInvitationRepository implements AccessInvitationRepository {
  constructor(private readonly client: PrismaClient) {}
  async save(invitation: AccessInvitation): Promise<void> { await this.client.accessInvitation.create({ data: { id: invitation.id, organizationId: invitation.scope.organizationId, partnerId: invitation.scope.partnerId, workspaceId: invitation.scope.workspaceId, email: invitation.email, normalizedEmail: invitation.email, role: invitation.role, tokenHash: invitation.tokenHash, status: invitation.status, expiresAt: invitation.expiresAt, createdBy: invitation.createdBy, createdAt: invitation.createdAt, correlationId: invitation.correlationId } }); }
}
