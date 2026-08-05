import type { PartnerContextRecord, WorkspaceContext } from "./types";

export class WorkspaceResolutionError extends Error {
  constructor() {
    super("A workspace must be selected before this context can be used.");
  }
}

/** Resolves the current workspace without imposing a permanent one-workspace model. */
export function resolveWorkspace(record: PartnerContextRecord, workspaceId?: string): WorkspaceContext {
  if (workspaceId) {
    const selected = record.workspaces.find((workspace) => workspace.id === workspaceId);
    if (selected) return selected;
    throw new WorkspaceResolutionError();
  }

  if (record.primaryWorkspaceId) {
    const primary = record.workspaces.find((workspace) => workspace.id === record.primaryWorkspaceId);
    if (primary) return primary;
  }

  if (record.workspaces.length === 1) return record.workspaces[0];
  throw new WorkspaceResolutionError();
}
