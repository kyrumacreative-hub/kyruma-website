import { ApplicationError } from "../application/useCases";
import { AuthorizationDeniedError } from "../../identity/application/requireAuthorization";
import { OrganizationContextAccessDeniedError } from "../../partner-context/application/requireOrganizationContextAccess";

export class InvalidHttpInputError extends Error { readonly code = "INVALID_INPUT"; }
export class MissingOrganizationContextError extends Error { readonly code = "CONTEXT_UNAVAILABLE"; }
export class InfrastructureNotConfiguredError extends Error { readonly code = "INFRASTRUCTURE_NOT_CONFIGURED"; }

export function mapHttpError(error: unknown): { status: number; code: string } {
  if (error instanceof InvalidHttpInputError) return { status: 400, code: error.code };
  if (error instanceof MissingOrganizationContextError) return { status: 401, code: error.code };
  if (error instanceof AuthorizationDeniedError || error instanceof OrganizationContextAccessDeniedError) return { status: 403, code: "ACCESS_DENIED" };
  if (error instanceof InfrastructureNotConfiguredError || (error instanceof ApplicationError && error.code === "LEAD_INFRASTRUCTURE_ERROR")) return { status: 503, code: "INFRASTRUCTURE_UNAVAILABLE" };
  if (error instanceof ApplicationError) {
    if (error.code === "LEAD_NOT_FOUND" || error.code === "DISCOVERY_NOT_FOUND") return { status: 404, code: error.code };
    if (error.code === "LEAD_CONTEXT_MISMATCH") return { status: 403, code: "ACCESS_DENIED" };
    if (["DUPLICATE_ACTIVE_LEAD", "QUALIFICATION_ALREADY_OPEN", "QUALIFICATION_NOT_ELIGIBLE", "LEAD_DOMAIN_ERROR"].includes(error.code)) return { status: 409, code: error.code };
    return { status: 400, code: error.code };
  }
  return { status: 500, code: "INTERNAL_ERROR" };
}
