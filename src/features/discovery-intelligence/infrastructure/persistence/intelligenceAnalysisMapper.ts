import { IntelligenceAnalysis, type RestoredIntelligenceAnalysisProperties } from "../../domain/intelligenceAnalysis";
import {
  AnalysisVersion,
  ConfidenceScore,
  CorrelationId,
  DiscoverySubmissionId,
  DiscoverySubmissionVersion,
  IntelligenceAnalysisId,
  ModelReference,
  ModelRunId,
  PromptTemplateVersion,
  SourceSnapshotId,
  type AnalysisStatusValue,
} from "../../domain/valueObjects";

export interface IntelligenceAnalysisPersistenceModel {
  id: string;
  sourceSnapshotId: string;
  discoverySubmissionId: string;
  discoverySubmissionVersion: number;
  analysisVersion: number;
  status: AnalysisStatusValue;
  modelReference: string;
  modelRunId?: string;
  promptTemplateVersion: number;
  policyVersion: string;
  requestedBy: string;
  requestedAt: Date;
  generatedAt?: Date;
  failedAt?: Date;
  archivedAt?: Date;
  confidence?: number;
  correlationId: string;
}

export const IntelligenceAnalysisMapper = {
  toPersistence(analysis: IntelligenceAnalysis): IntelligenceAnalysisPersistenceModel {
    return {
      id: analysis.id.value,
      sourceSnapshotId: analysis.sourceSnapshotId.value,
      discoverySubmissionId: analysis.discoverySubmissionId.value,
      discoverySubmissionVersion: analysis.discoverySubmissionVersion.value,
      analysisVersion: analysis.analysisVersion.value,
      status: analysis.status,
      modelReference: analysis.modelReference.value,
      modelRunId: analysis.modelRunId?.value,
      promptTemplateVersion: analysis.promptTemplateVersion.value,
      policyVersion: analysis.policyVersion,
      requestedBy: analysis.requestedBy,
      requestedAt: new Date(analysis.requestedAt),
      generatedAt: analysis.generatedAt,
      failedAt: analysis.failedAt,
      archivedAt: analysis.archivedAt,
      confidence: analysis.confidence?.value,
      correlationId: analysis.correlationId.value,
    };
  },

  toDomain(model: IntelligenceAnalysisPersistenceModel): IntelligenceAnalysis {
    const properties: RestoredIntelligenceAnalysisProperties = {
      id: new IntelligenceAnalysisId(model.id),
      sourceSnapshotId: new SourceSnapshotId(model.sourceSnapshotId),
      discoverySubmissionId: new DiscoverySubmissionId(model.discoverySubmissionId),
      discoverySubmissionVersion: new DiscoverySubmissionVersion(model.discoverySubmissionVersion),
      analysisVersion: new AnalysisVersion(model.analysisVersion),
      status: model.status,
      modelReference: new ModelReference(model.modelReference),
      modelRunId: model.modelRunId ? new ModelRunId(model.modelRunId) : undefined,
      promptTemplateVersion: new PromptTemplateVersion(model.promptTemplateVersion),
      policyVersion: model.policyVersion,
      requestedBy: model.requestedBy,
      requestedAt: new Date(model.requestedAt),
      generatedAt: model.generatedAt ? new Date(model.generatedAt) : undefined,
      failedAt: model.failedAt ? new Date(model.failedAt) : undefined,
      archivedAt: model.archivedAt ? new Date(model.archivedAt) : undefined,
      confidence: model.confidence === undefined ? undefined : new ConfidenceScore(model.confidence),
      correlationId: new CorrelationId(model.correlationId),
    };
    return IntelligenceAnalysis.restore(properties);
  },
};
