import type { AuthenticatedActor } from "@/features/identity/domain/types";
import type { ContextSelection, ResolvedPartnerContext } from "../domain/types";
import type { ContextEventPublisher } from "../ports/ContextEventPublisher";
import type { PartnerContextProvider } from "./PartnerContextProvider";

export interface ContextSwitchResult {
  context: ResolvedPartnerContext;
  invalidatedContextKey?: string;
}

/**
 * Stateless by design: the caller owns request/client cache invalidation.
 * The returned invalidated key tells consumers exactly which context to discard.
 */
export async function switchPartnerContext(input: {
  actor: AuthenticatedActor;
  selection: ContextSelection;
  provider: PartnerContextProvider;
  events?: ContextEventPublisher;
  currentContext?: ResolvedPartnerContext;
}): Promise<ContextSwitchResult> {
  const context = await input.provider.resolve(input.actor, input.selection);
  const previousContextKey = input.currentContext?.contextKey;
  if (previousContextKey && previousContextKey !== context.contextKey) {
    await input.events?.publish({ type: "PartnerContextChanged", occurredAt: new Date(), actorId: input.actor.user.id, partnerPublicId: context.partner.publicId, workspaceId: context.workspace.id, previousContextKey });
  }
  return { context, invalidatedContextKey: previousContextKey === context.contextKey ? undefined : previousContextKey };
}
