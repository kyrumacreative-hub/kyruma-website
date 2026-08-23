import type { MembershipProvision } from "../domain/types";

export interface AcceptedMembershipGateway {
  findActiveOrInvited(provision: MembershipProvision): Promise<{ id: string; status: "invited" | "active" } | null>;
  activate(id: string, joinedAt: Date): Promise<void>;
  create(provision: MembershipProvision, invitedAt: Date): Promise<void>;
  ensureWorkspaceMember(input: { workspaceId: string; membershipId: string; joinedAt: Date }): Promise<void>;
}

export async function ensureAcceptedMembership(
  gateway: AcceptedMembershipGateway,
  input: { provision: MembershipProvision; invitedAt: Date },
): Promise<string> {
  const existing = await gateway.findActiveOrInvited(input.provision);
  const membershipId = existing?.id ?? input.provision.id;

  if (existing?.status === "invited") {
    await gateway.activate(existing.id, input.provision.joinedAt);
  } else if (!existing) {
    await gateway.create(input.provision, input.invitedAt);
  }

  if (input.provision.scope.workspaceId) {
    await gateway.ensureWorkspaceMember({
      workspaceId: input.provision.scope.workspaceId,
      membershipId,
      joinedAt: input.provision.joinedAt,
    });
  }

  return membershipId;
}
