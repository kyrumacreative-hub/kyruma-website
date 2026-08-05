export interface PartnerCodeSequencePersistenceModel { nextValue: number; }
export interface PrimaryWorkspacePersistenceModel { workspaceId: string; partnerId: string; primary: true; }
export interface InitialOwnerMembershipPersistenceModel { membershipId: string; partnerId: string; role: "owner"; status: "active"; }
export interface PartnerCreationIdempotencyPersistenceModel { correlationId: string; partnerId: string; createdAt: Date; }
