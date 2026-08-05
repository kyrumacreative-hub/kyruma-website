import type { LeadAggregate } from "../../../domain/lead";
import type { LeadRepository } from "../../../ports/LeadRepository";

export class PersistenceAdapterNotConfiguredError extends Error { readonly code = "PERSISTENCE_ADAPTER_NOT_CONFIGURED"; }

export class PostgresLeadRepositoryAdapter implements LeadRepository {
  private unavailable(): never { throw new PersistenceAdapterNotConfiguredError("PostgreSQL adapter is not configured."); }
  async save(lead: LeadAggregate) { void lead; this.unavailable(); }
  async findById(id: string) { void id; return this.unavailable(); }
  async findByOrganization(organizationId: string) { void organizationId; return this.unavailable(); }
  async findActiveByOrganization(organizationId: string) { void organizationId; return this.unavailable(); }
  async exists(id: string) { void id; return this.unavailable(); }
  async update(lead: LeadAggregate) { void lead; this.unavailable(); }
}
