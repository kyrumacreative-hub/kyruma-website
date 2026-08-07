import type { TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { WorkspaceProvisioningService, WorkspaceActivationService } from "../domain/services";
import type { Workspace } from "../domain/workspace";
import type { WorkspaceRepository } from "../ports/repositories";

export type WorkspaceApplicationErrorCode =
  | "NOT_FOUND"
  | "PERSISTENCE";

export class WorkspaceApplicationError extends Error {
  constructor(
    message: string,
    readonly code: WorkspaceApplicationErrorCode,
  ) {
    super(message);
  }
}

type Dependencies = {
  transactions: TransactionRunner;
  workspaces: WorkspaceRepository;
};

export interface ProvisionWorkspaceInput {
  workspace: Workspace;
  metadata: {
    eventId: string;
    occurredAt: Date;
    correlationId: string;
    actorId: string;
  };
}

export interface ActivateWorkspaceInput {
  workspaceId: string;
  metadata: {
    eventId: string;
    occurredAt: Date;
    correlationId: string;
    actorId: string;
  };
}

export class ProvisionWorkspaceUseCase {
  constructor(
    private readonly deps: Dependencies,
  ) {}

  async execute(input: ProvisionWorkspaceInput): Promise<Workspace> {
    try {
      return await this.deps.transactions.run(async (transaction) => {
        const workspace =
          new WorkspaceProvisioningService().provision(
            input.workspace,
            input.metadata,
          );

        await this.deps.workspaces.save(
          workspace,
          transaction,
        );

        return workspace;
      });
    } catch {
      throw new WorkspaceApplicationError(
        "Workspace provisioning failed.",
        "PERSISTENCE",
      );
    }
  }
}

export class ActivateWorkspaceUseCase {
  constructor(
    private readonly deps: Dependencies,
  ) {}

  async execute(input: ActivateWorkspaceInput): Promise<Workspace> {
    try {
      return await this.deps.transactions.run(async (transaction) => {
        const workspace =
          await this.deps.workspaces.findById(
            input.workspaceId,
            transaction,
          );

        if (!workspace) {
          throw new WorkspaceApplicationError(
            "Workspace not found.",
            "NOT_FOUND",
          );
        }

        new WorkspaceActivationService().activate(
          workspace,
          input.metadata,
        );

        await this.deps.workspaces.update(
          workspace,
          transaction,
        );

        return workspace;
      });
    } catch (error) {
      if (error instanceof WorkspaceApplicationError) {
        throw error;
      }

      throw new WorkspaceApplicationError(
        "Workspace activation failed.",
        "PERSISTENCE",
      );
    }
  }
}