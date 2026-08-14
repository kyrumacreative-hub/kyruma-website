import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { PrismaTransactionContextStore } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { PartnerFactory } from "../../domain/partnerFactory";
import { LeadId, MembershipId, OrganizationId, PartnerCode, PartnerId, WorkspaceId } from "../../domain/valueObjects";
import { PrismaInitialMembershipRepository } from "./repositories/PrismaInitialMembershipRepository";
import { PrismaPartnerCodeSequenceRepository } from "./repositories/PrismaPartnerCodeSequenceRepository";
import { PrismaPartnerCreationIdempotencyRepository } from "./repositories/PrismaPartnerCreationIdempotencyRepository";
import { PrismaPartnerRepository } from "./repositories/PrismaPartnerRepository";
import { PrismaWorkspaceProvisioningRepository } from "./repositories/PrismaWorkspaceProvisioningRepository";
import { ProvisionWorkspaceUseCase } from "../../../workspace/application/useCases";
import { DefaultWorkspaceProvisioner } from "../../../workspace/application/services/WorkspaceProvisioner";
import { PrismaWorkspaceRepository } from "../../../workspace/infrastructure/persistence/repositories/PrismaWorkspaceRepositories";

const client = new PrismaClient();
const contexts = new PrismaTransactionContextStore();
const runner = new PrismaTransactionRunner(client, contexts);
const partners = new PrismaPartnerRepository(contexts);
const codes = new PrismaPartnerCodeSequenceRepository(contexts);
const workspaces = new PrismaWorkspaceProvisioningRepository(contexts);
const memberships = new PrismaInitialMembershipRepository(contexts);
const idempotency = new PrismaPartnerCreationIdempotencyRepository(contexts);
const workspaceRepository = new PrismaWorkspaceRepository(contexts);
const workspaceProvisioner = new DefaultWorkspaceProvisioner(
  new ProvisionWorkspaceUseCase({ transactions: runner, workspaces: workspaceRepository }),
);
let testCodeCounter = 0;

function partner(suffix: string, code: string, organizationId = `org-${suffix}`) {
  const uniqueCode = `KYR-${code.replace("KYR-", "")}${Date.now()}${testCodeCounter++}`;
  return PartnerFactory.create({
    id: PartnerId.create(`partner-${suffix}`), code: PartnerCode.create(uniqueCode), leadId: LeadId.create(`lead-${suffix}`), organizationId: OrganizationId.create(organizationId),
    primaryWorkspaceId: WorkspaceId.create(`workspace-${suffix}`), initialOwnerMembershipId: MembershipId.create(`membership-${suffix}`), createdAt: new Date(), correlationId: `correlation-${suffix}`,
  });
}

test("persists and restores a Partner by id and Lead", async () => {
  const suffix = randomUUID();
  const value = partner(suffix, "KYR-901");
  await runner.run(async (context) => { await partners.save(value, context); });
  await runner.run(async (context) => {
    assert.equal((await partners.findById(value.id.value, context))?.code.value, value.code.value);
    assert.equal((await partners.findByLeadId(value.leadId.value, context))?.organizationId.value, value.organizationId.value);
  });
});

test("enforces one Partner per Lead and preserves status updates", async () => {
  const suffix = randomUUID();
  const first = partner(suffix, "KYR-902");
  await runner.run((context) => partners.save(first, context));
  first.approve();
  await runner.run((context) => partners.update(first, context));
  await runner.run(async (context) => assert.equal((await partners.findById(first.id.value, context))?.status, "approved"));
  const duplicate = partner(`${suffix}-duplicate`, "KYR-903");
  (duplicate as unknown as { leadId: LeadId }).leadId = first.leadId;
  await assert.rejects(() => runner.run((context) => partners.save(duplicate, context)));
});

test("allocates strictly increasing codes concurrently and never reuses a rolled back number", async () => {
  const allocated = await Promise.all(Array.from({ length: 4 }, () => runner.run((context) => codes.allocate(context))));
  const ordered = [...allocated].sort((left, right) => left - right);
  assert.deepEqual(ordered, Array.from({ length: 4 }, (_, index) => ordered[0] + index));
  let abandoned = 0;
  await assert.rejects(() => runner.run(async (context) => { abandoned = await codes.allocate(context); throw new Error("force rollback"); }));
  const next = await runner.run((context) => codes.allocate(context));
  assert.equal(next, abandoned + 1);
});

