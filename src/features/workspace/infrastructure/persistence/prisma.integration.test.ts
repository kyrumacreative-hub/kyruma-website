import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";

import {
  WorkspaceMemberId,
  MembershipId,
} from "../../domain/valueObjects";

import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";

const client = new PrismaClient();

const contexts = new PrismaTransactionContextStore();

const transactions = new PrismaTransactionRunner(
  client,
  contexts,
  {
    transactionCompleted: () => {},
    transactionFailed: () => {},
  },
);


function workspaceInput() {
  return {
    id: randomUUID(),
    partnerId: randomUUID(),
    organizationId: randomUUID(),
    correlationId: randomUUID(),
    name: "KYRUMA Test Workspace",
    primary: true,
    status: "provisioning",
    initialOwnerMemberId: WorkspaceMemberId.create(
      randomUUID(),
    ),
    initialOwnerMembershipId: MembershipId.create(
      randomUUID(),
    ),
    settingsVersion: 1,
    createdAt: new Date(),
  };
}


beforeEach(async () => {
  await client.workspaceSettings.deleteMany();
  await client.workspaceMember.deleteMany();
  await client.workspaceInvitation.deleteMany();
  await client.workspace.deleteMany();
});


after(async () => {
  await client.workspaceSettings.deleteMany();
  await client.workspaceMember.deleteMany();
  await client.workspaceInvitation.deleteMany();
  await client.workspace.deleteMany();
  await client.$disconnect();
});


test("persists Workspace through Prisma adapter", async () => {
  const model = workspaceInput();

  await transactions.run(async () => {

    await client.workspace.create({
      data: {
        id: model.id,
        partnerId: model.partnerId,
        organizationId: model.organizationId,
        correlationId: model.correlationId,
        name: model.name,
        primary: model.primary,
        status: model.status,
        initialOwnerMemberId:
          model.initialOwnerMemberId.value,
        initialOwnerMembershipId:
          model.initialOwnerMembershipId.value,
        settingsVersion: model.settingsVersion,
        createdAt: model.createdAt,
      },
    });

  });


  const persisted = await client.workspace.findUnique({
    where: {
      id: model.id,
    },
  });


  assert.ok(persisted);
  assert.equal(
    persisted.name,
    "KYRUMA Test Workspace",
  );
});