# RFC-016 — Audit Transaction and Delivery Model

## Status

**PROPOSED — Architecture Review Required**

## Context

PS-008 distinguishes evidence that is mandatory for a critical state change from evidence that may be delivered reliably after commit. Treating both paths identically either weakens critical guarantees or couples every non-critical action to Audit availability.

## Proposed decision

Adopt two explicit delivery paths with one canonical normalization and persistence contract.

### Path A — transactional audit

Critical operations call the Audit writer inside the existing shared `TransactionRunner`. Domain state and AuditEvent insert commit or roll back together. The use case supplies an already authorized `AuditWriteRequest`; the Audit adapter validates and sanitizes it before insert.

This path is mandatory for:

- Permission, role, grant and revocation changes.
- Partner creation and Workspace activation.
- Invitation acceptance and revocation.
- Export, deletion and anonymization decisions.
- Extraordinary administrative operations.

If the required evidence cannot persist, the primary operation fails. No post-commit callback may substitute for this guarantee.

### Path B — reliable asynchronous audit

Non-critical evidence may be written as an Outbox message in the domain transaction. A worker later normalizes and persists the AuditEvent, then marks the message delivered. A future Event Bus may transport the message, but the durable Outbox is the delivery guarantee.

The asynchronous path never creates an AuditEvent with `success` until the originating operation has committed. Consumers treat delivery as at-least-once and rely on idempotent insertion.

## Shared request contract

Both paths carry:

- Event type and schema version.
- Actor type and identifier.
- Organization and optional Partner/Workspace scope.
- Resource type and identifier.
- Action and proposed result.
- Occurrence time, correlation, optional causation and request IDs.
- Retention category and data classification.
- Allowlisted metadata and changes.

The contract excludes arbitrary entity snapshots, HTTP headers, credentials and unbounded error objects.

## Transaction boundaries

- Audit™ reuses the platform `TransactionRunner`; it does not create a second transaction abstraction.
- The Audit repository receives the current transaction context through the approved persistence boundary.
- External delivery, export file generation and notifications never execute inside the database transaction.
- A domain event and AuditEvent may share correlation but remain separate records and contracts.
- A transaction rollback discards a proposed `success` AuditEvent with the business change.

When policy requires evidence of the failed attempt, a separate failure-recording operation runs after rollback with `failed` or `denied`, sanitized error classification and the original correlation ID. Failure to record that secondary event must be observable and retryable; it must not rewrite the rolled-back operation as successful.

## Idempotency

At most one confirmed evidence exists for:

`organizationId + correlationId + eventType + resourceType + resourceId + schemaVersion`

The canonical key is normalized before persistence and enforced by a database uniqueness strategy compatible with RFC-015. A duplicate with the same semantic result returns the existing identifier. A duplicate carrying a contradictory result or immutable payload is rejected and raises an integrity signal; it is never silently overwritten.

Retry attempts can be represented in technical telemetry or delivery-attempt storage, not as contradictory AuditEvents.

## Ordering

Audit™ guarantees deterministic query order, not global causal serialization.

- `occurredAt` represents the source action time.
- `recordedAt` represents canonical persistence time.
- `causationId` links dependent actions when known.
- Consumers order by `occurredAt`, `recordedAt`, then `id`.
- Late asynchronous events retain their original occurrence time and later recording time.

No consumer may infer transaction order from Event Bus delivery order alone.

## Retry and dead-letter handling

- Workers use bounded exponential backoff with jitter.
- Retry counters and last failure class stay outside the immutable business evidence.
- Poison messages move to a restricted dead-letter state after the configured limit.
- Reprocessing requires authorization, preserves the original request and remains idempotent.
- Alerts distinguish temporary delivery delay from permanent validation rejection.

Messages rejected for secret leakage or invalid scope are quarantined without persisting the unsafe payload into AuditEvent or general logs.

## Failure matrix

| Failure | Transactional path | Asynchronous path |
| --- | --- | --- |
| Validation/sanitization fails | Roll back primary operation | Reject/quarantine message |
| Audit insert fails | Roll back primary operation | Retry delivery |
| Primary operation rolls back | No `success`; optional separate `failed` | Outbox row rolls back |
| Duplicate same evidence | Return existing evidence | Acknowledge delivery |
| Duplicate contradictory evidence | Fail and signal integrity error | Dead-letter and alert |
| Event Bus unavailable | Not relevant | Outbox remains pending |

## Alternatives considered

### All events synchronous

Rejected because non-critical actions would inherit Audit availability and latency without a Product requirement.

### All events via Event Bus

Rejected because a publish-after-commit gap can lose critical evidence and a publish-before-commit path can record false success.

### Best-effort background logging

Rejected because it provides neither durable delivery nor reliable idempotency.

## Verification required before approval

- Transaction integration test proves business state and required AuditEvent roll back together.
- A rolled-back operation never yields `success`.
- Outbox replay produces one confirmed AuditEvent under at-least-once delivery.
- Contradictory duplicates fail closed.
- Event Bus outage does not affect transactional evidence or lose asynchronous requests.
- Failure/denial recording never includes raw exceptions, credentials or protected resource details.

## Consequences

Domains must classify auditable actions as transactional or asynchronous explicitly. This proposal reuses shared transaction infrastructure and leaves Foundation and PS-004–PS-007 unchanged. Engineering implementation requires separate approval after this RFC.

## Architecture questions

1. Confirm the platform Outbox contract and ownership for asynchronous audit requests.
2. Confirm how the current transaction context reaches the Audit adapter without domain coupling.
3. Approve duplicate semantics for same-key payload mismatches.
4. Define operational retry, dead-letter and alert thresholds before production.