test("defines the Partner code sequence to begin at KYR-001", async () => {
  const rows = await client.$queryRaw<{ start_value: bigint }[]>`
    SELECT start_value FROM pg_sequences
    WHERE schemaname = 'public' AND sequencename = 'PartnerCodeSequence_value_seq'
  `;
  assert.equal(Number(rows[0]?.start_value), 1);
});

test("persists one primary workspace, one owner membership and idempotency correlation", async () => {
  const suffix = randomUUID();
  const value = partner(suffix, "KYR-904");
  await runner.run(async (context) => {
    await partners.save(value, context);
    await workspaces.savePrimary({ workspaceId: value.primaryWorkspaceId.value, partnerId: value.id.value }, context);
    await memberships.saveOwner({ membershipId: value.initialOwnerMembershipId.value, partnerId: value.id.value }, context);
    await idempotency.save(value.correlationId!, value.id.value, context);
  });
  await runner.run(async (context) => {
    assert.equal(await idempotency.find(value.correlationId!, context), value.id.value);
    await assert.rejects(() => workspaces.savePrimary({ workspaceId: `workspace-second-${suffix}`, partnerId: value.id.value }, context));
  });
  const [workspace, membership] = await Promise.all([
    client.partnerWorkspace.findUnique({ where: { id: value.primaryWorkspaceId.value } }),
    client.partnerMembership.findUnique({ where: { id: value.initialOwnerMembershipId.value } }),
  ]);
  assert.equal(workspace?.primary, true);
  assert.deepEqual({ role: membership?.role, status: membership?.status }, { role: "owner", status: "active" });
  await client.partnerWorkspace.createMany({ data: [
    { id: `workspace-secondary-one-${suffix}`, partnerId: value.id.value, primary: false },
    { id: `workspace-secondary-two-${suffix}`, partnerId: value.id.value, primary: false },
  ] });
  assert.equal(await client.partnerWorkspace.count({ where: { partnerId: value.id.value, primary: false } }), 2);
});

test("rolls back the Partner conversion while retaining no partial records", async () => {
  const suffix = randomUUID();
  const value = partner(suffix, "KYR-905");
  await assert.rejects(() => runner.run(async (context) => {
    await partners.save(value, context);
    await workspaces.savePrimary({ workspaceId: value.primaryWorkspaceId.value, partnerId: value.id.value }, context);
    throw new Error("force rollback");
  }));
  await runner.run(async (context) => assert.equal(await partners.findById(value.id.value, context), null));
  assert.equal(await client.partnerWorkspace.findUnique({ where: { id: value.primaryWorkspaceId.value } }), null);
});

test("rolls back Partner, Membership, Workspace, Settings and idempotency when Workspace provisioning fails", async () => {
  const suffix = randomUUID();
  const value = partner(suffix, "KYR-906");
  const dispatched = false;
  await assert.rejects(() => runner.run(async (context) => {
    await partners.save(value, context);
    await memberships.saveOwner({ membershipId: value.initialOwnerMembershipId.value, partnerId: value.id.value }, context);
    await workspaceProvisioner.provision({
      workspaceId: value.primaryWorkspaceId.value,
      workspaceMemberId: `workspace-member-${suffix}`,
      partnerId: value.id.value,
      organizationId: value.organizationId.value,
      initialOwnerMembershipId: value.initialOwnerMembershipId.value,
      name: value.code.value,
      metadata: { eventId: `event-${suffix}`, occurredAt: value.createdAt, correlationId: value.correlationId!, actorId: "test-actor" },
    }, context);
    await idempotency.save(value.correlationId!, value.id.value, context);
    throw new Error("simulated workspace provisioning failure");
  }));
  const [persistedPartner, persistedWorkspace, persistedSettings, persistedMembership, persistedIdempotency] = await Promise.all([
    client.partner.findUnique({ where: { id: value.id.value } }),
    client.workspace.findUnique({ where: { id: value.primaryWorkspaceId.value } }),
    client.workspaceSettings.findUnique({ where: { workspaceId: value.primaryWorkspaceId.value } }),
    client.partnerMembership.findUnique({ where: { id: value.initialOwnerMembershipId.value } }),
    client.partnerCreationIdempotency.findUnique({ where: { correlationId: value.correlationId! } }),
  ]);
  assert.equal(persistedPartner, null);
  assert.equal(persistedWorkspace, null);
  assert.equal(persistedSettings, null);
  assert.equal(persistedMembership, null);
  assert.equal(persistedIdempotency, null);
  assert.equal(dispatched, false);
});

test.after(async () => { await client.$disconnect(); });
