import type { LeadAggregate } from "../domain/lead";
import type { TransactionContext } from "./TransactionRunner";

export interface LeadRepository {
  save(lead: LeadAggregate, context: TransactionContext): Promise<void>;
  findById(id: string, context: TransactionContext): Promise<LeadAggregate | null>;
  findByOrganization(organizationId: string, context: TransactionContext): Promise<LeadAggregate[]>;
  findActiveByOrganization(organizationId: string, context: TransactionContext): Promise<LeadAggregate | null>;
  exists(id: string, context: TransactionContext): Promise<boolean>;
  update(lead: LeadAggregate, context: TransactionContext): Promise<void>;
}
