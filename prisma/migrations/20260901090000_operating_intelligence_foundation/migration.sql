CREATE TABLE "RadarEntry" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "radarId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "sourceReference" TEXT,
  "category" TEXT NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL,
  "problemOpportunity" TEXT,
  "potentialApplication" TEXT,
  "relatedModule" TEXT NOT NULL,
  "impactEstimate" TEXT NOT NULL,
  "effortEstimate" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "notes" TEXT,
  "nextAction" TEXT,
  "status" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RadarEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RadarHistory" (
  "id" TEXT NOT NULL,
  "radarEntryId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "fromStatus" TEXT,
  "toStatus" TEXT NOT NULL,
  "decision" TEXT,
  "notes" TEXT,
  "changedBy" TEXT NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RadarHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BrainRecord" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "scopeType" TEXT NOT NULL,
  "dnaType" TEXT NOT NULL,
  "recordType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "sourceReference" TEXT,
  "status" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BrainRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentHook" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "hookId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "block" TEXT NOT NULL,
  "explanation" TEXT,
  "structure" TEXT,
  "example" TEXT,
  "recommendedObjective" TEXT,
  "applications" JSONB NOT NULL,
  "active" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentHook_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HookPerformance" (
  "id" TEXT NOT NULL,
  "hookId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "contentId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "views" INTEGER,
  "reach" INTEGER,
  "retention" DOUBLE PRECISION,
  "likes" INTEGER,
  "comments" INTEGER,
  "shares" INTEGER,
  "saves" INTEGER,
  "conversion" DOUBLE PRECISION,
  "measuredAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HookPerformance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentWorkflowDefinition" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "inputSchema" JSONB NOT NULL,
  "steps" JSONB NOT NULL,
  "status" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "humanReviewRequired" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentWorkflowDefinition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentWorkflowRun" (
  "id" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "aiRequestId" TEXT,
  "input" JSONB NOT NULL,
  "output" JSONB,
  "status" TEXT NOT NULL,
  "requestedBy" TEXT NOT NULL,
  "requestedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "ContentWorkflowRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentOpportunity" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "opportunityType" TEXT NOT NULL,
  "sourceReference" TEXT,
  "relatedCampaign" TEXT,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3),
  "status" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentOpportunity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VisualRecipe" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "masterPrompt" TEXT,
  "version" INTEGER NOT NULL,
  "requiredVariables" JSONB NOT NULL,
  "optionalVariables" JSONB NOT NULL,
  "compatibleFormats" JSONB NOT NULL,
  "restrictions" JSONB NOT NULL,
  "negativeInstructions" TEXT,
  "example" TEXT,
  "status" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VisualRecipe_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OperationalFriction" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "problem" TEXT NOT NULL,
  "area" TEXT NOT NULL,
  "affectedPersona" TEXT NOT NULL,
  "frequency" TEXT NOT NULL,
  "minutesLost" INTEGER,
  "impact" TEXT NOT NULL,
  "currentWorkaround" TEXT,
  "potentialOsSolution" TEXT,
  "potentialAiSolution" TEXT,
  "effortEstimate" TEXT NOT NULL,
  "estimatedMinutesSaved" INTEGER,
  "priority" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "result" TEXT,
  "errorReduction" DOUBLE PRECISION,
  "processReduction" DOUBLE PRECISION,
  "businessImpact" TEXT,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OperationalFriction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiWorkRequest" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "request" TEXT NOT NULL,
  "intent" TEXT NOT NULL,
  "contextSnapshot" JSONB NOT NULL,
  "selectedWorkflowKey" TEXT,
  "status" TEXT NOT NULL,
  "result" JSONB,
  "humanReviewRequired" BOOLEAN NOT NULL,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AiWorkRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RadarEntry_organizationId_radarId_key" ON "RadarEntry"("organizationId", "radarId");
