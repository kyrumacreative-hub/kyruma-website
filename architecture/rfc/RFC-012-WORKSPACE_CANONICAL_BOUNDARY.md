# RFC-012 — Canonical Workspace Boundary

## Problem

Partner Creation™ currently persists a `PartnerWorkspace` provisioning record while Foundation exposes a `WorkspaceContext` read contract. PS-007 introduces Workspace as a domain Aggregate. Two writable canonical Workspace models would create inconsistent context resolution and ownership.

## Alternatives

1. Treat `PartnerWorkspace` as the permanent Workspace Aggregate.
2. Create a new Workspace Aggregate and retain `PartnerWorkspace` as an immutable provisioning handoff.
3. Merge Workspace persistence into Foundation.

## Recommendation

**Option 2.** Workspace™ owns the canonical Workspace Aggregate. `PartnerWorkspace` remains a narrowly scoped record proving atomic provisioning by Partner Creation; it is never independently managed. A future additive migration links the canonical Workspace to the original provisioning record by immutable ID. Foundation remains a resolver, not a writable Workspace domain.

## Impact and risk

No PS-006 rewrite is required. Engineering must define an idempotent handoff and migration path before real Workspace persistence. The risk is blocking: without one canonical record, context and lifecycle rules can diverge.

## Product decision

**Approved:** Workspace™ is canonical; Partner Creation requests creation and stores only `workspaceId`.

## Architecture action

Validate the additive handoff/link strategy and future migration compatibility.
