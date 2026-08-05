import type { OrganizationContext } from "../domain/types";

/** Read port for approved pre-Partner organization scopes. */
export interface OrganizationContextRepository {
  findByOrganizationId(organizationId: string): Promise<OrganizationContext | null>;
}
