import { clerkClient } from "@clerk/nextjs/server";

export interface DeliveredInvitation { id: string }
export interface AccessInvitationGateway {
  findPending(input: { email: string; invitationId: string }): Promise<DeliveredInvitation | null>;
  create(input: { email: string; invitationId: string; workspaceId?: string; acceptanceUrl: string; expiresInDays: number }): Promise<DeliveredInvitation>;
}

export class ClerkAccessInvitationDelivery implements AccessInvitationGateway {
  async findPending(input: { email: string; invitationId: string }): Promise<DeliveredInvitation | null> {
    const client = await clerkClient();
    const result = await client.invitations.getInvitationList({ query: input.email, status: "pending", limit: 100 });
    const invitation = result.data.find((item) => item.emailAddress.toLowerCase() === input.email.toLowerCase() && item.publicMetadata?.invitationId === input.invitationId);
    return invitation ? { id: invitation.id } : null;
  }
  async create(input: { email: string; invitationId: string; workspaceId?: string; acceptanceUrl: string; expiresInDays: number }): Promise<DeliveredInvitation> {
    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({ emailAddress: input.email, expiresInDays: input.expiresInDays, redirectUrl: input.acceptanceUrl, notify: true, ignoreExisting: false, publicMetadata: { invitationId: input.invitationId, ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}) } });
    return { id: invitation.id };
  }
}
