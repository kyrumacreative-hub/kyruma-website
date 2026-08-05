import {
  InvalidConfidenceScoreError,
  InvalidCorrelationIdError,
  InvalidDiscoverySubmissionIdError,
  InvalidIntelligenceAnalysisIdError,
  InvalidModelReferenceError,
  InvalidReviewDecisionError,
  InvalidSourceSnapshotError,
  InvalidVersionError,
} from "./errors";

abstract class NonEmptyStringValueObject {
  readonly value: string;

  protected constructor(value: string, createError: () => Error) {
    if (value.trim().length === 0) throw createError();
    this.value = value;
  }
}

export class IntelligenceAnalysisId extends NonEmptyStringValueObject {
  constructor(value: string) { super(value, () => new InvalidIntelligenceAnalysisIdError()); }
}

export class DiscoverySubmissionId extends NonEmptyStringValueObject {
  constructor(value: string) { super(value, () => new InvalidDiscoverySubmissionIdError()); }
}

export class SourceSnapshotId extends NonEmptyStringValueObject {
  constructor(value: string) { super(value, () => new InvalidSourceSnapshotError()); }
}

export class ModelReference extends NonEmptyStringValueObject {
  constructor(value: string) { super(value, () => new InvalidModelReferenceError()); }
}

export class ModelRunId extends NonEmptyStringValueObject {
  constructor(value: string) { super(value, () => new InvalidModelReferenceError()); }
}

export class CorrelationId extends NonEmptyStringValueObject {
  constructor(value: string) { super(value, () => new InvalidCorrelationIdError()); }
}

abstract class PositiveIntegerValueObject {
  readonly value: number;

  protected constructor(value: number, name: string) {
    if (!Number.isInteger(value) || value < 1) throw new InvalidVersionError(name);
    this.value = value;
  }
}

export class DiscoverySubmissionVersion extends PositiveIntegerValueObject {
  constructor(value: number) { super(value, "Discovery submission version"); }
}

export class AnalysisVersion extends PositiveIntegerValueObject {
  constructor(value: number) { super(value, "Analysis version"); }
}

export class PromptTemplateVersion extends PositiveIntegerValueObject {
  constructor(value: number) { super(value, "Prompt template version"); }
}

export class ConfidenceScore {
  readonly value: number;

  constructor(value: number) {
    if (!Number.isFinite(value) || value < 0 || value > 1) throw new InvalidConfidenceScoreError();
    this.value = value;
  }
}

export const analysisStatuses = [
  "requested",
  "processing",
  "generated",
  "under_review",
  "approved",
  "needs_revision",
  "rejected",
  "superseded",
  "failed",
  "archived",
] as const;

export type AnalysisStatusValue = (typeof analysisStatuses)[number];

export class AnalysisStatus {
  readonly value: AnalysisStatusValue;

  constructor(value: AnalysisStatusValue) { this.value = value; }
}

export const reviewDecisions = ["approved", "needs_revision", "rejected"] as const;
export type ReviewDecisionValue = (typeof reviewDecisions)[number];

export class ReviewDecision {
  readonly value: ReviewDecisionValue;

  constructor(value: string) {
    if (!reviewDecisions.includes(value as ReviewDecisionValue)) throw new InvalidReviewDecisionError();
    this.value = value as ReviewDecisionValue;
  }
}
