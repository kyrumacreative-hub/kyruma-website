# Operations Hub — Increment 3 Report

**Status:** Complete

## Objective

Close the persistent operational lifecycle for `Project`: perform approved state
transitions safely, persist them within the shared transaction boundary, and
make the resulting business facts available to the shared Event Bus only after
commit.

## Lifecycle covered

No Product states were added. The existing lifecycle remains:

```text
planned -> active -> on_hold -> active -> completed
                    \-> cancelled
active --------------------------------> cancelled
planned -------------------------------> cancelled
```

`active` from `on_hold` is the existing resume transition; no separate
`resume` state or use case was introduced. `completed` and `cancelled` remain
terminal.

## Application use cases

- `CreateProjectUseCase`
- `ActivateProjectUseCase`
- `PauseProjectUseCase`
- `CompleteProjectUseCase`
- `CancelProjectUseCase`

Each lifecycle use case validates Foundation access through
`requireContextAccess`, loads the Project in its Organization scope, verifies
the active Workspace, invokes the Aggregate transition, persists it, and writes
the generated event to the shared Event Bus outbox in the same transaction.

## Persistent updates and concurrency

`ProjectRepository.update` is intentionally narrow: it accepts the expected
persisted status observed before the domain transition. The Prisma adapter uses
one scoped `updateMany` condition on Project, Organization, Workspace, and that
expected status. A zero-row update produces `ProjectConcurrencyError` and is
mapped to a safe conflict. This prevents a concurrent lifecycle operation from
silently overwriting a valid transition without adding speculative schema-level
versioning.

## Authorization and isolation

- Creation requires existing `project.create`.
- Lifecycle operations require existing `project.update`.
- A missing capability is denied before persistence.
- Organization and Workspace mismatches return a neutral not-found response and
  do not disclose the Project outside the resolved Partner Context.

No role or capability was added.

## Event Bus and post-commit guarantee

Operations Hub no longer owns a separate dispatcher. `ProjectEventBusOutbox`
translates Project facts to registered, versioned shared Event Bus envelopes:

- `operations.project-created.v1`
- `operations.project-activated.v1`
- `operations.project-paused.v1`
- `operations.project-completed.v1`
- `operations.project-cancelled.v1`

The Project update and EventOutbox append occur in the same
`TransactionRunner.run(...)` callback. Therefore an event cannot become visible
to Event Bus delivery unless the Project transition commits. A rollback leaves
neither state change nor event.

The Event Bus worker delivers records asynchronously after commit. A delivery
failure cannot roll back the already committed Project; the persisted outbox
record remains available to the Event Bus retry/dead-letter flow. This behavior
is covered by integration testing.

## Idempotency

Creation retains its correlation-id idempotency. Lifecycle retries follow the
Aggregate's existing semantics: requesting a transition from its already
reached or otherwise unsupported state is rejected as a conflict; no duplicate
event is appended. Event IDs remain unique in the shared outbox.

## PostgreSQL coverage

Real PostgreSQL integration tests verify:

- Project creation, activation, and rehydration;
- transactional EventOutbox visibility after commit;
- rollback of both lifecycle state and event append;
- compare-and-set protection for concurrent activation attempts;
- no domain events during mapper rehydration;
- persistence after an asynchronous Event Bus delivery failure.

## Validation

All validations passed:

- `test:operations-hub` — 14 tests;
- `test:operations-persistence` — 6 real PostgreSQL tests;
- `test:foundation` — 13 tests;
- `test:lead-lifecycle` — 33 tests;
- `test:partner-creation` and `test:partner-persistence` — 18 tests;
- `test:workspace` — 12 tests;
- `test:discovery-intelligence` — 22 tests;
- `test:event-bus` and `test:event-bus-persistence` — 10 tests;
- `prisma validate` and `prisma generate`;
- TypeScript, lint, and production build.

No Prisma schema change or migration was required. The existing Project and
EventOutbox schema is sufficient. New Operations Hub code contains no `any`,
unsafe cast, or TypeScript suppression escape.

## Remaining risks

The Event Bus outbox is persisted atomically, but an operational worker is
still required to materialize and process pending records. Its retry and
dead-letter behavior is owned by the already integrated Event Bus domain, not
by Operations Hub. No Drive, milestones, deliverables, tasks, API, or UI work
was introduced.

## Recommended Increment 4

Only begin a Product-approved next Operations Hub increment. A possible future
scope is Project-to-Drive reference integration through the existing
`ProjectDocumentReferencePort`; it remains explicitly out of scope here.

