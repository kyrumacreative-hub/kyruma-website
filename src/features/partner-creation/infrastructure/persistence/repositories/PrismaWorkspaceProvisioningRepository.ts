import type { WorkspaceProvisioningRepository } from "../../../ports/repositories";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";

export class PrismaWorkspaceProvisioningRepository implements WorkspaceProvisioningRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async savePrimary(input: { workspaceId: string; partnerId: string }, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).partnerWorkspace.create({ data: { id: input.workspaceId, partnerId: input.partnerId, primary: true } });
  }
}
