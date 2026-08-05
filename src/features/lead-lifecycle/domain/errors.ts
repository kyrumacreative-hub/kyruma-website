export class InvalidLeadStateError extends Error {
  readonly code = "INVALID_LEAD_STATE";
}

export class InvalidLeadOriginError extends Error {
  readonly code = "INVALID_LEAD_ORIGIN";
}

export class MissingOwnerError extends Error {
  readonly code = "MISSING_OWNER";
}

export class MissingOrganizationError extends Error {
  readonly code = "MISSING_ORGANIZATION";
}

export class MissingPrimaryContactError extends Error {
  readonly code = "MISSING_PRIMARY_CONTACT";
}

export class DuplicateActiveLeadError extends Error {
  readonly code = "DUPLICATE_ACTIVE_LEAD";
}

export class InvalidLeadIdentifierError extends Error {
  readonly code = "INVALID_LEAD_IDENTIFIER";
}
