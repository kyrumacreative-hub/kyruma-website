import { LeadAggregate } from "../../domain/lead";
import { ContactId, LeadId, LeadOrigin, LeadStatus, OrganizationId, OwnerId } from "../../domain/valueObjects";

export interface LeadPersistenceModel { id: string; organizationId: string; ownerId: string; primaryContactId: string; origin: string; status: string; createdAt: Date; createdBy: string; archivedAt?: Date | null; archivedBy?: string | null; archiveReason?: string | null; }

export const LeadMapper = {
  toPersistence(lead: LeadAggregate): LeadPersistenceModel {
    return { id: lead.id.value, organizationId: lead.organizationId.value, ownerId: lead.ownerId.value, primaryContactId: lead.primaryContactId.value, origin: lead.origin.value, status: lead.status.value, createdAt: lead.createdAt, createdBy: lead.createdBy, archivedAt: lead.archivedAt, archivedBy: lead.archivedBy, archiveReason: lead.archiveReason };
  },
  toDomain(model: LeadPersistenceModel): LeadAggregate {
    return new LeadAggregate({ id: LeadId.create(model.id), organizationId: OrganizationId.create(model.organizationId), ownerId: OwnerId.create(model.ownerId), primaryContactId: ContactId.create(model.primaryContactId), origin: LeadOrigin.create(model.origin), status: LeadStatus.create(model.status), createdAt: model.createdAt, createdBy: model.createdBy, archivedAt: model.archivedAt ?? undefined, archivedBy: model.archivedBy ?? undefined, archiveReason: model.archiveReason ?? undefined });
  },
};
