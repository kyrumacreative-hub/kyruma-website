import type { LeadAggregate } from "../../../domain/lead";
import type { LeadRepository } from "../../../ports/LeadRepository";
import type { TransactionContext } from "../../../ports/TransactionRunner";

export class PersistenceAdapterNotConfiguredError extends Error { readonly code = "PERSISTENCE_ADAPTER_NOT_CONFIGURED"; }

export class PostgresLeadRepositoryAdapter implements LeadRepository {
  private unavailable(): never { throw new PersistenceAdapterNotConfiguredError("PostgreSQL adapter is not configured."); }
  async save(lead: LeadAggregate, context: TransactionContext) { void lead; void context; this.unavailable(); }
  async findById(id: string, context: TransactionContext) { void id; void context; return this.unavailable(); }
  async findByOrganization(organizationId: string, context: TransactionContext) { void organizationId; void context; return this.unavailable(); }
  async findActiveByOrganization(organizationId: string, context: TransactionContext) { void organizationId; void context; return this.unavailable(); }
  async exists(id: string, context: TransactionContext) { void id; void context; return this.unavailable(); }
  async update(lead: LeadAggregate, context: TransactionContext) { void lead; void context; this.unavailable(); }
}
