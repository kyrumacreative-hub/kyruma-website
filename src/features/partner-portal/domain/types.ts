export type PortalVisibility = "shared" | "partner_private";
export interface PortalScope { organizationId: string; partnerId: string; workspaceId: string }
export interface SharedItem { id: string; kind: "information" | "document" | "link"; title: string; summary?: string; externalUrl?: string; visibility: PortalVisibility; publishedAt: Date }
export interface ActivityItem { id: string; eventType: string; title: string; description?: string; occurredAt: Date }
export interface DeliverableItem { id: string; title: string; status: "shared" | "in_review" | "approved" | "superseded"; version: number; externalUrl?: string; sharedAt: Date; approvedAt?: Date }
export interface PartnerPortalView { workspace: { id: string; name: string; status: string }; shared: SharedItem[]; activity: ActivityItem[]; deliverables: DeliverableItem[] }

