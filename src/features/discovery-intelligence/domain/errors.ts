export class InvalidIntelligenceAnalysisIdError extends Error {
  constructor() {
    super("An intelligence analysis identifier must be a non-empty string.");
    this.name = "InvalidIntelligenceAnalysisIdError";
  }
}

export class InvalidDiscoverySubmissionIdError extends Error {
  constructor() {
    super("A discovery submission identifier must be a non-empty string.");
    this.name = "InvalidDiscoverySubmissionIdError";
  }
}

export class InvalidSourceSnapshotError extends Error {
  constructor() {
    super("A source snapshot identifier must be a non-empty string.");
    this.name = "InvalidSourceSnapshotError";
  }
}

export class InvalidVersionError extends Error {
  constructor(name: string) {
    super(`${name} must be a positive integer.`);
    this.name = "InvalidVersionError";
  }
}

export class InvalidModelReferenceError extends Error {
  constructor() {
    super("A model reference must be a non-empty string.");
    this.name = "InvalidModelReferenceError";
  }
}

export class InvalidConfidenceScoreError extends Error {
  constructor() {
    super("Confidence must be a finite number between 0 and 1.");
    this.name = "InvalidConfidenceScoreError";
  }
}

export class InvalidReviewDecisionError extends Error {
  constructor() {
    super("Review decision must be approved, needs_revision, or rejected.");
    this.name = "InvalidReviewDecisionError";
  }
}

export class InvalidCorrelationIdError extends Error {
  constructor() {
    super("A correlation identifier must be a non-empty string.");
    this.name = "InvalidCorrelationIdError";
  }
}

export class InvalidAnalysisMetadataError extends Error {
  constructor(field: "policyVersion" | "requestedBy") {
    super(`${field} must be a non-empty string.`);
    this.name = "InvalidAnalysisMetadataError";
  }
}

export class MissingDiscoverySourceError extends Error {
  constructor() {
    super("An intelligence analysis requires a completed discovery source snapshot.");
    this.name = "MissingDiscoverySourceError";
  }
}

export class InvalidAnalysisStateTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Intelligence analysis cannot transition from ${from} to ${to}.`);
    this.name = "InvalidAnalysisStateTransitionError";
  }
}

export class InvalidSnapshotMetadataError extends Error {
  constructor(field: string) {
    super(`${field} must be a non-empty string.`);
    this.name = "InvalidSnapshotMetadataError";
  }
}

export class IncompleteDiscoverySourceError extends Error {
  constructor() {
    super("A source snapshot can only be created from a completed discovery submission.");
    this.name = "IncompleteDiscoverySourceError";
  }
}

export class InvalidDomainEventIdError extends Error {
  constructor() {
    super("A domain event identifier must be a non-empty string.");
    this.name = "InvalidDomainEventIdError";
  }
}
