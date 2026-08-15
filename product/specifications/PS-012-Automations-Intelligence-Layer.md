# PS-012 — Automations / Intelligence Layer

## Status

**ENGINEERING COMPLETE**

## Objective

Execute approved, bounded reactions to versioned Event Bus events while preserving idempotency, tenant isolation, auditability and human control over future Intelligence capabilities.

## Decisions

- Event Bus envelopes are the trigger input; Automation never reads transport tables as business state.
- Definitions are Organization-scoped, versioned and explicitly activated.
- Conditions are deterministic equality checks against allowlisted payload paths.
- v1 actions are allowlisted: portal activity publication, notification request and Intelligence request.
- Intelligence requests require `humanReviewRequired: true`; no autonomous business decision is permitted.
- `(automationId, sourceEventId)` makes execution idempotent under at-least-once delivery.
- Runs record status, attempts, result or safe error code and retain correlation.
- `automation.read` and `automation.manage` are additive Foundation capabilities.

## Scope

Automation definitions, trigger matching, action registry, idempotent runs, Event Bus handler boundary, retry-ready persistence and future Intelligence port.

Visual workflow builders, arbitrary code, arbitrary HTTP calls, secrets in action config and autonomous Partner/financial decisions remain outside v1.

## Acceptance

- Inactive, wrong-tenant or wrong-version definitions never execute.
- Re-delivery does not repeat a completed logical run.
- Unknown actions fail closed.
- Intelligence cannot execute without human-review policy.
- Failures are explicit and never expose raw secrets.

