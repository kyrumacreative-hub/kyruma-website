import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { Partner } from "../domain/partner";

export interface PartnerRepository {
  save(
    partner: Partner,
    transaction: TransactionContext,
  ): Promise<void>;

  update(
    partner: Partner,
    transaction: TransactionContext,
  ): Promise<void>;

  findById(
    id: string,
    transaction: TransactionContext,
  ): Promise<Partner | null>;

  findByLeadId(
    leadId: string,
    transaction: TransactionContext,
  ): Promise<Partner | null>;
}


export interface PartnerCodeSequenceRepository {
  allocate(
    transaction: TransactionContext,
  ): Promise<number>;
}


export interface PartnerCreationIdempotencyRepository {
  find(
    correlationId: string,
    transaction: TransactionContext,
  ): Promise<string | null>;

  save(
    correlationId: string,
    partnerId: string,
    transaction: TransactionContext,
  ): Promise<void>;
}


export interface InitialMembershipRepository {
  saveOwner(
    input: {
      membershipId: string;
      partnerId: string;
    },
    transaction: TransactionContext,
  ): Promise<void>;
}


export interface WorkspaceProvisioningRepository {
  savePrimary(
    input: {
      workspaceId: string;
      partnerId: string;
    },
    transaction: TransactionContext,
  ): Promise<void>;
}