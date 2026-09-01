import "server-only";

import type { AuthenticatedActor } from "@/features/identity/domain/types";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { requireInternalAdmin } from "@/features/access/server/internalAdmin";
import { prisma } from "@/lib/prisma";
import { GLOBAL_KYRUMA_ORGANIZATION_ID } from "../domain/policy";

export interface InternalOperatingContext {
  readonly actor: AuthenticatedActor;
  readonly organizationId: string;
}

export async function requireInternalOperatingContext(): Promise<InternalOperatingContext> {
  const actor = await requireCurrentActor();
  requireInternalAdmin(actor);
  return { actor, organizationId: GLOBAL_KYRUMA_ORGANIZATION_ID };
}

export async function requireWorkspaceInOrganization(_organizationId: string, workspaceId?: string) {
  if (!workspaceId) return undefined;
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, status: "active" },
    select: { id: true, organizationId: true, partnerId: true, name: true },
  });
  if (!workspace) throw new Error("OPERATING_INTELLIGENCE_WORKSPACE_NOT_FOUND");
  return workspace;
}

export async function requireProjectInWorkspace(organizationId: string, workspaceId: string | undefined, projectId?: string) {
  if (!projectId) return undefined;
  if (!workspaceId) throw new Error("OPERATING_INTELLIGENCE_PROJECT_SCOPE_INVALID");
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, workspaceId },
    select: { id: true, partnerId: true, workspaceId: true, name: true },
  });
  if (!project) throw new Error("OPERATING_INTELLIGENCE_PROJECT_NOT_FOUND");
  return project;
}
