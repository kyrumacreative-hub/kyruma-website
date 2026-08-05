import type { InitialMembershipRepository } from "../../../ports/repositories";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";

export class PrismaInitialMembershipRepository implements InitialMembershipRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async saveOwner(input: { membershipId: string; partnerId: string }, context: TransactionContext): Promise<void> {
    await this.contexts.get(context).partnerMembership.create({ data: { id: input.membershipId, partnerId: input.partnerId, role: "owner", status: "active" } });
  }
}
