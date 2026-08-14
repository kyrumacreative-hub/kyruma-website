# Operations Hub — Increment 002 Report

## Objective

Add real PostgreSQL persistence for the approved `Project` aggregate without expanding Operations Hub.

## Project persistence model

The model persists only existing aggregate data: ID, Organization ID, Partner ID, Workspace ID, name, status, creation timestamp, creator and correlation ID. No dates, owner, budget, description, Milestones, Deliverables or Drive data were added.

## Prisma and migration

`Project` is an independent Prisma model with explicit scoped IDs rather than cross-context relations. The migration `20260814180323_add_operations_projects` creates:

- a primary key on `id`;
- a unique constraint on `correlationId` for idempotent creation;
- indexes on `organizationId` and `workspaceId` for the scoped access patterns already defined by architecture.

It has no foreign keys, defaults or destructive operations. It was generated without applying it to development, then applied only to `TEST_DATABASE_URL`.

## Mapper and rehydration

`ProjectMapper` converts between the aggregate and `ProjectPersistenceModel`. `ProjectFactory.rehydrate` explicitly reconstructs persisted state without recording creation events or bypassing value-object and state validation.

## Repository and transaction context

`PrismaProjectRepository` uses only the shared `PrismaTransactionContextStore`; it opens no private transaction. All calls run inside the existing `TransactionRunner.run(...)` boundary. Reads by ID include Organization scope, while correlation lookup supports the established idempotency flow.

## PostgreSQL guarantees

Integration tests against `TEST_DATABASE_URL` prove:

- committed Projects can be loaded and exactly rehydrated;
- Organization, Partner, Workspace, status and correlation are preserved;
- a Project cannot be retrieved through a different Organization scope;
- the database unique constraint rejects duplicate correlations;
- a deliberate error rolls the Project back completely;
- a persistence failure leaves the application event dispatcher untouched.

## Validation

Passed:

- `test:operations-hub` — 7 tests;
- `test:operations-persistence` — 6 PostgreSQL and mapper tests;
- Foundation;
- Partner Creation and Partner PostgreSQL persistence;
- Workspace domain, contracts and PostgreSQL persistence;
- Event Bus and Event Bus PostgreSQL persistence;
- Prisma validate and generate;
- lint;
- TypeScript through all suites and production build;
- production build.

## Remaining risks

The migration is versioned but must be applied through the normal release process to any future operational environment. There is still no concrete Event Bus outbox adapter for Project events, no Project update persistence operation, and no Drive integration; all remain intentionally out of scope.

## Recommended Increment 3

Add only the approved Project lifecycle application use cases and corresponding persistence update operation, including post-commit Event Bus outbox integration if separately authorized. Do not add Milestones, Deliverables, Drive, UI or API without a Product decision.

## Decision

**OPERATIONS HUB — INCREMENT 2 COMPLETE. READY FOR REVIEW.**
