import type { RetentionCategory } from "./types";
export type RetentionAction = "retain" | "anonymize" | "expire";
export interface RetentionRule { readonly category: RetentionCategory; readonly afterDays: number; readonly action: RetentionAction; }
export class RetentionPolicy {
  constructor(readonly version: string, readonly rules: readonly RetentionRule[]) { if (!version.trim() || rules.some((rule) => !Number.isInteger(rule.afterDays) || rule.afterDays < 1)) throw new Error("Invalid retention policy."); Object.freeze(this); }
}
export interface ExportPolicy { readonly maxRows: number; readonly maxRangeDays: number; readonly expiresAfterMinutes: number; }
