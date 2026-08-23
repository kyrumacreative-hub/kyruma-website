# KYR-001 — Real Operational Pilot Checklist

**Client:** KYR-001  
**Mode:** Real client; controlled internal operation  
**Initial state:** `NOT EXECUTED`

This checklist validates that KYRUMA reduces operational effort with a real client. It is not evidence until an operator records dates, actors, identifiers and artifact locations.

## Pilot scope

- [ ] Confirm KYR-001 consent, access boundaries and responsible internal owner.
- [ ] Confirm workspace and active project identifiers.
- [ ] Create one real operational task from an approved lifecycle event.
- [ ] Verify idempotency by replaying the same event once.
- [ ] Create or link one strategy deliverable.
- [ ] Record one approval or revision decision.
- [ ] Complete one follow-up task and record elapsed time.
- [ ] Review the KYR-001 status in `/access/operations`.
- [ ] Confirm no client PII appears in Event Bus payloads or worker logs.
- [ ] Compare manual baseline time with the KYRUMA-assisted flow.

## Evidence required

| Item | Required record |
| --- | --- |
| Pilot window | Start/end timestamps and operator |
| Client/workspace | Stable identifiers; no secrets |
| Workflow | Previous/new states and event ID |
| Automation | Definition ID, run ID, attempts and result |
| Deliverable | Canonical link and approval state |
| Efficiency | Manual baseline, assisted time and assumptions |
| Privacy | Log/event review result |
| Decision | PASS, FAIL or BLOCKED with reason |

## Acceptance rule

PASS requires one complete, traceable client workflow, no duplicate side effects, no PII leakage in infrastructure events and an evidenced reduction in operator time. A partial run remains `BLOCKED`; observations must not be converted into estimates after the fact.

