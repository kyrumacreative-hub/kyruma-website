# Operations Hub v1 — Final Readiness Report

**Date:** 2026-08-15  
**Branch baseline:** `feature/operations-hub` at `548976b` plus the live-smoke blocker fix  
**Scope:** Project lifecycle, PostgreSQL persistence, Event Bus outbox and canonical Project-to-Google-Drive reference only

## Decision

Operations Hub v1 is ready to merge after the live Google Drive smoke exposed and verified one release blocker in the Drive create request URL. The fix separates list parameters from create parameters and is protected by regression coverage.

No Client Access, Portal, Intelligence, Milestones, Deliverables, tasks, UI or additional product capability was introduced.

## Live Google Drive evidence

The smoke used the real `GoogleDriveFolderGateway`, Google Drive API and the `hello@kyruma.com` account with the `drive.file` OAuth scope.

- Google Cloud project: `KYRUMA Production` (internal identifier intentionally omitted).
- Google Drive API: enabled.
- Fixture: `KYR-002`.
- Canonical key: `project-drive:KYR-002:v1.0-final`.
- Invalid credential attempt: failed safely with `DriveReferenceSyncError`.
- First valid attempt: created the canonical folder.
- Repeated valid attempt: resolved the same folder ID; no duplicate was created.
- Canonical folder ID and URL were verified during the smoke and are intentionally omitted from version control.
- OAuth token: temporary, never committed, never included in this report and removed from the local temporary file after the smoke.

## Blocker found and corrected

The initial live create request failed because the adapter reused list-response fields and list-only query parameters for `files.create`. Google Drive correctly rejected that request. `GoogleDriveFolderGateway` now builds a dedicated create URL with `fields=id,webViewLink` and `supportsAllDrives=true`. Tests assert that list-only parameters cannot leak into the create request.

## Validation

- Operations Hub unit/application/adapter suite: 20 passed.
- Operations Hub PostgreSQL persistence suite: 9 passed.
- Prisma schema validation: passed.
- TypeScript: passed.
- ESLint: passed.
- Next.js production build: passed.
- Earlier full branch regression on the same baseline: passed across Foundation, Lead Lifecycle, Discovery Intelligence, Partner, Workspace, Operations Hub and Event Bus.

## Release gate

Operations Hub v1 has passed its engineering and live-Drive gates. It may be merged into `main`, deployed through the existing Git integration and frozen at v1 scope.
