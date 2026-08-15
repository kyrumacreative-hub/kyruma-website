# Platform Experience Program — PS-010 to PS-012

## Decision

**ENGINEERING COMPLETE — EXTERNAL ACTIVATION GATES REMAIN**

## Delivered

### PS-010

- Clerk SDK and Next.js 16 Proxy protection.
- Sign-in, sign-up, sessions, provider recovery and account controls.
- Internal identity mapping, Foundation Membership persistence and scoped access resolution.
- Hash-only, expiring, single-use invitation acceptance with atomic Membership activation.

### PS-011

- Protected Partner portal.
- Organization/Partner/Workspace-scoped read service.
- Shared information, curated activity and versioned deliverables.
- Safe empty and pending-access states.

### PS-012

- Versioned Automation definitions and runs.
- Event Bus trigger matching, action registry and idempotency.
- Portal, notification and human-reviewed Intelligence action boundaries.
- Additive `automation.read` and `automation.manage` capabilities.

## Persistence

Migration `20260815090000_platform_experience_program` adds identity, Membership, invitations, portal projections, Automation definitions and runs with restrictive foreign keys, unique idempotency keys, scope indexes and state checks.

## Security review

- External authentication and internal authorization remain separate.
- All Partner reads are re-authorized server-side.
- Invitation secrets are hash-only and email-bound.
- Automation actions are allowlisted; arbitrary code and HTTP execution are absent.
- Intelligence remains assistive and human-reviewed.
- No secret values are committed.

## External gates

Before production:

1. Provision Clerk through the approved Vercel integration and configure production keys.
2. Configure verified sending domain, invitation/recovery templates, MFA and session policies.
3. Apply the PostgreSQL migration in staging and production through the release procedure.
4. Seed authorized Memberships and portal projections for the pilot Partner.
5. Run real browser smoke tests for login, recovery, invitation, portal isolation and logout.

These are environment activation gates. They do not justify claiming production deployment from this branch.

## Validation record

- Prisma schema validation and Client generation: PASS.
- PS-010 access tests: PASS.
- PS-011 portal authorization tests: PASS.
- PS-012 automation/idempotency tests: PASS.
- Foundation, Workspace, Event Bus, Audit, Discovery Intelligence and Partner Creation regression: PASS.
- TypeScript, ESLint and Next.js production build: PASS.
- Production dependency audit: 0 known vulnerabilities after compatible Next.js, Prisma, PostCSS and nanoid remediation.
- PostgreSQL application test: pending because this isolated checkout has no `TEST_DATABASE_URL`; migration must be applied in staging before merge/release.
