import type { ReviewDecisionValue } from "../domain/valueObjects";
import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
export interface AnalysisReviewRecord { readonly id: string; readonly analysisId: string; readonly decision: ReviewDecisionValue; readonly notes?: string; readonly reviewedBy: string; readonly reviewedAt: Date; }
export interface AnalysisReviewRepository { save(review: AnalysisReviewRecord, context: TransactionContext): Promise<void>; findLatest(analysisId: string, context: TransactionContext): Promise<AnalysisReviewRecord | null>; }
