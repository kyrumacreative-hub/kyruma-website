# PS-011 — Client / Partner Portal

## Status

**ENGINEERING COMPLETE**

## Objective

Give an authenticated Partner a calm, scoped view of its Workspace, shared information, activity and deliverables without exposing KYRUMA internal records.

## Decisions

- The portal is a read model, not a second Workspace Aggregate.
- Every read requires an active Foundation Membership and `workspace.read` in the exact Organization/Partner/Workspace scope.
- Only `shared` and `partner_private` portal projections are visible.
- Activity is a curated projection; Audit and Event Bus payloads are never exposed directly.
- Deliverables are versioned and preserve historical states.
- Empty states disclose no cross-tenant existence.

## Scope

Protected `/portal`, Workspace header, shared information/documents/links, activity feed, deliverables and signed-in identity controls.

Messaging, billing, file upload, project editing and internal notes remain outside v1.

## Acceptance

- Cross-Workspace and cross-Partner reads are denied server-side.
- A Partner sees only explicitly shared records.
- Empty portal sections render safely.
- External links open without leaking session data.
- The portal remains usable with zero shared items.

