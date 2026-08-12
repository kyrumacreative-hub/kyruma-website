# RFC-017 — Audit Privacy, Retention and Export

## Status

**PROPOSED — Architecture and Legal Review Required Before Production**

## Context

Audit evidence must remain useful without becoming a second store of secrets, documents or unrestricted personal data. Immutability also needs a controlled relationship with minimization, anonymization, retention, future legal holds and authorized exports.

This RFC proposes the technical policy model. It intentionally does not set legally definitive retention durations.

## Proposed decision

Every event is classified at write time by:

- Event type and schema version.
- Data classification.
- Retention category.
- Organization and optional Partner/Workspace scope.
- Policy version used for sanitization.

Audit™ accepts only registered event contracts. Each contract defines allowed `metadata` and `changes` fields, transformation rules, maximum sizes and whether security-restricted access is required. Unknown fields are rejected, not persisted opportunistically.

## Prohibited data

AuditEvent never stores:

- Passwords, password reset values or MFA secrets.
- Access, refresh or invitation tokens.
- Cookies, authorization headers or session contents.
- API keys, private keys, connection strings or credential-bearing URLs.
- Complete documents, form submissions or model responses.
- Raw request/response bodies or unrestricted exception objects.
- Personal data not necessary to identify the audited action.

Sanitization occurs before the persistence adapter. Rejected values must not be copied into logs, dead-letter descriptions or validation errors.

## Changes allowlist

Each auditable action registers allowed fields and one transformation:

- `present/absent` for secrets or binary state.
- Masked suffix/prefix only where operationally justified.
- Enumerated old/new values for non-sensitive state.
- Stable historical identifier for deleted identities.
- Hash or safe reference when equality evidence is needed.
- Omission when the change itself is sensitive and not required.

The default is deny. Full entity serialization is forbidden. Schema review is required whenever a new field or transformation is added.

## Identity lifecycle and anonymization

Audit keeps non-reusable historical identifiers and structural context after User, Contact or Membership deletion. Display names, email addresses and other direct identifiers may be replaced through the approved privacy mechanism while preserving:

- Event identifier and type.
- Organization/resource relationship where lawful.
- Actor type and stable anonymous historical reference.
- Timestamps, result, correlation and schema version.
- Evidence of the privacy operation and policy version.

Anonymization never reassigns evidence to another actor. Re-identification mappings, if legally required, are stored outside Audit with separate access and lifecycle.

## Retention policy model

Initial categories:

1. Security and identity.
2. Authorization and permissions.
3. Data operations.
4. Export, deletion and anonymization.
5. Operational activity.
6. Errors and denied access.

A versioned policy maps category and jurisdictional context to an action after a duration: retain, anonymize or expire through the controlled lifecycle. Product and Architecture define the mechanism; Legal approves actual durations before production.

Policy execution is:

- Bounded and resumable.
- Idempotent.
- Authorized by `audit.retention.manage` plus effective scope.
- Dry-run capable with counts and policy version.
- Blocked by an applicable hold.
- Recorded as independent audit evidence without recursively generating an unbounded event loop.

No UI or repository exposes arbitrary row deletion.

## Future legal hold

The schema and policy engine reserve a hold decision keyed by approved scope, category, resource or time range. A hold suspends expiration/anonymization but does not grant read access. Creating, changing or releasing a hold requires a future legally approved use case, capability and AuditEvent.

Legal hold operation is out of scope for v1; compatibility is required so retention does not need a central-model rewrite.

## Read access

- `audit.read` permits scoped, non-security-restricted events.
- `audit.read.security` additionally permits restricted security classifications within effective scope.
- `audit.export` permits export but does not imply broader read scope.
- `audit.retention.manage` manages policy execution but does not imply unrestricted event content access.

Foundation remains canonical for Membership, capabilities, grants and revocations. Query adapters require Organization scope and apply Partner/Workspace plus classification filters server-side. Access denials reveal no event existence outside authorized scope and are themselves auditable when security-relevant.

## Export model

An export request requires:

- Effective `audit.export` authorization.
- Organization and optional Partner/Workspace scope.
- Bounded time range and explicit filters.
- Requested format and approved field profile.
- Reason/purpose where policy requires it.

Export generation runs after authorization and outside the request transaction. Files are encrypted at rest, use short-lived signed access, have no public permanent URL and expire independently of source evidence. Generated output applies the same classification and minimization rules as interactive reads.

Audit records request, denial, completion, failure and authorized retrieval. The export's own events reference the export job and summary, never the exported payload or signed URL.

## Export safeguards

- Row and byte limits; larger exports require a separate approved workflow.
- Formula-injection-safe CSV encoding when CSV is supported.
- Content type, filename and download headers fixed by the server.
- Short expiration and one Organization per artifact.
- Revocation when requester access is removed, where storage supports it.
- Deletion of expired artifacts through a separate lifecycle; source retention is unaffected.

## Alternatives considered

### Store full before/after snapshots and redact on read

Rejected. It retains unnecessary sensitive data and makes every reader/exporter a privacy boundary.

### Delete AuditEvent on identity deletion

Rejected as the default because it destroys structural evidence. Controlled anonymization satisfies minimization without reassignment.

### One global retention duration

Rejected because security, authorization, operational and privacy events have different purposes and legal requirements.

### Permanent export links

Rejected because links become an uncontrolled secondary disclosure channel.

## Verification required before approval

- Contract tests reject unknown fields, secrets and oversized payloads.
- Sanitization errors do not echo prohibited values.
- Scope and security-classification tests deny cross-tenant reads and exports.
- Anonymization preserves structural traceability and cannot reassign actors.
- Retention dry-run and execution are idempotent and hold-aware.
- Export artifacts expire, contain only authorized fields and audit their lifecycle.
- CSV output is safe from spreadsheet formula execution if CSV is enabled.

## Consequences

Every event type requires an explicit data contract and policy classification. Legal validation of definitive durations remains a production blocker, not an Architecture Review blocker. No changes to Foundation or PS-004–PS-007 are required.

## Architecture and legal questions

1. Choose the controlled anonymization storage mechanism in coordination with RFC-015.
2. Approve the policy registry owner, versioning and rollout process.
3. Define export storage, encryption, expiration and revocation infrastructure.
4. Obtain Legal approval for duration tables and hold procedures before production.
