import { clerkClient } from "@clerk/nextjs/server";
import type { AccessInvitationDelivery } from "../application/InviteUserUseCase";

export class ClerkAccessInvitationDelivery implements AccessInvitationDelivery {
  async send(input: { email: string; acceptanceUrl: string; expiresAt: Date }): Promise<void> {
    const remainingDays = Math.max(1, Math.ceil((input.expiresAt.getTime() - Date.now()) / 86_400_000));
    const client = await clerkClient();
    await client.invitations.createInvitation({ emailAddress: input.email, expiresInDays: remainingDays, redirectUrl: input.acceptanceUrl, notify: true, ignoreExisting: false });
  }
}
