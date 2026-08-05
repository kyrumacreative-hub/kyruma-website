# PS-007 — Workspace™

## 1. Metadata

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | Draft — pending Architecture Decisions |
| Owner | Product |
| Engineering | Pending Technical Review |
| Depends on | Foundation, Partner Creation™ |

## 2. Executive Summary

Workspace™ provides the bounded operational home for an active KYRUMA Partner. It organizes the people, teams, invitations and settings through which future domains operate. It does not implement those domains, a portal, UI or external identity provider.

## 3. Business Context

Once a qualified Lead becomes a Partner, KYRUMA needs a clear, secure and auditable place to collaborate. A Workspace makes access explicit, prevents knowledge and permissions from spreading across unrelated Partners, and lets teams work with the correct scope from the first onboarding step.

## 4. Scope

### In scope

- Create, activate and manage a Partner Workspace.
- Maintain Workspace Members, Teams, invitations and operational Settings.
- Resolve Membership and capability scope through Foundation.
- Record changes in Audit, Timeline and versioned domain events.
- Keep invitation handling idempotent and scoped to one Workspace.

### Out of scope

- Authentication provider, external login, Client Portal, billing, project work, documents, meetings, automation and UI.
- Modifying Partner Creation™, Lead Lifecycle™ or Discovery Intelligence™.
- Automatic account creation or automatic role escalation.

## 5. Domain Definition

### Aggregate Root

**Workspace** is the Aggregate Root. It owns its lifecycle, Settings version and the consistency boundary for its Members, Teams and Invitations. Foundation remains owner of the canonical authorization decision; Workspace supplies scope and membership facts.

### Core entities

- **Workspace**: Partner-scoped operational space.
- **WorkspaceMember**: a membership reference and its Workspace-specific status.
- **Invitation**: a single-use, expiring invitation to a specific Workspace and intended role.
- **Team**: a named collection of active Workspace Members, not a second authorization system.
- **WorkspaceSettings**: versioned operational configuration with a documented owner and audit trail.

### Invariants

- A Workspace belongs to exactly one Partner and Organization.
- A Partner can have several Workspaces, but exactly one is primary.
- A Workspace has no implicit cross-Partner visibility.
- Only active Members may belong to a Team.
- Invitations are single-use, expire and cannot grant capabilities beyond the selected role and Foundation policy.
- Settings changes are versioned, audited and cannot weaken Foundation authorization.
- Every critical operation carries correlation ID, actor, Organization, Partner and Workspace scope.

## 6. State Machine

```text
provisioning → onboarding → active → paused → archived
                  ↓           ↓        ↓
               failed       failed   archived
```

- `provisioning` exists only while the atomic Partner Creation handoff completes.
- `onboarding` is the initial operational state after successful provisioning.
- `active` requires the Product-defined onboarding completion evidence.
- `paused` preserves history and blocks non-administrative operational work.
- `archived` and `failed` are terminal for v1; no deletion occurs.

## 7. Value Objects

- `WorkspaceId`
- `WorkspacePublicReference` (internal until Product approves exposure)
- `PartnerId`
- `OrganizationId`
- `WorkspaceName`
- `WorkspaceStatus`
- `WorkspaceMemberId`
- `MembershipId`
- `TeamId`
- `TeamName`
- `InvitationId`
- `InvitationTokenHash`
- `InvitationExpiry`
- `WorkspaceSettingsVersion`
- `CorrelationId`

## 8. Use Cases

### UC-007.1 — Provision Initial Workspace

Partner Creation requests initial primary Workspace provisioning inside its approved atomic conversion boundary. Workspace stores the resulting Workspace in `onboarding`; it does not activate the Workspace.

### UC-007.2 — Get Workspace Context

An authorized user reads the active Workspace, Settings and membership facts through `ResolvedPartnerContext` without resolving identity or permissions independently.

### UC-007.3 — Invite Member

An authorized internal user creates or resends a single-use invitation for a selected role and Workspace. The operation is idempotent by correlation ID and never exposes PII in URLs.

### UC-007.4 — Accept or Revoke Invitation

Acceptance validates token, expiry, recipient and context before creating/activating the Member through Foundation’s approved membership boundary. Revocation is permanent and auditable.

### UC-007.5 — Manage Member

An authorized user changes a Member’s Workspace status or role within Foundation’s capabilities and scope. Removing a Member preserves history and does not remove the underlying identity record.

### UC-007.6 — Manage Team

An authorized user creates, renames, archives and manages Team membership. Teams organize collaboration only; they do not grant capabilities independently.

### UC-007.7 — Update Settings

An authorized administrator updates versioned Settings with optimistic concurrency and Audit/Timeline records.

### UC-007.8 — Complete Onboarding

