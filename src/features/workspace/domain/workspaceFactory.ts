import { WorkspaceMember, WorkspaceSettings } from "./entities";
import { Workspace, type WorkspaceProperties } from "./workspace";

/** The sole domain entry point for an initial, primary Workspace. */
export class WorkspaceFactory {
  static create(properties: WorkspaceProperties): Workspace {
    return new Workspace(properties);
  }
  static createInitialOwner(input: { id: WorkspaceProperties["initialOwner"]["id"]; membershipId: WorkspaceProperties["initialOwner"]["membershipId"]; joinedAt: Date }): WorkspaceMember {
    return WorkspaceMember.initialOwner(input);
  }
  static initialSettings(values: Record<string, unknown> = {}) { return WorkspaceSettings.initial(values); }
}
