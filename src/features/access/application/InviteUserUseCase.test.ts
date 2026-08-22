import test from "node:test";
import assert from "node:assert/strict";
import type { AuthenticatedActor } from "../../identity/domain/types";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { AccessInvitation } from "../domain/types";
import { AccessInvitationAlreadyActiveError, InviteUserUseCase } from "./InviteUserUseCase";

const actor: AuthenticatedActor = { user: { id: "admin-1", externalSubjectId: "clerk-admin", email: "admin@example.com" }, memberships: [{ id: "membership-1", userId: "admin-1", role: "admin", status: "active", scope: { organizationId: "org-1" } }] };
const context: TransactionContext = {};

test("persists invitation, audit and sanitized event in one transaction", async () => {
  const calls: string[] = []; let stored: AccessInvitation | undefined;
  const useCase = new InviteUserUseCase({ transactions: { run: async (work) => { calls.push("transaction"); return work(context); } }, repository: { findActive: async () => null, save: async (value) => { stored = value; calls.push("invitation"); } }, audit: { recordRequested: async () => { calls.push("audit"); } }, events: { publishRequested: async ({ invitation }) => { calls.push("outbox"); assert.equal("token" in invitation, false); return { eventId: "event-1" }; } }, tokens: { create: (id, version) => `v${version}.${id}` }, now: () => new Date("2026-08-19T10:00:00Z"), newId: () => "invite-1" });
  const result = await useCase.execute(actor, { email: "Partner@Example.com", role: "partner", scope: { organizationId: "org-1", workspaceId: "workspace-1" }, correlationId: "correlation-1", expiresAt: new Date("2026-08-26T10:00:00Z") });
  assert.deepEqual(result, { invitationId: "invite-1", eventId: "event-1", status: "pending" });
  assert.equal(stored?.tokenVersion, 1); assert.deepEqual(calls, ["transaction", "invitation", "audit", "outbox"]);
});

test("rejects an active invitation before writing audit or outbox", async () => {
  let sideEffect = false;
  const existing = { id: "existing" } as AccessInvitation;
  const useCase = new InviteUserUseCase({ transactions: { run: (work) => work(context) }, repository: { findActive: async () => existing, save: async () => { sideEffect = true; } }, audit: { recordRequested: async () => { sideEffect = true; } }, events: { publishRequested: async () => { sideEffect = true; return { eventId: "event" }; } }, tokens: { create: () => "deterministic-token" }, newId: () => "invite-2" });
  await assert.rejects(() => useCase.execute(actor, { email: "partner@example.com", role: "partner", scope: { organizationId: "org-1" }, correlationId: "correlation-2", expiresAt: new Date(Date.now() + 60_000) }), AccessInvitationAlreadyActiveError);
  assert.equal(sideEffect, false);
});
