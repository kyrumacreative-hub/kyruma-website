# Architecture Decision Record — PS-008 Audit™

## ADR-008.1 — Canonical evidence storage

AuditEvent is stored in PostgreSQL as append-only canonical evidence. Runtime repositories expose insert/read only. A database trigger rejects ordinary update/delete; migrations remain additive.

## ADR-008.2 — Controlled privacy lifecycle

AuditEvent rows remain immutable. Privacy transformations are represented by append-only `AuditPrivacyOverlay` records that contain only allowed replacements/masking directives, policy version, actor, reason and time. Readers apply the latest authorized overlay without rewriting historical evidence.

## ADR-008.3 — Transaction semantics

Critical evidence is persisted through the shared `TransactionRunner` and current `TransactionContext`. Any insert failure rolls back the business operation. Failed/denied evidence after rollback uses a separate sanitized transaction. Non-critical evidence may arrive via the existing Event Bus with at-least-once/idempotent processing.

## ADR-008.4 — Idempotency

The normalized key is `(organizationId, correlationId, eventType, resourceType, resourceId, schemaVersion)`. Same semantic evidence returns the existing record; contradictory immutable evidence fails closed.

## ADR-008.5 — Retention

Policies are versioned by category. V1 supports dry-run and append-only execution evidence; physical expiration/anonymization remains disabled without approved durations and future legal-hold checks.

## ADR-008.6 — Export

Export authorization and evidence are implemented in v1. Artifact generation is abstracted behind a port, bounded by Organization/scope/time/profile, with expiry metadata. Public/permanent URLs and unencrypted production artifacts are forbidden.
