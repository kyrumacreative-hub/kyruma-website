import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test, { after } from "node:test";
import { PrismaClient } from "@prisma/client";
import type { AuthenticatedActor } from "../../identity/domain/types";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import { AccessInvitationAlreadyActiveError, InviteUserUseCase, type AccessInvitationRepository } from "../application/InviteUserUseCase";
import type { AccessInvitation, AccessScope } from "../domain/types";
import { PrismaAccessInvitationRepository } from "./PrismaAccessInvitationRepository";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const transactions = new PrismaTransactionRunner(client, contexts);
const repository = new PrismaAccessInvitationRepository(client, contexts);
const testEmails: string[] = [];

after(async () => {
  await client.accessInvitation.deleteMany({ where: { normalizedEmail: { in: testEmails } } });
  await client.$disconnect();
});

test("serializes concurrent active invitations within the same tenant scope", async () => {
  const organizationId = `org-${randomUUID()}`;
  const workspaceId = `workspace-${randomUUID()}`;
  const email = `concurrent-${randomUUID()}@example.com`;
  testEmails.push(email);
  const actor: AuthenticatedActor = {
    user: { id: "admin-1", externalSubjectId: "clerk-admin", email: "admin@example.com" },
    memberships: [{ id: "membership-1", userId: "admin-1", role: "admin", status: "active", scope: { organizationId } }],
  };

  let arrivals = 0;
  let releaseBarrier!: () => void;
  const barrier = new Promise<void>((resolve) => { releaseBarrier = resolve; });
  const synchronizedRepository: AccessInvitationRepository = {
    save: (invitation, context) => repository.save(invitation, context),
    async findActive(input: { normalizedEmail: string; scope: AccessScope; now: Date }, context: TransactionContext): Promise<AccessInvitation | null> {
      arrivals += 1;
      if (arrivals === 2) releaseBarrier();
      await barrier;
      return repository.findActive(input, context);
    },
  };

  const invite = (id: string) => new InviteUserUseCase({
    transactions,
    repository: synchronizedRepository,
    audit: { recordRequested: async () => undefined },
    events: { publishRequested: async () => ({ eventId: `event-${id}` }) },
    tokens: { create: (invitationId) => createHash("sha256").update(invitationId).digest("base64url") },
    newId: () => id,
  }).execute(actor, {
    email,
    role: "partner",
    scope: { organizationId, workspaceId },
    correlationId: `correlation-${id}`,
    expiresAt: new Date(Date.now() + 86_400_000),
  });

  const results = await Promise.allSettled([invite(randomUUID()), invite(randomUUID())]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  const rejection = results.find((result): result is PromiseRejectedResult => result.status === "rejected");
  assert.ok(rejection?.reason instanceof AccessInvitationAlreadyActiveError);
  assert.equal(await client.accessInvitation.count({ where: { normalizedEmail: email, organizationId, workspaceId, status: "pending" } }), 1);
});
