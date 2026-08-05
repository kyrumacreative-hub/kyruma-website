import { authorize } from "../domain/authorization";
import type { AuthenticatedActor, AuthorizationRequest } from "../domain/types";

export class AuthorizationDeniedError extends Error {
  readonly code = "AUTHORIZATION_DENIED";

  constructor() {
    super("You do not have permission to perform this action.");
  }
}

/** Server-side use-case guard. UI visibility must never replace this check. */
export function requireAuthorization(actor: AuthenticatedActor, request: AuthorizationRequest) {
  const decision = authorize(actor, request);
  if (!decision.allowed) throw new AuthorizationDeniedError();
  return decision;
}
