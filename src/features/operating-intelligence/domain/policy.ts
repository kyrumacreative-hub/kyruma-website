export const GLOBAL_KYRUMA_ORGANIZATION_ID = "kyruma-global";

export const radarStatuses = ["OBSERVED", "ANALYZED", "WATCH", "TEST", "APPROVED", "ACTION", "RESULT"] as const;
export type RadarStatus = (typeof radarStatuses)[number];

export const brainScopes = ["GLOBAL", "CLIENT", "PROJECT"] as const;
export type BrainScope = (typeof brainScopes)[number];

export const brainDnaTypes = ["GENERAL", "STRATEGY", "BRAND", "CONTENT"] as const;
export type BrainDnaType = (typeof brainDnaTypes)[number];

export const hookBlocks = [
  "Los que funcionan siempre",
  "Los que despiertan curiosidad",
  "Los que van al ego",
  "Los que confrontan",
  "Los que segmentan y conectan",
  "Los que dan autoridad y prueba",
  "Los que simplifican y prometen",
  "Los que juegan con opciones y contrastes",
  "Los visuales y los de listas",
] as const;

const radarTransitions: Readonly<Record<RadarStatus, readonly RadarStatus[]>> = {
  OBSERVED: ["ANALYZED"],
  ANALYZED: ["WATCH", "TEST", "APPROVED"],
  WATCH: ["ANALYZED", "TEST"],
  TEST: ["ANALYZED", "APPROVED", "RESULT"],
  APPROVED: ["ACTION"],
  ACTION: ["RESULT"],
  RESULT: ["WATCH"],
};

export function requireText(value: unknown, field: string, maxLength = 4_000): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || text.length > maxLength) throw new Error(`OPERATING_INTELLIGENCE_${field.toUpperCase()}_INVALID`);
  return text;
}

export function optionalText(value: unknown, maxLength = 4_000): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return undefined;
  if (text.length > maxLength) throw new Error("OPERATING_INTELLIGENCE_TEXT_TOO_LONG");
  return text;
}

export function optionalNonNegativeInteger(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error("OPERATING_INTELLIGENCE_NUMBER_INVALID");
  return parsed;
}

export function parseRadarStatus(value: unknown): RadarStatus {
  if (typeof value !== "string" || !radarStatuses.includes(value as RadarStatus)) throw new Error("RADAR_STATUS_INVALID");
  return value as RadarStatus;
}

export function assertRadarTransition(from: RadarStatus, to: RadarStatus): void {
  if (from === to) return;
  if (!radarTransitions[from].includes(to)) throw new Error("RADAR_TRANSITION_INVALID");
}

export function nextRadarStatuses(from: RadarStatus): readonly RadarStatus[] {
  return radarTransitions[from];
}

export function parseBrainScope(value: unknown): BrainScope {
  if (typeof value !== "string" || !brainScopes.includes(value as BrainScope)) throw new Error("BRAIN_SCOPE_INVALID");
  return value as BrainScope;
}

export function parseBrainDna(value: unknown): BrainDnaType {
  if (typeof value !== "string" || !brainDnaTypes.includes(value as BrainDnaType)) throw new Error("BRAIN_DNA_INVALID");
  return value as BrainDnaType;
}

export function assertBrainScope(scope: BrainScope, workspaceId?: string, projectId?: string): void {
  if (scope === "GLOBAL" && (workspaceId || projectId)) throw new Error("BRAIN_GLOBAL_SCOPE_INVALID");
  if (scope === "CLIENT" && (!workspaceId || projectId)) throw new Error("BRAIN_CLIENT_SCOPE_INVALID");
  if (scope === "PROJECT" && (!workspaceId || !projectId)) throw new Error("BRAIN_PROJECT_SCOPE_INVALID");
}

const workflowKeys = new Set(["content-ideas", "problem-to-hook", "reel-script", "social-proof", "saveable-content", "repurpose", "cta-engine"]);

export function resolveWorkflowKey(intent: string): string | undefined {
  return workflowKeys.has(intent) ? intent : undefined;
}
