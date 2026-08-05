import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import type { DomainOperationMetadata } from "../domain/services";
import type { CreateLeadInput } from "../domain/types";
import type { DiscoveryStatusView } from "../ports/DiscoveryReadRepository";
import type { OwnershipRecord } from "../ports/OwnershipRepository";
import type {
  ChangeLeadOwnerInput, CompleteQualificationInput, CreatePartnerInput, LeadResult, PartnerCreatedResult, StartDiscoveryInput,
} from "../application/useCases";
import type {
  ArchiveLeadInput, GetDiscoveryStatusInput, GetLeadInput, GetOwnershipHistoryInput, LeadDetails, ReactivateLeadInput, StartQualificationInput, UpdateLeadInput,
} from "../application/completionUseCases";

export interface InternalApiRequest { params?: Record<string, string | undefined>; query?: Record<string, string | undefined>; body?: unknown; headers?: Readonly<Record<string, string | undefined>>; }
export interface InternalApiResponse<T = unknown> { status: number; body: { ok: true; data: T } | { ok: false; error: { code: string } }; }

/** Future session adapters resolve trusted Foundation context; controllers never manufacture it. */
export interface OrganizationContextAdapter { resolve(request: InternalApiRequest): Promise<ResolvedOrganizationContext>; }
export interface OperationMetadataFactory { create(context: ResolvedOrganizationContext, request: InternalApiRequest): DomainOperationMetadata; }

export interface CreateLeadHandler { execute(input: CreateLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface GetLeadHandler { execute(input: GetLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadDetails>; }
export interface UpdateLeadHandler { execute(input: UpdateLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface ArchiveLeadHandler { execute(input: ArchiveLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface ReactivateLeadHandler { execute(input: ReactivateLeadInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface ChangeOwnerHandler { execute(input: ChangeLeadOwnerInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface OwnershipHistoryHandler { execute(input: GetOwnershipHistoryInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<readonly OwnershipRecord[]>; }
export interface StartDiscoveryHandler { execute(input: StartDiscoveryInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface DiscoveryStatusHandler { execute(input: GetDiscoveryStatusInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<DiscoveryStatusView>; }
export interface StartQualificationHandler { execute(input: StartQualificationInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface CompleteQualificationHandler { execute(input: CompleteQualificationInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<LeadResult>; }
export interface CreatePartnerHandler { execute(input: CreatePartnerInput, context: ResolvedOrganizationContext, operation: DomainOperationMetadata): Promise<PartnerCreatedResult>; }

export interface LeadLifecycleApiDependencies {
  contextAdapter: OrganizationContextAdapter;
  operationMetadata: OperationMetadataFactory;
  createLead: CreateLeadHandler;
  getLead: GetLeadHandler;
  updateLead: UpdateLeadHandler;
  archiveLead: ArchiveLeadHandler;
  reactivateLead: ReactivateLeadHandler;
  changeOwner: ChangeOwnerHandler;
  ownershipHistory: OwnershipHistoryHandler;
  startDiscovery: StartDiscoveryHandler;
  discoveryStatus: DiscoveryStatusHandler;
  startQualification: StartQualificationHandler;
  completeQualification: CompleteQualificationHandler;
  createPartner: CreatePartnerHandler;
}
