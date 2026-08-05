import { authorize } from "../../identity/domain/authorization";
import { effectiveCapabilities } from "../../identity/domain/capabilities";
import type { AuthenticatedActor, Membership } from "../../identity/domain/types";
import { isPartnerPublicId } from "../domain/partnerPublicId";
import { resolveWorkspace } from "../domain/workspace";
import type { ContextEvent, ContextSelection, PartnerContextRecord, ResolvedPartnerContext } from "../domain/types";
import type { ContextEventPublisher } from "../ports/ContextEventPublisher";
import type { PartnerContextRepository } from "../ports/PartnerContextRepository";

export class PartnerContextNotFoundError extends Error {
  constructor() { super("The requested partner context is not available."); }
}

export class PartnerContextUnauthorizedError extends Error {
  constructor() { super("The requested partner context is not available."); }
}

function actorWithMembership(actor: AuthenticatedActor, membership: Membership): AuthenticatedActor {
  return { ...actor, memberships: [membership] };
}

function selectMembership(actor: AuthenticatedActor, record: PartnerContextRecord, workspaceId: string) {
  return actor.memberships.find((membership) => {
    const scopedActor = actorWithMembership(actor, membership);
    const resource = { organizationId: record.organization.id, partnerId: record.partner.id, workspaceId, visibility: "shared" as const };
    return authorize(scopedActor, { capability: "partner.read", resource }).allowed
      && authorize(scopedActor, { capability: "workspace.read", resource }).allowed;
  });
}

function event(type: ContextEvent["type"], context: ResolvedPartnerContext): ContextEvent {
  return { type, occurredAt: new Date(), actorId: context.actor.user.id, partnerPublicId: context.partner.publicId, workspaceId: context.workspace.id };
}

export interface PartnerContextProvider {
  resolve(actor: AuthenticatedActor, selection: ContextSelection): Promise<ResolvedPartnerContext>;
}

export class DefaultPartnerContextProvider implements PartnerContextProvider {
  constructor(
    private readonly repository: PartnerContextRepository,
    private readonly events?: ContextEventPublisher,
  ) {}

  async resolve(actor: AuthenticatedActor, selection: ContextSelection): Promise<ResolvedPartnerContext> {
    if (!isPartnerPublicId(selection.partnerPublicId)) throw new PartnerContextNotFoundError();
    const record = await this.repository.findByPartnerPublicId(selection.partnerPublicId);
    if (!record || record.partner.publicId !== selection.partnerPublicId) throw new PartnerContextNotFoundError();

    const workspace = resolveWorkspace(record, selection.workspaceId);
    const membership = selectMembership(actor, record, workspace.id);
    if (!membership || ((membership.role === "partner" || membership.role === "viewer") && workspace.access !== "external_active")) {
      await this.events?.publish({ type: "ContextUnauthorized", occurredAt: new Date(), actorId: actor.user.id, partnerPublicId: record.partner.publicId, workspaceId: workspace.id, reason: "membership_or_capability_missing" });
      throw new PartnerContextUnauthorizedError();
    }

    const context: ResolvedPartnerContext = {
      contextKey: `${actor.user.id}:${membership.id}:${record.partner.id}:${workspace.id}`,
      actor,
      membership,
      organization: record.organization,
      partner: record.partner,
      workspace,
      capabilities: effectiveCapabilities(membership.role, membership.grants, membership.revocations),
      allowedVisibilities: membership.role === "partner" || membership.role === "viewer"
        ? ["shared", "partner_private", "public_link"]
        : ["internal", "shared", "partner_private", "public_link"],
    };

    await this.events?.publish(event("MembershipResolved", context));
    await this.events?.publish(event("PartnerContextResolved", context));
    await this.events?.publish(event("WorkspaceResolved", context));
    return context;
  }
}
