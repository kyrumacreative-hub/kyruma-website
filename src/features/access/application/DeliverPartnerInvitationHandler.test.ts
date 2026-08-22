import test from "node:test";
import assert from "node:assert/strict";
import type { EventEnvelope } from "../../event-bus/domain/contracts";
import type { AccessInvitation } from "../domain/types";
import { DeliverPartnerInvitationHandler } from "./DeliverPartnerInvitationHandler";

const now = new Date("2026-08-19T10:00:00Z");
const invitation: AccessInvitation = { id: "invite-1", email: "partner@example.com", role: "partner", scope: { organizationId: "org-1", workspaceId: "workspace-1" }, tokenHash: "hash", tokenVersion: 1, status: "pending", expiresAt: new Date("2026-08-26T10:00:00Z"), createdBy: "admin-1", createdAt: now, correlationId: "correlation-1" };
const envelope: EventEnvelope = { eventId: "event-1", eventType: "partner.invitation.requested.v1", eventVersion: 1, occurredAt: now.toISOString(), publishedAt: now.toISOString(), correlationId: "correlation-1", causationId: null, organizationId: "org-1", source: "access", aggregateType: "AccessInvitation", aggregateId: "invite-1", payload: { invitationId: "invite-1", tokenVersion: 1 }, metadata: { pii: false, processingDepth: 0 } };

test("reconciles an existing Clerk invitation without creating a duplicate", async () => {
  let creates = 0; let marked = "";
  const handler = new DeliverPartnerInvitationHandler({ findById: async () => ({ invitation, deliveryStatus: "pending", providerId: null }), markDelivered: async (_id, providerId) => { marked = providerId; } }, { findPending: async () => ({ id: "clerk-existing" }), create: async () => { creates += 1; return { id: "duplicate" }; } }, { create: () => "v1.safe-token" }, { run: (work) => work({}) }, { recordDelivered: async () => undefined }, "https://www.kyruma.com", () => now);
  await handler.handle(envelope);
  assert.equal(creates, 0); assert.equal(marked, "clerk-existing");
});

test("reconstructs the token only in memory when Clerk delivery is required", async () => {
  let deliveredUrl = "";
  const handler = new DeliverPartnerInvitationHandler({ findById: async () => ({ invitation, deliveryStatus: "pending", providerId: null }), markDelivered: async () => undefined }, { findPending: async () => null, create: async (input) => { deliveredUrl = input.acceptanceUrl; return { id: "clerk-new" }; } }, { create: () => "v1.reconstructed" }, { run: (work) => work({}) }, { recordDelivered: async () => undefined }, "https://www.kyruma.com", () => now);
  await handler.handle(envelope);
  assert.equal(new URL(deliveredUrl).searchParams.get("token"), "v1.reconstructed");
  assert.equal(JSON.stringify(envelope).includes("reconstructed"), false);
});
