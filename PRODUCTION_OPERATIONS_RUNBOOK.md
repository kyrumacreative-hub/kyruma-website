# Production Operations Runbook

## Purpose

Deploy and validate the hardening and operating-layer changes without mixing TEST and Production evidence or performing an implicit database migration during a Vercel build.

## 1. Pre-deployment gate

- Review and merge PR #5 before PR #6.
- Confirm every GitHub validation check is green.
- Confirm the production database has a current, restorable backup or equivalent provider recovery point.
- Add `ACCESS_INVITATION_TOKEN_SECRET`, `APP_URL` and `KYRUMA_DEFAULT_LEAD_OWNER_ID` to Vercel Production.
- Run `npm run verify:production-config` in a context containing the Production-scoped values. Do not print values into logs.
- Run `npm run verify:repository-hygiene` and `npm audit`.

Stop if any check fails. Do not reuse TEST database URLs, owners, invitation tokens or evidence in Production.

## 2. Database release

Vercel builds do not run migrations. From an approved release environment with the Production `DATABASE_URL`:

1. Confirm the target hostname and database name out of band.
2. Review pending Prisma migrations.
3. Run `npm run db:migrate:deploy` once.
4. Record the command result, timestamp, operator and recovery point in the evidence log.

Do not run `migrate dev`, reset, seed or destructive repair commands against Production.

## 3. Application release

- Deploy the merged revision.
- Verify `/`, `/contacto`, `/discovery` and the authenticated `/access/operations` route.
- Submit one controlled production lead using an address authorized for operational testing.
- Verify that the lead is created once and that repeated delivery with the same submission ID does not duplicate it.
- Complete Discovery and Qualification through the internal UI.
- Confirm the event contains identifiers and lifecycle state, but no email, name or free-text PII.

## 4. Worker and cron smoke test

The single scheduled job is `GET /api/cron/operations`, once daily. It processes access and automation queues with a bounded batch of 100 items per queue.

- An unauthenticated request must return `401`.
- An authenticated request using `Authorization: Bearer <CRON_SECRET>` must return a successful summary.
- Retain response status, timestamp, deployment ID and the related Vercel log. Never retain the authorization header.
- Confirm repeated processing does not create duplicate operational tasks.

## 5. Observation and rollback

Observe the first scheduled run for authentication failures, database errors, retries and dead-letter growth. If the application revision is faulty, roll back the deployment while retaining the database migration; use a forward corrective migration for schema issues. Never reset the Production database.

## Release evidence record

- Release commit/deployment:
- Operator:
- Recovery point:
- Production config validator result:
- Migration result:
- Public smoke result:
- Authenticated operations smoke result:
- Cron negative-auth result:
- Cron authorized result:
- Idempotency result:
- Logs/evidence locations:
- Rollback decision:

