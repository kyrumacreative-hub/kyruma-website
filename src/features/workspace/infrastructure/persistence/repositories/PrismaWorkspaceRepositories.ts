import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";
import type { Workspace } from "../../../domain/workspace";
import type { WorkspaceInvitation, WorkspaceMember, WorkspaceSettings } from "../../../domain/entities";
import type { WorkspaceInvitationRepository, WorkspaceMemberRepository, WorkspaceRepository, WorkspaceSettingsRepository } from "../../../ports/repositories";
import { WorkspacePersistenceNotConfiguredError } from "../WorkspacePersistenceNotConfiguredError";

/** Deliberate placeholders: Prisma adapters are added only with real PostgreSQL persistence. */
export class PrismaWorkspaceRepository implements WorkspaceRepository {
  async save(...args: [Workspace, TransactionContext]): Promise<void> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async update(...args: [Workspace, TransactionContext]): Promise<void> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async findById(...args: [string, TransactionContext]): Promise<Workspace | null> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async findPrimaryByPartner(...args: [string, TransactionContext]): Promise<Workspace | null> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async findByCorrelationId(...args: [string, TransactionContext]): Promise<Workspace | null> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
}
export class PrismaWorkspaceInvitationRepository implements WorkspaceInvitationRepository {
  async save(...args: [WorkspaceInvitation, string, TransactionContext]): Promise<void> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async update(...args: [WorkspaceInvitation, TransactionContext]): Promise<void> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async findById(...args: [string, TransactionContext]): Promise<WorkspaceInvitation | null> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
}
export class PrismaWorkspaceMemberRepository implements WorkspaceMemberRepository {
  async save(...args: [WorkspaceMember, string, TransactionContext]): Promise<void> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async update(...args: [WorkspaceMember, TransactionContext]): Promise<void> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async findByMembershipId(...args: [string, string, TransactionContext]): Promise<WorkspaceMember | null> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async listActive(...args: [string, TransactionContext]): Promise<WorkspaceMember[]> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
}
export class PrismaWorkspaceSettingsRepository implements WorkspaceSettingsRepository {
  async save(...args: [WorkspaceSettings, string, TransactionContext]): Promise<void> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
  async findCurrent(...args: [string, TransactionContext]): Promise<WorkspaceSettings | null> { void args; throw new WorkspacePersistenceNotConfiguredError(); }
}
