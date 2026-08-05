# RFC-013 — Workspace Invitation Security

## Problem

Workspace invitations require a recipient reference and an external delivery path. This introduces contact PII, token security, expiry, revocation and audit constraints not resolved by the current Foundation contracts.

## Recommendation

- Store only a normalized, encrypted recipient contact reference and a one-way token hash.
- Deliver a random single-use token without PII in its URL.
- Default expiry: **7 days**; Product may approve a different business value before Engineering.
- On acceptance or revocation, invalidate the token atomically and retain an audit record.
- The delivery adapter executes only post-commit and has no authority to activate membership.

## Impact and risk

The security model is compatible with Foundation and the approved Discovery invitation approach. Product/legal must approve the expiry and retention period before production delivery. This is blocking for invitations, but not for Aggregate-only Engineering.

## Product decision

**Approved:** secure token, persistent hash, expiry, revocation and full audit are mandatory.

## Architecture decision

**APPROVED.** The domain receives a cryptographically secure opaque token, stores only its hash, and atomically marks an invitation accepted or revoked. The delivery adapter receives the opaque token only after commit and never activates a membership itself. Recipient contact is classified as PII, encrypted at rest by the future infrastructure adapter, and excluded from URLs, events and logs.

Expiry duration, retention duration and delivery provider remain operational configuration. They do not block the domain, persistence contracts or safe default implementation.
