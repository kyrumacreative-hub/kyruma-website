import { clerkClient } from "@clerk/nextjs/server";

export interface DeliveredInvitation { id: string }
export interface AccessInvitationGateway {
  findPending(input: { email: string; invitationId: string }): Promise<DeliveredInvitation | null>;
  create(input: { email: string; invitationId: string; workspaceId?: string; acceptanceUrl: string; expiresInDays: number }): Promise<DeliveredInvitation>;
}

export class AccessInvitationDeliveryError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly retryable: boolean,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "AccessInvitationDeliveryError";
  }
}

interface ClerkResponseError {
  status: number;
  errors: Array<{ code?: unknown }>;
}

function isClerkResponseError(error: unknown): error is ClerkResponseError {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { status?: unknown; errors?: unknown };
  return typeof candidate.status === "number" && Array.isArray(candidate.errors);
}

export function toAccessInvitationDeliveryError(error: unknown): AccessInvitationDeliveryError {
  if (isClerkResponseError(error)) {
    const primary = error.errors[0];
    const providerCode = typeof primary?.code === "string"
      ? primary.code.replace(/[^a-zA-Z0-9_]+/g, "_").toUpperCase().slice(0, 80)
      : "";
    const code = providerCode ? `CLERK_${providerCode}` : `CLERK_HTTP_${error.status}`;
    return new AccessInvitationDeliveryError(
      code,
      `Clerk invitation failed (${error.status}: ${code}).`,
      error.status === 408 || error.status === 429 || error.status >= 500,
      { cause: error },
    );
  }

  return new AccessInvitationDeliveryError(
    "CLERK_INVITATION_REQUEST_FAILED",
    "Clerk invitation request failed before a safe provider response was received.",
    true,
    { cause: error },
  );
}

export class ClerkAccessInvitationDelivery implements AccessInvitationGateway {
  async findPending(input: { email: string; invitationId: string }): Promise<DeliveredInvitation | null> {
    try {
      const client = await clerkClient();
      const result = await client.invitations.getInvitationList({ query: input.email, status: "pending", limit: 100 });
      const invitation = result.data.find((item) => item.emailAddress.toLowerCase() === input.email.toLowerCase() && item.publicMetadata?.invitationId === input.invitationId);
      return invitation ? { id: invitation.id } : null;
    } catch (error) {
      throw toAccessInvitationDeliveryError(error);
    }
  }
  async create(input: { email: string; invitationId: string; workspaceId?: string; acceptanceUrl: string; expiresInDays: number }): Promise<DeliveredInvitation> {
    try {
      const client = await clerkClient();
      const invitation = await client.invitations.createInvitation({
        emailAddress: input.email,
        expiresInDays: input.expiresInDays,
        redirectUrl: input.acceptanceUrl,
        notify: true,
        // The custom acceptance flow validates the authenticated email and must
        // also support partners who already have a Clerk identity.
        ignoreExisting: true,
        publicMetadata: {
          invitationId: input.invitationId,
          ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
        },
      });
      return { id: invitation.id };
    } catch (error) {
      throw toAccessInvitationDeliveryError(error);
    }
  }
}
