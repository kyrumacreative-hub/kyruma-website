import type { PrismaClient } from "@prisma/client";
import type { PortalReader } from "../application/portalService";
import type { DeliverableItem, PortalScope, PortalVisibility } from "../domain/types";

export class PrismaPortalReader implements PortalReader {
  constructor(private readonly client: PrismaClient) {}
  async read(scope: PortalScope) {
    const workspace = await this.client.workspace.findFirst({ where: { id: scope.workspaceId, organizationId: scope.organizationId, partnerId: scope.partnerId } });
    if (!workspace) return null;
    const [shared, activity, deliverables] = await Promise.all([
      this.client.portalShare.findMany({ where: { ...scope, visibility: { in: ["shared", "partner_private"] } }, orderBy: { publishedAt: "desc" } }),
      this.client.portalActivity.findMany({ where: scope, orderBy: { occurredAt: "desc" }, take: 100 }),
      this.client.portalDeliverable.findMany({ where: scope, orderBy: { sharedAt: "desc" } }),
    ]);
    return { workspace: { id: workspace.id, name: workspace.name, status: workspace.status }, shared: shared.map((item) => ({ ...item, summary: item.summary ?? undefined, externalUrl: item.externalUrl ?? undefined, visibility: item.visibility as PortalVisibility, kind: item.kind as "information" | "document" | "link" })), activity: activity.map((item) => ({ ...item, description: item.description ?? undefined })), deliverables: deliverables.map((item) => ({ ...item, externalUrl: item.externalUrl ?? undefined, approvedAt: item.approvedAt ?? undefined, status: item.status as DeliverableItem["status"] })) };
  }
}

