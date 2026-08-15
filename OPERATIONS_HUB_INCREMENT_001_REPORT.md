# Operations Hub — Increment 001 Report

## Objective

Establish the smallest operational foundation that lets a provisioned Workspace represent KYRUMA's active work for a Partner without creating a generic project-management product or a Drive integration.

## Prior analysis

The existing domain model already defines `Project` as the execution unit owned by a Workspace, with the lifecycle `planned`, `active`, `on_hold`, `completed`, and `cancelled`. The capability catalogue already exposes `project.*`. This increment therefore reuses `Project`; it does not introduce parallel concepts such as Engagement.

## Bounded-context responsibility

Operations Hub owns the operational `Project` aggregate: its identity, lifecycle, scoped business events and the contracts through which a future application can persist or reference work. Workspace remains the permanent context boundary. Partner Creation and Workspace do not know Operations internals.

## Operational work unit

`Project` is the approved initial work unit. It represents one concrete KYRUMA engagement inside one Workspace. Milestones, Deliverables, Tasks and document records remain separate future concerns and are not modelled in this increment.

## Workspace boundary

Operations receives a `ResolvedPartnerContext`; it uses its `organizationId`, `partnerId` and `workspaceId` as immutable scope. Operations is initialized **when KYRUMA starts an operational Project**, not automatically when a Workspace is provisioned. No existing Workspace contract or event justifies automatic provisioning, and deferring creation avoids empty operational records.

## Domain model and lifecycle

`Project` holds its own ID, Organization, Partner, Workspace, name, creator, correlation ID and status. Valid transitions are:

`planned → active | cancelled`

`active → on_hold | completed | cancelled`

`on_hold → active | cancelled`

`completed` and `cancelled` are final in v1. The aggregate queues typed, versioned domain events.

## Authorization

The application uses Foundation's existing `ResolvedPartnerContext` and `requireContextAccess`. Creation requires the existing `project.create` capability. No new role, capability or authorization system was added.

## Events

The foundation defines `ProjectCreated`, `ProjectActivated`, `ProjectPaused`, `ProjectCompleted` and `ProjectCancelled`. Each carries event, correlation, actor, Organization, Partner and Workspace metadata. `CreateProjectUseCase` dispatches `ProjectCreated` only after its transaction succeeds through a port intended to map to the shared Event Bus outbox.

## Persistence

`ProjectRepository` is provider-independent and supports save, read by ID and idempotent read by correlation ID. PostgreSQL, Prisma models, migrations and adapters are intentionally not introduced in Increment 001, so there are no persistence integration tests yet.

## Future Drive boundary

`ProjectDocumentReferencePort` provides the future boundary for document references only. It does not depend on Google SDKs, store files, or expose credentials. A future adapter can connect it to the approved document/storage domain and then to Google Drive.

## Tests and validation

The `test:operations-hub` suite covers valid and invalid lifecycle transitions, value-object validation, scoped event metadata, `project.create` authorization, Workspace isolation and idempotent creation. Foundation, Workspace and Partner Creation remain regression targets for the final validation.

## Risks and decisions pending

- Product must define the metadata, dates and ownership model required for a Project before persistence and UI work begin.
- Product must define Milestone and Deliverable responsibilities before either is added.
- Drive document classification, sharing policy and reference lifecycle require a dedicated specification.
- The Project event dispatcher needs a concrete shared Event Bus outbox adapter when persistence is introduced.

## Recommended Increment 2

Add PostgreSQL persistence for `Project` only: Prisma schema, migration, repository adapter, mapper round-trip and real transaction/idempotency tests. Do not introduce Milestones, Deliverables, Drive, UI or API in that increment unless separately approved.

## Decision

**OPERATIONS HUB — INCREMENT 1 COMPLETE. READY FOR REVIEW.**
