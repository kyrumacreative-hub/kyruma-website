import type { TransactionRunner } from "../../lead-lifecycle/ports/TransactionRunner";
import { WorkspaceProvisioningService, WorkspaceActivationService } from "../domain/services";
import { WorkspaceSettings } from "../domain/entities";
import type { Workspace } from "../domain/workspace";
import { WorkspaceFactory } from "../domain/workspaceFactory";
import {
  CorrelationId,
  MembershipId,
  OrganizationId,
  PartnerId,
  WorkspaceId,
  WorkspaceMemberId,
  WorkspaceName,
} from "../domain/valueObjects";
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
  workspaceId: string;
  workspaceMemberId: string;
  partnerId: string;
  organizationId: string;
  initialOwnerMembershipId: string;
  name: string;
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
      return await this.deps.transactions.run((transaction) =>
        this.executeWithinTransaction(input, transaction),
      );
    } catch {
      throw new WorkspaceApplicationError(
        "Workspace provisioning failed.",
        "PERSISTENCE",
      );
    }
  }

  async executeWithinTransaction(
    input: ProvisionWorkspaceInput,
    transaction: Parameters<WorkspaceRepository["save"]>[1],
  ): Promise<Workspace> {
    const initialOwner = WorkspaceFactory.createInitialOwner({
      id: WorkspaceMemberId.create(input.workspaceMemberId),
      membershipId: MembershipId.create(input.initialOwnerMembershipId),
      joinedAt: input.metadata.occurredAt,
    });
    const workspace = WorkspaceFactory.create({
      id: WorkspaceId.create(input.workspaceId),
      partnerId: PartnerId.create(input.partnerId),
      organizationId: OrganizationId.create(input.organizationId),
      name: WorkspaceName.create(input.name),
      primary: true,
      initialOwner,
      settings: WorkspaceSettings.initial(),
      createdAt: input.metadata.occurredAt,
      correlationId: CorrelationId.create(input.metadata.correlationId),
    });
    new WorkspaceProvisioningService().provision(workspace, input.metadata);
    await this.deps.workspaces.save(workspace, transaction);
    return workspace;
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
