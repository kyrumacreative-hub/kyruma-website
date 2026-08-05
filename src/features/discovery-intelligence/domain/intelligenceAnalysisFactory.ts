import { MissingDiscoverySourceError } from "./errors";
import { IntelligenceAnalysis, type IntelligenceAnalysisProperties } from "./intelligenceAnalysis";

export class IntelligenceAnalysisFactory {
  static request(properties: IntelligenceAnalysisProperties): IntelligenceAnalysis {
    if (!properties.sourceSnapshotId || !properties.discoverySubmissionId || !properties.discoverySubmissionVersion) {
      throw new MissingDiscoverySourceError();
    }
    return new IntelligenceAnalysis(properties);
  }
}
