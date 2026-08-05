export const capabilityCatalog = [
  "lead.create", "lead.read", "lead.update", "lead.archive", "lead.reactivate",
  "lead.ownership.update", "lead.discovery.start", "lead.qualification.start",
  "lead.qualification.approve", "lead.partner.create",
  "partner.read", "partner.create", "partner.update", "partner.lifecycle.manage",
  "workspace.read", "workspace.manage", "workspace.invite",
  "discovery.read", "discovery.review", "discovery.link", "discovery.export",
  "meeting.read", "meeting.create", "meeting.update",
  "proposal.read", "proposal.create", "proposal.publish", "proposal.accept",
  "strategy.read", "strategy.create", "strategy.update", "strategy.publish",
  "project.read", "project.create", "project.update", "project.manage",
  "task.read", "task.create", "task.update", "task.assign",
  "document.read", "document.upload", "document.update", "document.publish", "document.archive",
  "deliverable.read", "deliverable.create", "deliverable.publish", "deliverable.approve",
  "note.internal.read", "note.internal.create",
  "insight.read", "insight.review", "insight.publish",
  "notification.read", "notification.manage", "audit.read", "admin.manage",
] as const;

export type Capability = (typeof capabilityCatalog)[number];

export const roles = ["super_admin", "admin", "strategist", "designer", "developer", "partner", "viewer"] as const;
export type Role = (typeof roles)[number];

const allCapabilities = [...capabilityCatalog];
const leadCapabilities: readonly Capability[] = [
  "lead.create", "lead.read", "lead.update", "lead.archive", "lead.reactivate",
  "lead.ownership.update", "lead.discovery.start", "lead.qualification.start",
  "lead.qualification.approve", "lead.partner.create",
];

export const roleCapabilities: Record<Role, readonly Capability[]> = {
  super_admin: allCapabilities,
  admin: [
    ...leadCapabilities,
    "partner.read", "partner.create", "partner.update", "partner.lifecycle.manage", "workspace.read", "workspace.manage", "workspace.invite",
    "discovery.read", "discovery.review", "discovery.link", "discovery.export", "meeting.read", "meeting.create", "meeting.update",
    "proposal.read", "proposal.create", "proposal.publish", "strategy.read", "strategy.create", "strategy.update", "strategy.publish",
    "project.read", "project.create", "project.update", "project.manage", "task.read", "task.create", "task.update", "task.assign",
    "document.read", "document.upload", "document.update", "document.publish", "document.archive", "deliverable.read", "deliverable.create", "deliverable.publish", "deliverable.approve",
    "insight.read", "insight.review", "insight.publish", "notification.read", "notification.manage", "audit.read", "admin.manage",
  ],
  strategist: [
    "lead.create", "lead.read", "lead.update", "lead.discovery.start", "lead.qualification.start",
    "partner.read", "workspace.read", "discovery.read", "discovery.review", "discovery.export", "meeting.read", "meeting.create", "meeting.update",
    "proposal.read", "proposal.create", "proposal.publish", "strategy.read", "strategy.create", "strategy.update", "strategy.publish", "project.read",
    "task.read", "task.create", "task.update", "document.read", "document.upload", "document.update", "deliverable.read", "insight.read", "insight.review", "note.internal.read", "note.internal.create",
  ],
  designer: ["lead.read", "workspace.read", "project.read", "project.update", "task.read", "task.create", "task.update", "document.read", "document.upload", "document.update", "deliverable.read", "deliverable.create"],
  developer: ["lead.read", "workspace.read", "project.read", "project.update", "task.read", "task.create", "task.update", "document.read", "document.upload", "document.update", "deliverable.read", "deliverable.create"],
  partner: ["partner.read", "workspace.read", "discovery.read", "proposal.read", "proposal.accept", "strategy.read", "project.read", "task.read", "document.read", "deliverable.read", "deliverable.approve", "insight.read", "meeting.read"],
  viewer: ["lead.read", "partner.read", "workspace.read", "discovery.read", "proposal.read", "strategy.read", "project.read", "task.read", "document.read", "deliverable.read", "insight.read", "meeting.read"],
};

export function effectiveCapabilities(role: Role, grants: readonly Capability[] = [], revocations: readonly Capability[] = []) {
  return new Set([...roleCapabilities[role], ...grants].filter((capability) => !revocations.includes(capability)));
}
