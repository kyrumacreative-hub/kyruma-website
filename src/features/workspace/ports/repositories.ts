import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { Workspace } from "../domain/workspace";
import type { WorkspaceInvitation, WorkspaceMember, WorkspaceSettings } from "../domain/entities";

export interface WorkspaceRepository {
  save(workspace: Workspace, context: TransactionContext): Promise<void>;
  update(workspace: Workspace, context: TransactionContext): Promise<void>;
  findById(workspaceId: string, context: TransactionContext): Promise<Workspace | null>;
  findPrimaryByPartner(partnerId: string, context: TransactionContext): Promise<Workspace | null>;
  findByCorrelationId(correlationId: string, context: TransactionContext): Promise<Workspace | null>;
}
export interface WorkspaceInvitationRepository {
  save(invitation: WorkspaceInvitation, workspaceId: string, context: TransactionContext): Promise<void>;
  update(invitation: WorkspaceInvitation, context: TransactionContext): Promise<void>;
  findById(invitationId: string, context: TransactionContext): Promise<WorkspaceInvitation | null>;
}
export interface WorkspaceMemberRepository {
  save(member: WorkspaceMember, workspaceId: string, context: TransactionContext): Promise<void>;
  update(member: WorkspaceMember, context: TransactionContext): Promise<void>;
  findByMembershipId(workspaceId: string, membershipId: string, context: TransactionContext): Promise<WorkspaceMember | null>;
  listActive(workspaceId: string, context: TransactionContext): Promise<WorkspaceMember[]>;
}
export interface WorkspaceSettingsRepository {
  save(settings: WorkspaceSettings, workspaceId: string, context: TransactionContext): Promise<void>;
  findCurrent(workspaceId: string, context: TransactionContext): Promise<WorkspaceSettings | null>;
}
