# AS-001 — Functional Acceptance Gate

Status: **NOT EXECUTED**. Required before merging PR #59 into `main`.

## Test environment

Use an isolated preview/staging project with a disposable PostgreSQL database, a separate Clerk instance, and test-only email inboxes. Do not point `DATABASE_URL` or `TEST_DATABASE_URL` at production. Do not use a real KYRUMA partner or live invitation. Configure one test internal administrator and two test partner identities, A and B.

Never publish environment values, raw invitation tokens, cookies, or credentials in logs, PRs, or screenshots.

## Acceptance scenarios

| ID | Action | Expected outcome | Evidence to retain |
| --- | --- | --- | --- |
| E2E-01 | Non-admin invokes direct provisioning | Server refuses; no Lead, Partner, Workspace, or Membership created | Sanitized status and unchanged record counts |
| E2E-02 | Admin invokes direct provisioning with flag absent/false | `ACCESS_DIRECT_PROVISIONING_DISABLED`; no persistence mutations | Sanitized error and unchanged record counts |
| E2E-03 | Admin opens access control page with flag absent | Exceptional provisioning form absent; normal invitation workflow remains present | Redacted screenshot |
| E2E-04 | Admin creates normal partner invitation for A | Invitation pending; no active membership before acceptance | Sanitized invitation status + membership query |
| E2E-05 | A accepts a valid invitation | Membership activated only for designated Organization/Partner/Workspace | Redacted acceptance record and scope |
| E2E-06 | B attempts A's Workspace | Access denied with no shared items disclosed | Status and filtered query result |
| E2E-07 | Admin revokes A's membership | WorkspaceMember removed/revoked atomically; subsequent portal access denied | Membership state and denied portal response |
| E2E-08 | Reissue expired/pending invitation | Old invitation unusable; new token works only for correct identity/scope | Redacted invitation-state transitions |
| E2E-09 | Production config includes direct-provisioning flag `true` | Production configuration check fails, disallowing deploy | Non-secret CI output |
| E2E-10 | Duplicate/parallel submissions | No unintended duplicate active memberships or cross-organization access | Record counts and IDs redacted |

## Sign-off

- [x] `npm run test:access-provisioning-contract` incorporated into Validate
- [x] `test:access` and `test:access-persistence` covered by Validate
- [x] GitHub Validate run **38313546262** passed on **daf3772** (historical evidence; rerun for latest SHA)
- [x] Vercel preview **READY** on **daf3772** (historical evidence; rerun for latest SHA)
- [ ] E2E-01 through E2E-10 executed in isolation, evidence reviewed
- [ ] Security reviewer signs off
- [ ] Latest commit CI + preview green
- [ ] Explicit release decision recorded

**Merge gate: BLOCKED until all unchecked items are verified.**

These steps are instructions for an isolated test run, not proof that those tests have been executed.
