import type { Partner } from "../domain/partner";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
export interface PartnerRepository { save(partner: Partner, context: TransactionContext): Promise<void>; findByLeadId(leadId: string, context: TransactionContext): Promise<Partner | null>; }
export interface PartnerCodeSequenceRepository { allocate(context: TransactionContext): Promise<number>; }
export interface WorkspaceProvisioningRepository { savePrimary(input: { workspaceId: string; partnerId: string }, context: TransactionContext): Promise<void>; }
export interface InitialMembershipRepository { saveOwner(input: { membershipId: string; partnerId: string }, context: TransactionContext): Promise<void>; }
export interface PartnerCreationIdempotencyRepository { find(correlationId: string, context: TransactionContext): Promise<string | null>; save(correlationId: string, partnerId: string, context: TransactionContext): Promise<void>; }
