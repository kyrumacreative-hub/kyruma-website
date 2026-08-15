import { randomUUID } from "node:crypto";
import { authorize } from "../../identity/domain/authorization";
import type { AuthenticatedActor } from "../../identity/domain/types";
import type { Role } from "../../identity/domain/capabilities";
import { issueAccessInvitation } from "../domain/invitations";
import type { AccessInvitation, AccessScope } from "../domain/types";

export interface AccessInvitationRepository { save(invitation: AccessInvitation): Promise<void> }
export interface AccessInvitationDelivery { send(input: { email: string; acceptanceUrl: string; expiresAt: Date }): Promise<void> }

export class InviteUserUseCase {
  constructor(private readonly repository: AccessInvitationRepository, private readonly delivery: AccessInvitationDelivery, private readonly publicOrigin: string, private readonly now: () => Date = () => new Date(), private readonly newId: () => string = randomUUID) {}
  async execute(actor: AuthenticatedActor, input: { email: string; role: Role; scope: AccessScope; correlationId: string; expiresAt: Date }): Promise<{ invitationId: string }> {
    const decision = authorize(actor, { capability: "workspace.invite", resource: { ...input.scope, visibility: "internal" } });
    if (!decision.allowed) throw new Error(`ACCESS_INVITE_DENIED:${decision.reason}`);
    const issued = issueAccessInvitation({ id: this.newId(), ...input, createdBy: actor.user.id, now: this.now() });
    await this.repository.save(issued.invitation);
    const acceptanceUrl = new URL("/access/accept", this.publicOrigin); acceptanceUrl.searchParams.set("token", issued.token);
    await this.delivery.send({ email: issued.invitation.email, acceptanceUrl: acceptanceUrl.toString(), expiresAt: issued.invitation.expiresAt });
    return { invitationId: issued.invitation.id };
  }
}

