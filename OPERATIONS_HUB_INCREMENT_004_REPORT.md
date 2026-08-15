# Operations Hub — Increment 4 Report

**Status:** Engineering complete — live Google Drive verification pending configuration

## Objective

Implement the smallest safe Project-to-Drive documentary reference integration.
The result links one existing Operations Hub Project to one canonical Google
Drive folder without adding UI, milestones, deliverables, tasks, or document
content management.

## Delivered scope

- `EnsureProjectDriveReferenceUseCase`, guarded by existing `project.read` and
  the resolved Partner Context;
- `ProjectDocumentReferencePort`, now a provider-neutral canonical-reference
  boundary;
- `DriveProjectDocumentReferenceAdapter`, responsible for retry-safe local
  sync state and canonical reference persistence;
- `GoogleDriveFolderGateway`, a Google Drive REST adapter that finds a folder
  by immutable `kyrumaReferenceKey` before attempting creation;
- `ProjectDocumentReference` PostgreSQL persistence and migration
  `20260815093000_project_document_references`;
- Prisma repository, mapper and real PostgreSQL integration coverage.

## Canonical reference and idempotency

Each Project uses the deterministic key `project-drive:<projectId>`. The
database has unique constraints on `projectId`, `idempotencyKey`, and the
external folder reference. The Google adapter stores the same key in Drive
`appProperties` and looks it up first. A repeat operation returns the existing
linked reference and does not create another folder.

## Scope isolation

The reference stores Project, Organization, Partner and Workspace identifiers.
Every application operation resolves the Project through the active
Organization, Partner and Workspace before calling the adapter. Cross-scope
requests receive a neutral not-found result and make no Drive call.

## Failure and retry semantics

Drive is called outside a database transaction. A provider error cannot alter a
Project. Instead, the reference record moves to `failed`, retains a sanitized
error, and increments its attempt count. The next request reuses the same
idempotency key and can complete the same canonical reference. This was tested
against PostgreSQL with a failed attempt followed by a successful retry.

## PostgreSQL

The migration was applied and tested against `TEST_DATABASE_URL` only. It adds
`ProjectDocumentReference` with:

- exactly one reference record per Project;
- unique canonical external folder reference;
- provider/status integrity checks;
- linked-reference completeness check;
- Organization + Workspace and Partner indexes.

No production database migration, merge, or deployment was performed.

## Google Drive configuration

The adapter is real but intentionally has no credentials in the repository.
Live verification requires server-side configuration in the execution
environment:

- `GOOGLE_DRIVE_ACCESS_TOKEN`
- optionally `GOOGLE_DRIVE_ROOT_FOLDER_ID`
- optionally `GOOGLE_DRIVE_SHARED_DRIVE_ID`

Without them, the integration fails closed with a typed, retryable configuration
error and does not alter Project data. These values must remain uncommitted.

## Validation

Completed:

- Operations Hub unit/application/Drive adapter tests: 19 passed;
- Operations Hub PostgreSQL tests: 9 passed;
- Prisma schema format, generation and validation;
- migration deployment to the test database.

The final full regression passed:

- Foundation: 13 tests;
- Lead Lifecycle: 33 tests;
- Partner Creation and persistence: 18 tests;
- Workspace: 12 tests;
- Discovery Intelligence: 22 tests;
- Event Bus and persistence: 10 tests;
- Operations Hub: 20 tests;
- Operations PostgreSQL: 9 tests.

Prisma validation and generation, TypeScript, lint, build, and unsafe-cast
review all passed. The Operations PostgreSQL runner is intentionally serial:
its integration fixtures share the same test database and must not erase one
another while validating real transactions.

## Remaining operational step

Configure a Google Drive service credential with access only to the approved
KYRUMA document root, then run the planned `KYR-002` end-to-end smoke test.
This is an operations configuration task, not a code or architecture blocker.