CREATE INDEX "RadarEntry_organizationId_status_priority_observedAt_idx" ON "RadarEntry"("organizationId", "status", "priority", "observedAt");
CREATE INDEX "RadarEntry_relatedModule_status_idx" ON "RadarEntry"("relatedModule", "status");
CREATE INDEX "RadarHistory_organizationId_radarEntryId_changedAt_idx" ON "RadarHistory"("organizationId", "radarEntryId", "changedAt");
CREATE INDEX "BrainRecord_organizationId_scopeType_status_updatedAt_idx" ON "BrainRecord"("organizationId", "scopeType", "status", "updatedAt");
CREATE INDEX "BrainRecord_workspaceId_dnaType_status_idx" ON "BrainRecord"("workspaceId", "dnaType", "status");
CREATE INDEX "BrainRecord_projectId_status_idx" ON "BrainRecord"("projectId", "status");
CREATE UNIQUE INDEX "ContentHook_organizationId_hookId_key" ON "ContentHook"("organizationId", "hookId");
CREATE INDEX "ContentHook_organizationId_block_active_idx" ON "ContentHook"("organizationId", "block", "active");
CREATE INDEX "HookPerformance_organizationId_workspaceId_platform_measuredAt_idx" ON "HookPerformance"("organizationId", "workspaceId", "platform", "measuredAt");
CREATE INDEX "HookPerformance_hookId_measuredAt_idx" ON "HookPerformance"("hookId", "measuredAt");
CREATE UNIQUE INDEX "ContentWorkflowDefinition_organizationId_key_version_key" ON "ContentWorkflowDefinition"("organizationId", "key", "version");
CREATE INDEX "ContentWorkflowDefinition_organizationId_status_key_idx" ON "ContentWorkflowDefinition"("organizationId", "status", "key");
CREATE INDEX "ContentWorkflowRun_organizationId_status_requestedAt_idx" ON "ContentWorkflowRun"("organizationId", "status", "requestedAt");
CREATE INDEX "ContentWorkflowRun_workspaceId_requestedAt_idx" ON "ContentWorkflowRun"("workspaceId", "requestedAt");
CREATE INDEX "ContentWorkflowRun_aiRequestId_idx" ON "ContentWorkflowRun"("aiRequestId");
CREATE INDEX "ContentOpportunity_organizationId_startsAt_status_idx" ON "ContentOpportunity"("organizationId", "startsAt", "status");
CREATE INDEX "ContentOpportunity_workspaceId_startsAt_idx" ON "ContentOpportunity"("workspaceId", "startsAt");
CREATE UNIQUE INDEX "VisualRecipe_key_key" ON "VisualRecipe"("key");
CREATE INDEX "VisualRecipe_status_category_idx" ON "VisualRecipe"("status", "category");
CREATE INDEX "OperationalFriction_organizationId_status_priority_updatedAt_idx" ON "OperationalFriction"("organizationId", "status", "priority", "updatedAt");
CREATE INDEX "OperationalFriction_workspaceId_status_idx" ON "OperationalFriction"("workspaceId", "status");
CREATE INDEX "AiWorkRequest_organizationId_status_createdAt_idx" ON "AiWorkRequest"("organizationId", "status", "createdAt");
CREATE INDEX "AiWorkRequest_workspaceId_status_createdAt_idx" ON "AiWorkRequest"("workspaceId", "status", "createdAt");

