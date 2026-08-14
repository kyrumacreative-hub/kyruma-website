import type { Workspace } from "../../domain/workspace";
import type { TransactionContext } from "../../../lead-lifecycle/ports/TransactionRunner";
import type {
  ProvisionWorkspaceInput,
  ProvisionWorkspaceUseCase,
} from "../useCases";

export type WorkspaceProvisionerInput = ProvisionWorkspaceInput;

/** Cross-domain boundary used by Partner Creation to request provisioning. */
export interface PartnerWorkspaceProvisioningPort {
  provision(
    input: WorkspaceProvisionerInput,
    transaction: TransactionContext,
  ): Promise<Workspace>;
}

/** @deprecated Prefer PartnerWorkspaceProvisioningPort at cross-domain boundaries. */
export type WorkspaceProvisioner = PartnerWorkspaceProvisioningPort;

export class DefaultWorkspaceProvisioner implements PartnerWorkspaceProvisioningPort {
  constructor(private readonly useCase: ProvisionWorkspaceUseCase) {}

  async provision(
    input: WorkspaceProvisionerInput,
    transaction: TransactionContext,
  ): Promise<Workspace> {
    return this.useCase.executeWithinTransaction(input, transaction);
  }
}
