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

## Architecture decision

**APPROVED.** The canonical Workspace uses the `workspaceId` allocated during the approved Partner Creation transaction. An additive Workspace persistence record will use that identifier as its primary key and retain `partnerId`, Organization scope and correlation ID. `PartnerWorkspace` remains the one-way provisioning evidence only; it cannot own state or lifecycle.

This preserves existing PS-006 data and allows a migration-free idempotent handoff for new records. No Foundation contract changes are required.
