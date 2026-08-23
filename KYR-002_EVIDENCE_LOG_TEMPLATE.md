# KYR-002 — Evidence Log Template

Use this record for each dry run step.

## Evidence record

- Evidence ID:
- Date/time:
- Responsible actor:
- Environment: TEST
- Entity ID:
- Previous state:
- New state:
- Action performed:
- Evidence location:
- Source commit/deployment ID:
- Correlation/event/run ID:
- Validation result:
- Validator/reviewer:
- External approval type (if applicable):
- Artifact version/hash (if applicable):
- Contains client PII: YES / NO
- Notes:

## Integrity rules

- Every transition must be traceable.
- TEST evidence must not be mixed with production data.
- External approvals must be attached before final PASS decision.
- Never record secret values, authorization headers or full production database URLs.
- A technical test cannot be relabeled as Legal or Commercial approval.
- Failed and partial attempts remain in the log; do not overwrite them with the final result.