ALTER TABLE "RadarHistory" ADD CONSTRAINT "RadarHistory_radarEntryId_fkey" FOREIGN KEY ("radarEntryId") REFERENCES "RadarEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "HookPerformance" ADD CONSTRAINT "HookPerformance_hookId_fkey" FOREIGN KEY ("hookId") REFERENCES "ContentHook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContentWorkflowRun" ADD CONSTRAINT "ContentWorkflowRun_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "ContentWorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RadarEntry" ADD CONSTRAINT "RadarEntry_status_check" CHECK ("status" IN ('OBSERVED', 'ANALYZED', 'WATCH', 'TEST', 'APPROVED', 'ACTION', 'RESULT'));
ALTER TABLE "RadarEntry" ADD CONSTRAINT "RadarEntry_estimates_check" CHECK ("impactEstimate" IN ('unknown', 'low', 'medium', 'high') AND "effortEstimate" IN ('unknown', 'low', 'medium', 'high'));
ALTER TABLE "RadarEntry" ADD CONSTRAINT "RadarEntry_priority_check" CHECK ("priority" IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE "RadarHistory" ADD CONSTRAINT "RadarHistory_status_check" CHECK (("fromStatus" IS NULL OR "fromStatus" IN ('OBSERVED', 'ANALYZED', 'WATCH', 'TEST', 'APPROVED', 'ACTION', 'RESULT')) AND "toStatus" IN ('OBSERVED', 'ANALYZED', 'WATCH', 'TEST', 'APPROVED', 'ACTION', 'RESULT'));
ALTER TABLE "BrainRecord" ADD CONSTRAINT "BrainRecord_scope_check" CHECK ("scopeType" IN ('GLOBAL', 'CLIENT', 'PROJECT'));
ALTER TABLE "BrainRecord" ADD CONSTRAINT "BrainRecord_dna_check" CHECK ("dnaType" IN ('GENERAL', 'STRATEGY', 'BRAND', 'CONTENT'));
ALTER TABLE "BrainRecord" ADD CONSTRAINT "BrainRecord_status_check" CHECK ("status" IN ('draft', 'active', 'archived'));
ALTER TABLE "BrainRecord" ADD CONSTRAINT "BrainRecord_scope_reference_check" CHECK (("scopeType" = 'GLOBAL' AND "workspaceId" IS NULL AND "projectId" IS NULL) OR ("scopeType" = 'CLIENT' AND "workspaceId" IS NOT NULL AND "projectId" IS NULL) OR ("scopeType" = 'PROJECT' AND "workspaceId" IS NOT NULL AND "projectId" IS NOT NULL));
ALTER TABLE "ContentWorkflowDefinition" ADD CONSTRAINT "ContentWorkflowDefinition_status_check" CHECK ("status" IN ('draft', 'active', 'paused', 'archived'));
ALTER TABLE "ContentWorkflowRun" ADD CONSTRAINT "ContentWorkflowRun_status_check" CHECK ("status" IN ('queued', 'running', 'review_required', 'completed', 'failed'));
ALTER TABLE "ContentOpportunity" ADD CONSTRAINT "ContentOpportunity_status_check" CHECK ("status" IN ('observed', 'planned', 'active', 'completed', 'dismissed'));
ALTER TABLE "VisualRecipe" ADD CONSTRAINT "VisualRecipe_status_check" CHECK ("status" IN ('draft', 'test', 'active', 'archived'));
ALTER TABLE "OperationalFriction" ADD CONSTRAINT "OperationalFriction_status_check" CHECK ("status" IN ('observed', 'analyzed', 'test', 'action', 'result', 'closed'));
ALTER TABLE "OperationalFriction" ADD CONSTRAINT "OperationalFriction_estimate_check" CHECK ("effortEstimate" IN ('unknown', 'low', 'medium', 'high'));
ALTER TABLE "OperationalFriction" ADD CONSTRAINT "OperationalFriction_priority_check" CHECK ("priority" IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE "OperationalFriction" ADD CONSTRAINT "OperationalFriction_metrics_check" CHECK (("minutesLost" IS NULL OR "minutesLost" >= 0) AND ("estimatedMinutesSaved" IS NULL OR "estimatedMinutesSaved" >= 0) AND ("errorReduction" IS NULL OR ("errorReduction" >= 0 AND "errorReduction" <= 1)) AND ("processReduction" IS NULL OR ("processReduction" >= 0 AND "processReduction" <= 1)));
ALTER TABLE "AiWorkRequest" ADD CONSTRAINT "AiWorkRequest_status_check" CHECK ("status" IN ('queued', 'context_ready', 'running', 'review_required', 'completed', 'failed', 'cancelled'));

INSERT INTO "RadarEntry" ("id", "organizationId", "radarId", "title", "category", "observedAt", "relatedModule", "impactEstimate", "effortEstimate", "priority", "nextAction", "status", "createdBy", "createdAt", "updatedAt") VALUES
  ('radar-global-020', 'kyruma-global', '020', 'AI Social Visual Recipes', 'creative_intelligence', '2026-09-01T00:00:00.000Z', 'Create', 'unknown', 'unknown', 'medium', 'Incorporar los prompts maestros aprobados y ejecutar una prueba interna.', 'TEST', 'system:approved-context', '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  ('radar-global-021', 'kyruma-global', '021', 'Productized Service / Low-Ticket Entry Offer', 'business_model', '2026-09-01T00:00:00.000Z', 'Strategy', 'unknown', 'unknown', 'medium', 'Definir un experimento con alcance, precio y plazo cerrados antes de construir checkout.', 'WATCH', 'system:approved-context', '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z')
ON CONFLICT ("organizationId", "radarId") DO NOTHING;

INSERT INTO "RadarHistory" ("id", "radarEntryId", "organizationId", "fromStatus", "toStatus", "decision", "changedBy", "changedAt") VALUES
  ('radar-global-020-history-1', 'radar-global-020', 'kyruma-global', NULL, 'TEST', 'Estructura preparada; prompts maestros y generación permanecen pendientes.', 'system:approved-context', '2026-09-01T00:00:00.000Z'),
  ('radar-global-021-history-1', 'radar-global-021', 'kyruma-global', NULL, 'WATCH', 'Registrado como experimento; no se construye ecommerce.', 'system:approved-context', '2026-09-01T00:00:00.000Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ContentWorkflowDefinition" ("id", "organizationId", "key", "name", "description", "inputSchema", "steps", "status", "version", "humanReviewRequired", "createdAt", "updatedAt") VALUES
  ('workflow-content-ideas-v1', 'kyruma-global', 'content-ideas', 'Ideas de contenido', 'Genera ideas accionables desde marca, audiencia, objetivo, plataforma y contexto disponible.', '["brand","audience","objective","platform","context"]', '["CONTEXT","IDEAS","HUMAN_REVIEW"]', 'active', 1, TRUE, '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  ('workflow-problem-hook-v1', 'kyruma-global', 'problem-to-hook', 'Problem → Hook', 'Convierte frustraciones o deseos observados en hooks candidatos.', '["audience_problem","desired_outcome","platform"]', '["PROBLEM","HOOK_LIBRARY","HOOKS","HUMAN_REVIEW"]', 'active', 1, TRUE, '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  ('workflow-reel-script-v1', 'kyruma-global', 'reel-script', 'Reel Script', 'Estructura un guion como Hook, historia o desarrollo, value y CTA.', '["topic","objective","audience","platform"]', '["HOOK","STORY","VALUE","CTA","HUMAN_REVIEW"]', 'active', 1, TRUE, '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  ('workflow-social-proof-v1', 'kyruma-global', 'social-proof', 'Social Proof', 'Convierte evidencia verificable en una pieza de prueba social.', '["verified_evidence","audience","platform"]', '["VERIFY","FRAME","DRAFT","HUMAN_REVIEW"]', 'active', 1, TRUE, '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  ('workflow-saveable-v1', 'kyruma-global', 'saveable-content', 'Saveable Content', 'Estructura contenido pensado para ser guardado.', '["topic","audience","utility","platform"]', '["UTILITY","STRUCTURE","DRAFT","HUMAN_REVIEW"]', 'active', 1, TRUE, '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  ('workflow-repurpose-v1', 'kyruma-global', 'repurpose', 'Repurpose', 'Transforma una pieza fuente en formatos sociales relevantes.', '["source_content","target_formats","objective"]', '["SOURCE","EXTRACT","ADAPT","HUMAN_REVIEW"]', 'active', 1, TRUE, '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  ('workflow-cta-v1', 'kyruma-global', 'cta-engine', 'CTA Engine', 'Propone CTA según el objetivo elegido.', '["objective","context","platform"]', '["OBJECTIVE","CTA_OPTIONS","HUMAN_REVIEW"]', 'active', 1, TRUE, '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z')
ON CONFLICT ("organizationId", "key", "version") DO NOTHING;

INSERT INTO "VisualRecipe" ("id", "key", "name", "category", "description", "masterPrompt", "version", "requiredVariables", "optionalVariables", "compatibleFormats", "restrictions", "negativeInstructions", "example", "status", "updatedAt") VALUES
  ('visual-recipe-airdrop', 'airdrop', 'AirDrop', 'social_visual', NULL, NULL, 1, '[]', '[]', '[]', '[]', NULL, NULL, 'draft', '2026-09-01T00:00:00.000Z'),
  ('visual-recipe-is-calling', 'is-calling', 'Is Calling', 'social_visual', NULL, NULL, 1, '[]', '[]', '[]', '[]', NULL, NULL, 'draft', '2026-09-01T00:00:00.000Z'),
  ('visual-recipe-outfit', 'outfit', 'Outfit', 'social_visual', NULL, NULL, 1, '[]', '[]', '[]', '[]', NULL, NULL, 'draft', '2026-09-01T00:00:00.000Z'),
  ('visual-recipe-live-location', 'live-location', 'Live Location', 'social_visual', NULL, NULL, 1, '[]', '[]', '[]', '[]', NULL, NULL, 'draft', '2026-09-01T00:00:00.000Z'),
  ('visual-recipe-you-and-me', 'you-and-me', 'You & Me', 'social_visual', NULL, NULL, 1, '[]', '[]', '[]', '[]', NULL, NULL, 'draft', '2026-09-01T00:00:00.000Z'),
  ('visual-recipe-mini-me', 'mini-me', 'Mini Me', 'social_visual', NULL, NULL, 1, '[]', '[]', '[]', '[]', NULL, NULL, 'draft', '2026-09-01T00:00:00.000Z')
ON CONFLICT ("key") DO NOTHING;