An authorized internal user records Product-defined onboarding completion and transitions `onboarding → active`. This is the only activation path.

## 9. Permissions

Foundation capabilities remain canonical. Candidate Workspace actions are mapped through the existing `workspace.read`, `workspace.manage` and `workspace.invite` capabilities; any finer-grained capability needs RFC-014 approval.

| Action | Super Admin | Admin | Strategist | Other internal roles | Partner |
| --- | --- | --- | --- | --- | --- |
| Read | Yes | Yes | Scoped | Scoped read only | Scoped read only after external activation |
| Provision / activate / pause | Yes | Yes | No | No | No |
| Invite / revoke | Yes | Yes | No | No | No |
| Manage members / teams / settings | Yes | Yes | Scoped only if Foundation grants | No | No |

## 10. Domain Events

- `WorkspaceProvisioned`
- `WorkspaceOnboardingStarted`
- `WorkspaceActivated`
- `WorkspacePaused`
- `WorkspaceArchived`
- `WorkspaceMemberInvited`
- `WorkspaceInvitationAccepted`
- `WorkspaceInvitationRevoked`
- `WorkspaceMemberChanged`
- `WorkspaceTeamCreated`
- `WorkspaceTeamChanged`
- `WorkspaceSettingsUpdated`

Events use the versioned, idempotent envelope, minimum payload and correlation ID. Audit and Timeline are projections and never the source of truth.

## 11. Contracts

- `PartnerWorkspaceProvisioningPort`: receives the atomic creation handoff from Partner Creation™.
- `FoundationMembershipPort`: creates or activates membership only through Foundation.
- `InvitationDeliveryPort`: sends a token-free-of-PII invitation after a successful commit.
- `WorkspaceRepository`, `MemberRepository`, `InvitationRepository`, `TeamRepository`, `SettingsRepository`.
- Shared `TransactionRunner`, `AuditContextRecorder`, `DomainEventDispatcher` and future Outbox.

## 12. Data Model

### Workspace

`id`, `partnerId`, `organizationId`, `name`, `status`, `primary`, `settingsVersion`, `createdAt`, `activatedAt?`, `pausedAt?`, `archivedAt?`, `correlationId`.

### WorkspaceMember

`id`, `workspaceId`, `membershipId`, `status`, `joinedAt`, `removedAt?`, `changedBy`, `version`.

### Invitation

`id`, `workspaceId`, `recipientReference` (pending RFC-013), `role`, `tokenHash`, `expiresAt`, `acceptedAt?`, `revokedAt?`, `createdBy`, `correlationId`.

### Team

`id`, `workspaceId`, `name`, `status`, `createdAt`, `archivedAt?`, `version`.

### WorkspaceSettings

`workspaceId`, `version`, `values`, `updatedBy`, `updatedAt`.

## 13. Acceptance Criteria

- A Partner Creation handoff creates one primary Workspace atomically without activating it.
- Every Workspace operation is Organization, Partner and Workspace scoped through Foundation.
- A Workspace cannot have two primary records; secondary Workspaces remain possible.
- Invitation reuse, expiry and revocation are denied safely and idempotently.
- Member and Team changes retain historical traceability.
- A Team cannot override Foundation role, grant or revocation decisions.
- Settings writes reject stale versions and preserve prior audit evidence.
- Cross-Partner reads and writes are denied.

## 14. Edge Cases

- Partner Creation retries: same correlation returns the same primary Workspace.
- Workspace provisioning fails midway: atomic conversion rolls back; no orphan membership/invitation exists.
- An invitation expires or is revoked while acceptance is in flight: one operation can complete; the other is rejected and audited.
- A Foundation membership is revoked while a Workspace Member remains: effective access is denied without erasing Member history.
- A user belongs to several Workspaces: context switch invalidates the previous selection and re-evaluates capabilities.
- Concurrent Settings updates: optimistic version conflict is returned without overwriting the newer change.

## 15. Out of Scope

No UI, API, external identity provider, automatic user creation, notifications beyond the invitation port, project/module ownership, file storage or partner-facing portal are included.

## 16. Future Evolution

Workspace templates, cross-Workspace reporting, guest access, custom roles, notifications and workspace cloning require separate Product Specifications.

## 17. Traceability Matrix

| Need | Use case | Event | Acceptance |
| --- | --- | --- | --- |
| Atomic initial space | Provision Initial Workspace | WorkspaceProvisioned | Single primary Workspace |
| Controlled access | Invite / Manage Member | Invitation/Member events | Foundation-scoped access |
| Collaboration grouping | Manage Team | WorkspaceTeamChanged | Teams never grant permissions |
| Safe configuration | Update Settings | WorkspaceSettingsUpdated | Optimistic versioning |
| Operational activation | Complete Onboarding | WorkspaceActivated | Explicit activation only |
