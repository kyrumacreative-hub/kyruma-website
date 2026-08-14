import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import type {
  TransactionContext,
  TransactionRunner,
} from "../../lead-lifecycle/ports/TransactionRunner";
import type { Partner } from "../domain/partner";
import type { PartnerDomainEvent } from "../domain/events";
import type { Workspace } from "../../workspace/domain/workspace";
import { WorkspaceFactory } from "../../workspace/domain/workspaceFactory";
import { WorkspaceSettings } from "../../workspace/domain/entities";
import {
  CorrelationId,
  MembershipId,
  OrganizationId,
  PartnerId,
  WorkspaceId,
  WorkspaceMemberId,
  WorkspaceName,
} from "../../workspace/domain/valueObjects";
import {
  CreatePartnerUseCase,
  GetPartnerByLeadUseCase,
  GetPartnerUseCase,
  PartnerApplicationError,
  type CreatePartnerInput,
  type PartnerApplicationDependencies,
} from "./useCases";

const context = (
  capabilities = ["partner.create", "partner.read"],
  organizationId = "org-1",
): ResolvedOrganizationContext => ({
  contextKey: "context",
  actor: {
    user: {
      id: "admin-1",
      externalSubjectId: "subject",
      email: "hello@kyruma.com",
    },
    memberships: [],
  },
  membership: {
    id: "membership",
    userId: "admin-1",
    role: "admin",
    status: "active",
    scope: { organizationId },
  },
  organization: { id: organizationId, displayName: "KYRUMA" },
  capabilities: new Set(capabilities as never[]),
  allowedVisibilities: ["internal"],
});

function dependencies(
  options: {
    qualified?: boolean;
    failSave?: boolean;
    failDispatch?: boolean;
  } = {},
) {
  const byId = new Map<string, Partner>();
  const byLead = new Map<string, Partner>();
  const correlations = new Map<string, string>();
  const dispatched: (readonly PartnerDomainEvent[])[] = [];
  const transactions: TransactionRunner = {
    run: async <T>(operation: (value: TransactionContext) => Promise<T>) =>
      operation({}),
  };
  const deps: PartnerApplicationDependencies = {
    transactions,
    partners: {
      save: async (partner: Partner) => {
        if (options.failSave) throw new Error("persistence failed");
        byId.set(partner.id.value, partner);
        byLead.set(partner.leadId.value, partner);
      },
      update: async (partner: Partner) => {
        byId.set(partner.id.value, partner);
      },
      findById: async (id: string) => byId.get(id) ?? null,
      findByLeadId: async (id: string) => byLead.get(id) ?? null,
    },
    codes: { allocate: async () => 1 },
    workspaceProvisioner: {
      provision: async (input): Promise<Workspace> =>
        WorkspaceFactory.create({
          id: WorkspaceId.create(input.workspaceId),
          partnerId: PartnerId.create(input.partnerId),
          organizationId: OrganizationId.create(input.organizationId),
          name: WorkspaceName.create(input.name),
          primary: true,
          initialOwner: WorkspaceFactory.createInitialOwner({
            id: WorkspaceMemberId.create(input.workspaceMemberId),
            membershipId: MembershipId.create(input.initialOwnerMembershipId),
            joinedAt: input.metadata.occurredAt,
          }),
          settings: WorkspaceSettings.initial(),
          createdAt: input.metadata.occurredAt,
          correlationId: CorrelationId.create(input.metadata.correlationId),
        }),
    },
    memberships: { saveOwner: async () => undefined },
    idempotency: {
      find: async (id: string) => correlations.get(id) ?? null,
      save: async (id: string, partnerId: string) => {
        correlations.set(id, partnerId);
      },
    },
    qualifiedLeads: { isQualified: async () => options.qualified ?? true },
    events: {
      dispatch: async (events: readonly PartnerDomainEvent[]) => {
        if (options.failDispatch) throw new Error("dispatch failed");
        dispatched.push(events);
      },
    },
  };
  return { deps, byId, dispatched };
}

const input = (
  overrides: Partial<CreatePartnerInput> = {},
): CreatePartnerInput => ({
  context: context(),
  partnerId: "partner-1",
  leadId: "lead-1",
  workspaceId: "workspace-1",
  workspaceMemberId: "workspace-member-1",
  membershipId: "owner-1",
  correlationId: "correlation-1",
  eventId: "event-1",
  occurredAt: new Date(),
  ...overrides,
});

test("creates an atomic Partner conversion and dispatches after commit", async () => {
  const fake = dependencies();
  const result = await new CreatePartnerUseCase(fake.deps).execute(input());
  assert.deepEqual(
    { id: result.id, code: result.code, status: result.status },
    { id: "partner-1", code: "KYR-001", status: "pending_approval" },
  );
  assert.equal(fake.byId.size, 1);
  assert.equal(fake.dispatched.length, 1);
  assert.equal(fake.dispatched[0].length, 6);
});

test("returns the original conversion for a repeated correlation without dispatching twice", async () => {
  const fake = dependencies();
  const useCase = new CreatePartnerUseCase(fake.deps);
  const first = await useCase.execute(input());
  const repeated = await useCase.execute(input());
  assert.equal(repeated.id, first.id);
  assert.equal(fake.byId.size, 1);
  assert.equal(fake.dispatched.length, 1);
});

test("requires both authorization and a qualified Lead", async () => {
  await assert.rejects(
    () =>
      new CreatePartnerUseCase(dependencies({ qualified: false }).deps).execute(
        input(),
      ),
    (error: unknown) =>
      error instanceof PartnerApplicationError && error.code === "PRECONDITION",
  );
  await assert.rejects(
    () =>
      new CreatePartnerUseCase(dependencies().deps).execute(
        input({ context: context(["partner.read"]) }),
      ),
    (error: unknown) =>
      error instanceof PartnerApplicationError && error.code === "FORBIDDEN",
  );
});

test("does not dispatch events when persistence rolls back", async () => {
  const fake = dependencies({ failSave: true });
  await assert.rejects(
    () => new CreatePartnerUseCase(fake.deps).execute(input()),
    (error: unknown) =>
      error instanceof PartnerApplicationError && error.code === "PERSISTENCE",
  );
  assert.equal(fake.byId.size, 0);
  assert.equal(fake.dispatched.length, 0);
});

test("maps post-commit dispatch failures without undoing a committed Partner", async () => {
  const fake = dependencies({ failDispatch: true });
  await assert.rejects(
    () => new CreatePartnerUseCase(fake.deps).execute(input()),
    (error: unknown) =>
      error instanceof PartnerApplicationError && error.code === "PERSISTENCE",
  );
  assert.equal(fake.byId.size, 1);
  assert.equal(fake.dispatched.length, 0);
});

test("reads Partners only within the resolved Organization context", async () => {
  const fake = dependencies();
  const created = await new CreatePartnerUseCase(fake.deps).execute(input());
  assert.equal(
    (
      await new GetPartnerUseCase(fake.deps).execute({
        context: context(),
        partnerId: created.id,
      })
    ).id,
    created.id,
  );
  assert.equal(
    (
      await new GetPartnerByLeadUseCase(fake.deps).execute({
        context: context(),
        leadId: "lead-1",
      })
    ).id,
    created.id,
  );
  await assert.rejects(
    () =>
      new GetPartnerUseCase(fake.deps).execute({
        context: context(["partner.read"], "org-other"),
        partnerId: created.id,
      }),
    (error: unknown) =>
      error instanceof PartnerApplicationError && error.code === "NOT_FOUND",
  );
});
