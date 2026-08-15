# PS-010 — Identity / Access Experience

## Status

**ENGINEERING COMPLETE — PROVIDER ACTIVATION REQUIRED**

## Objective

Provide real login, session, recovery and invitation experiences while Foundation remains the canonical authority for Membership, role, scope, grants and revocations.

## Decisions

- Clerk is the external identity provider for authentication, sessions, MFA-ready recovery and account UI.
- `IdentityUser.externalSubjectId` links an external subject to one internal identity.
- Authentication never grants product access by itself; an active Foundation Membership is mandatory.
- Invitations are Organization-scoped, single-use, expiring and stored only as SHA-256 hashes.
- Acceptance requires an authenticated identity whose normalized primary email matches the invitation.
- Membership creation and invitation claim are atomic and race-safe.
- `/portal`, `/access` and protected APIs are guarded by Next.js 16 Proxy and re-authorized in server code.

## Scope

Sign-in/sign-up, session UI, recovery through Clerk, identity synchronization, pending-access state, invitation acceptance and Foundation Membership activation.

Provider tenant creation, production keys, email branding and production MFA policy are release configuration, not source code.

## Acceptance

- Anonymous portal requests are redirected to sign-in.
- A valid session without Membership reaches pending access, never Partner data.
- Tokens are never persisted in plaintext.
- Expired, reused or wrong-email invitations fail closed.
- An accepted invitation creates exactly one active scoped Membership.

