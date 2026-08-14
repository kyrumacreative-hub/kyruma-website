import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after, beforeEach } from "node:test";
import { PrismaClient } from "@prisma/client";

import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";

import { WorkspaceFactory } from "../../domain/workspaceFactory";
import { WorkspaceSettings } from "../../domain/entities";
import {
  WorkspaceId,
  PartnerId,
  OrganizationId,
  CorrelationId,
  WorkspaceName,
  WorkspaceMemberId,
  MembershipId,
} from "../../domain/valueObjects";

import { PrismaWorkspaceRepository } from "./repositories/PrismaWorkspaceRepositories";

const client = new PrismaClient();

const contexts = new PrismaTransactionContextStore();

const transactions = new PrismaTransactionRunner(client, contexts, {
  transactionCompleted: () => {},
  transactionFailed: () => {},
});

const workspaces = new PrismaWorkspaceRepository(contexts);

function createWorkspace() {
  const owner = WorkspaceFactory.createInitialOwner({
    id: WorkspaceMemberId.create(randomUUID()),
    membershipId: MembershipId.create(randomUUID()),
    joinedAt: new Date(),
  });

  return WorkspaceFactory.create({
    id: WorkspaceId.create(randomUUID()),
    partnerId: PartnerId.create(randomUUID()),
    organizationId: OrganizationId.create(randomUUID()),
    correlationId: CorrelationId.create(randomUUID()),
    name: WorkspaceName.create("KYRUMA Test Workspace"),
    primary: true,
    initialOwner: owner,
    settings: WorkspaceSettings.initial(),
    createdAt: new Date(),
  });
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

test("persists Workspace aggregate through Prisma adapter", async () => {
  const workspace = createWorkspace();

  // 1. Guardamos el agregado real
  await transactions.run(async (context) => {
    await workspaces.save(workspace, context);
  });

  // 2. Recuperamos el agregado real
  const restored = await transactions.run(async (context) => {
    return workspaces.findById(workspace.id.value, context);
  });

  // 3. Verificamos su integridad
  assert.ok(restored);
  assert.equal(restored.name.value, "KYRUMA Test Workspace");
  assert.equal(restored.status, "provisioning");
  assert.equal(restored.primary, true);
});
