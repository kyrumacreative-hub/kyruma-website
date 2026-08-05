# Technical Review — PS-007 Workspace™

## Decision

**APPROVED WITH CONDITIONS**

## Architecture

The proposed Aggregate is compatible with Foundation only if it consumes `ResolvedPartnerContext` and delegates authorization to canonical capabilities. It must not turn Foundation context models into a second Workspace persistence layer.

## Domain boundaries

Workspace owns operational Workspace lifecycle, members, invitations, teams and settings. Partner Creation owns the atomic conversion and initial provisioning request. Lead Lifecycle™ and Discovery Intelligence™ are read-only upstream sources and must not be modified.

## Data and integrity

The primary Workspace partial unique constraint introduced by PS-006 is compatible with PS-007. The canonical record versus provisioning record relationship requires RFC-012. Invitations require RFC-013. Members require RFC-014. Settings need optimistic concurrency; events need correlation and idempotency.

## Security

Context isolation, Membership scope, grants and revocations are implementable with Foundation. Invitation PII and recipient verification cannot be implemented safely until RFC-013 is approved. Teams must remain non-authorizing.

## Conditions

- Approve RFC-012, RFC-013 and RFC-014.
- Product defines onboarding completion evidence.
- No implementation creates a second membership, role or Workspace context mechanism.

## Recommendation

Proceed to Architecture Review, not Engineering. The conditions are blocking for a v1 functional implementation.
