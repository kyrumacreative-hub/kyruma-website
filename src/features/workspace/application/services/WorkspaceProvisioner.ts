import type { Workspace } from "../../domain/workspace";
import type { TransactionContext } from "../../../lead-lifecycle/ports/TransactionRunner";
import type { ProvisionWorkspaceInput, ProvisionWorkspaceUseCase } from "../useCases";

export type WorkspaceProvisionerInput = ProvisionWorkspaceInput;

export interface WorkspaceProvisioner {
  provision(
    input: WorkspaceProvisionerInput,
    transaction: TransactionContext,
  ): Promise<Workspace>;
}

export class DefaultWorkspaceProvisioner
  implements WorkspaceProvisioner
{
  constructor(
    private readonly useCase: ProvisionWorkspaceUseCase,
  ) {}

  async provision(
    input: WorkspaceProvisionerInput,
    transaction: TransactionContext,
  ): Promise<Workspace> {
    return this.useCase.executeWithinTransaction(input, transaction);
  }
}
