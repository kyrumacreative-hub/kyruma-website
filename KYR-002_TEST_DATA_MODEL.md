# KYR-002 — Test Data Model

## Environment

Environment: TEST ONLY

All entities created during the dry run must be clearly marked and isolated from production data.

## Naming convention

Prefix:

`TEST-KYR-002`

## Required entities

### Lead

- Lead ID
- Source
- Contact information
- Lifecycle state

Initial state:

`NEW`

### Opportunity

- Opportunity ID
- Linked lead
- Qualification state
- Commercial value TEST

Initial state:

`QUALIFICATION`

### Proposal

- Proposal ID
- Version
- Status

Initial state:

`DRAFT_TEST`

### Contract

- Contract ID
- Template version
- Approval state

Initial state:

`PENDING_LEGAL`

### Invoice

- Invoice ID
- TEST reference
- Status

Initial state:

`TEST_CREATED`

### Workspace

- Workspace ID
- Owner
- Activation state

Initial state:

`PENDING_ACTIVATION`

## Validation rule

Every entity transition must generate traceable evidence before moving to the next lifecycle stage.
