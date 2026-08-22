import { randomUUID } from "node:crypto";
import { authorize } from "../../identity/domain/authorization";
import type { AuthenticatedActor } from "../../identity/domain/types";
import type { Role } from "../../identity/domain/capabilities";
import type { TransactionContext, TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { issueAccessInvitation } from "../domain/invitations";
import type { AccessInvitation, AccessScope } from "../domain/types";
import type { InvitationTokenFactory } from "../ports/InvitationTokenFactory";

export interface AccessInvitationRepository {
  save(invitation: AccessInvitation, context: TransactionContext): Promise<void>;
  findActive(input: { normalizedEmail: string; scope: AccessScope; now: Date }, context: TransactionContext): Promise<AccessInvitation | null>;
}
export interface AccessInvitationAudit { recordRequested(input: { invitation: AccessInvitation; actorId: string }, context: TransactionContext): Promise<void> }
export interface AccessInvitationEvents { publishRequested(input: { invitation: AccessInvitation; actorId: string }, context: TransactionContext): Promise<{ eventId: string }> }

export class AccessInvitationAlreadyActiveError extends Error { readonly code = "ACCESS_INVITATION_ALREADY_ACTIVE"; }

interface Dependencies {
  transactions: TransactionRunner;
  repository: AccessInvitationRepository;
  audit: AccessInvitationAudit;
  events: AccessInvitationEvents;
  tokens: InvitationTokenFactory;
  now?: () => Date;
  newId?: () => string;
}

export class InviteUserUseCase {
  private readonly now: () => Date;
  private readonly newId: () => string;
  constructor(private readonly dependencies: Dependencies) { this.now = dependencies.now ?? (() => new Date()); this.newId = dependencies.newId ?? randomUUID; }

  async execute(actor: AuthenticatedActor, input: { email: string; role: Role; scope: AccessScope; correlationId: string; expiresAt: Date; tokenVersion?: number }): Promise<{ invitationId: string; eventId: string; status: "pending" }> {
    const decision = authorize(actor, { capability: "workspace.invite", resource: { ...input.scope, visibility: "internal" } });
    if (!decision.allowed) throw new Error(`ACCESS_INVITE_DENIED:${decision.reason}`);
    const invitationId = this.newId();
    const tokenVersion = input.tokenVersion ?? 1;
    const issued = issueAccessInvitation({ id: invitationId, ...input, tokenVersion, token: this.dependencies.tokens.create(invitationId, tokenVersion), createdBy: actor.user.id, now: this.now() });
    return this.dependencies.transactions.run(async (context) => {
      const existing = await this.dependencies.repository.findActive({ normalizedEmail: issued.invitation.email, scope: input.scope, now: this.now() }, context);
      if (existing) throw new AccessInvitationAlreadyActiveError("The partner already has an active invitation.");
      await this.dependencies.repository.save(issued.invitation, context);
      await this.dependencies.audit.recordRequested({ invitation: issued.invitation, actorId: actor.user.id }, context);
      const event = await this.dependencies.events.publishRequested({ invitation: issued.invitation, actorId: actor.user.id }, context);
      return { invitationId, eventId: event.eventId, status: "pending" as const };
    });
  }
}
