import type { ResolvedPartnerContext, WorkspaceContext } from "../domain/types";

/** Kept separate so future modules depend on workspace context rather than resolution mechanics. */
export interface WorkspaceContextProvider {
  getWorkspace(context: ResolvedPartnerContext): WorkspaceContext;
}

export const defaultWorkspaceContextProvider: WorkspaceContextProvider = {
  getWorkspace: (context) => context.workspace,
};
