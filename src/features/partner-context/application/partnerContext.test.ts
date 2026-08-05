import assert from "node:assert/strict";
import test from "node:test";
import type { AuthenticatedActor } from "../../identity/domain/types";
import { requireContextAccess } from "./requireContextAccess";
import { DefaultPartnerContextProvider } from "./PartnerContextProvider";
import { switchPartnerContext } from "./switchPartnerContext";
import type { PartnerContextRecord } from "../domain/types";
import type { ContextEventPublisher } from "../ports/ContextEventPublisher";
import type { PartnerContextRepository } from "../ports/PartnerContextRepository";

const actor: AuthenticatedActor = {
  user: { id: "user-1", externalSubjectId: "subject-1", email: "partner@example.com" },
  memberships: [{ id: "membership-1", userId: "user-1", role: "partner", status: "active", scope: { organizationId: "org-1" } }],
};

const firstRecord: PartnerContextRecord = {
  organization: { id: "org-1", displayName: "Example Organization" },
  partner: { id: "partner-1", publicId: "KYR-001", status: "active", displayName: "Example Partner" },
  workspaces: [{ id: "workspace-1", displayName: "Primary", access: "external_active" }],
};

function repository(records: PartnerContextRecord[]): PartnerContextRepository {
  return { findByPartnerPublicId: async (publicId) => records.find((record) => record.partner.publicId === publicId) ?? null };
}

function eventPublisher(events: unknown[]): ContextEventPublisher {
  return { publish: async (event) => { events.push(event); } };
}

test("resolves an authorized partner context with its membership and workspace", async () => {
  const events: unknown[] = [];
  const provider = new DefaultPartnerContextProvider(repository([firstRecord]), eventPublisher(events));
  const context = await provider.resolve(actor, { partnerPublicId: "KYR-001" });

  assert.equal(context.partner.publicId, "KYR-001");
  assert.equal(context.workspace.id, "workspace-1");
  assert.equal(context.membership.id, "membership-1");
  assert.deepEqual(events.map((event) => (event as { type: string }).type), ["MembershipResolved", "PartnerContextResolved", "WorkspaceResolved"]);
});

test("denies an external partner access to an internal resource", async () => {
  const provider = new DefaultPartnerContextProvider(repository([firstRecord]));
  const context = await provider.resolve(actor, { partnerPublicId: "KYR-001" });

  assert.throws(() => requireContextAccess(context, "document.read", "internal"), { code: "CONTEXT_ACCESS_DENIED" });
});

test("requires a workspace selection when a partner has no primary workspace", async () => {
  const provider = new DefaultPartnerContextProvider(repository([{ ...firstRecord, workspaces: [
    { id: "workspace-1", displayName: "One", access: "internal" },
    { id: "workspace-2", displayName: "Two", access: "internal" },
  ] }]));

  await assert.rejects(() => provider.resolve(actor, { partnerPublicId: "KYR-001" }));
});

test("switching returns the old cache key and emits a context change", async () => {
  const secondRecord: PartnerContextRecord = {
    ...firstRecord,
    partner: { id: "partner-2", publicId: "KYR-002", status: "onboarding", displayName: "Second Partner" },
    workspaces: [{ id: "workspace-2", displayName: "Second", access: "external_active" }],
  };
  const events: unknown[] = [];
  const publisher = eventPublisher(events);
  const provider = new DefaultPartnerContextProvider(repository([firstRecord, secondRecord]), publisher);
  const currentContext = await provider.resolve(actor, { partnerPublicId: "KYR-001" });
  const result = await switchPartnerContext({ actor, selection: { partnerPublicId: "KYR-002" }, provider, events: publisher, currentContext });

  assert.equal(result.invalidatedContextKey, currentContext.contextKey);
  assert.equal(result.context.partner.publicId, "KYR-002");
  assert.equal((events.at(-1) as { type: string }).type, "PartnerContextChanged");
});
