# KYR-002 — Event Validation Matrix

## Purpose

Map lifecycle transitions to expected system events and validation evidence.

| Transition | Expected event | Validation |
|---|---|---|
| Lead created | lead.created | Lead persisted and traceable |
| Discovery started | discovery.started | Discovery record available |
| Opportunity qualified | opportunity.qualified | Qualification state updated |
| Proposal created | proposal.created | Proposal reference stored |
| Proposal accepted | proposal.accepted | Commercial state transition confirmed |
| Contract pending | contract.pending | Legal gate recorded |
| Invoice TEST created | invoice.test_created | TEST invoice reference stored |
| Payment simulated | payment.test_received | Verification event captured |
| Workspace activated | workspace.activated | Operational objects available |
| Strategy handoff complete | strategy.handoff_completed | Handoff evidence attached |

## Validation rules

Every event must have:

- Event ID.
- Timestamp.
- Source.
- Entity reference.
- Payload validation.
- Processing result.

## Failure handling

Any missing event blocks lifecycle progression until investigated.
