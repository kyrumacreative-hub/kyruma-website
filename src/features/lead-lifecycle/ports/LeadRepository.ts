import type { LeadAggregate } from "../domain/lead";

export interface LeadRepository {
  save(lead: LeadAggregate): Promise<void>;
  findById(id: string): Promise<LeadAggregate | null>;
  findByOrganization(organizationId: string): Promise<LeadAggregate[]>;
  findActiveByOrganization(organizationId: string): Promise<LeadAggregate | null>;
  exists(id: string): Promise<boolean>;
  update(lead: LeadAggregate): Promise<void>;
}
