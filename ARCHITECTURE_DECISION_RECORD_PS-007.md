# Architecture Decision Record — PS-007 Workspace™

## ADR-007.1 — Canonical Workspace

**Decision:** Workspace™ is the canonical Aggregate; Partner Creation retains only immutable provisioning evidence and `workspaceId`. **Status:** approved by RFC-012.

## ADR-007.2 — Invitations

**Decision:** hash-only secure token, no PII in URL/events/logs, atomic invalidation and post-commit delivery. **Status:** approved by RFC-013.

## ADR-007.3 — Members and Teams

**Decision:** Foundation Membership is canonical; Team is non-authorizing; the PS-006 Owner identifier validates through a fail-closed Foundation port. **Status:** approved by RFC-014.

## ADR-007.4 — Activation

**Decision:** Workspace activation stays explicitly separate from provisioning and accepts only a Product-provided onboarding-completion attestation. **Status:** approved; Product owns the operational checklist.
