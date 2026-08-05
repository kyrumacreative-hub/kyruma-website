# RFC-014 — Workspace Membership and Teams

## Problem

Partner Creation™ creates an initial Owner Membership record but no canonical user subject is defined in that record. PS-007 needs Members and Teams without creating a second authorization model or allowing Teams to grant capabilities.

## Recommendation

- Foundation `Membership` remains the only authority for user identity, role, grants, revocations and scopes.
- WorkspaceMember references an existing Foundation Membership; it never duplicates the user or role.
- Teams are organizational collections only and cannot create, remove or override capabilities.
- `workspace.read`, `workspace.manage` and `workspace.invite` remain the initial canonical capability set. Finer permissions require an explicit capability RFC.
- Partner Creation must nominate an existing internal Foundation Membership as its initial Owner, or defer activation until one is supplied.

## Impact and risk

This avoids authorization divergence. The requirement to nominate an actual initial Owner is blocking for the integrated atomic creation flow because the current provisioning record has no user reference.

## Product decision

**Approved:** the initial Owner comes from the Membership created in PS-006, and a Workspace begins with exactly one active Owner.

## Architecture action

Validate the reference integrity and confirm Foundation Membership remains canonical for identity, role, grants and revocations.
