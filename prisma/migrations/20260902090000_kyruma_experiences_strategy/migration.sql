INSERT INTO "RadarEntry" (
  "id", "organizationId", "radarId", "title", "description", "sourceReference", "category", "observedAt",
  "problemOpportunity", "potentialApplication", "relatedModule", "impactEstimate", "effortEstimate", "priority",
  "notes", "nextAction", "status", "createdBy", "createdAt", "updatedAt"
) VALUES
  (
    'radar-global-022', 'kyruma-global', '022', 'Spatial UI Track Effect',
    'Referencia estratégica para interfaces espaciales con movimiento vinculado a la navegación.',
    'approved-context:radar-022', 'immersive_experience', '2026-09-02T00:00:00.000Z',
    'Explorar cuándo una interfaz espacial mejora la comprensión y el storytelling.',
    'Incorporarlo como patrón futuro de KYRUMA Experience Library.', 'KYRUMA Experiences',
    'unknown', 'unknown', 'medium',
    'Relacionado con RADAR 023; no implica implementación en producción.',
    'Documentar una referencia verificable antes de iniciar un prototipo.', 'WATCH',
    'system:approved-context', '2026-09-02T00:00:00.000Z', '2026-09-02T00:00:00.000Z'
  ),
  (
    'radar-global-023', 'kyruma-global', '023', 'Immersive Product Websites / Cinematic Scroll',
    'Capacidad estratégica para experiencias web premium donde producto, motion, interacción, storytelling y tecnología forman una única experiencia.',
    'approved-context:radar-023', 'immersive_experience', '2026-09-02T00:00:00.000Z',
    'Diferenciar KYRUMA mediante product experience e immersive storytelling cuando aporten valor real.',
    'Desarrollar progresivamente KYRUMA Experiences y una librería interna de patrones reutilizables.', 'KYRUMA Experiences',
    'high', 'high', 'high',
    'P2 Strategic R&D. No desplaza Client Delivery ni Sales/Growth y no autoriza una demo grande.',
    'Seleccionar un caso real y definir el alcance medible de KYRUMA Experience Lab — Prototype 001.', 'WATCH',
    'system:approved-context', '2026-09-02T00:00:00.000Z', '2026-09-02T00:00:00.000Z'
  )
ON CONFLICT ("organizationId", "radarId") DO NOTHING;

INSERT INTO "RadarHistory" (
  "id", "radarEntryId", "organizationId", "fromStatus", "toStatus", "decision", "notes", "changedBy", "changedAt"
)
SELECT
  'radar-global-022-history-1', "id", 'kyruma-global', NULL, 'WATCH',
  'Spatial UI queda relacionado con KYRUMA Experience Library como referencia de investigación.',
  'Sin componente ni dependencia nueva hasta existir un caso real.',
  'system:approved-context', '2026-09-02T00:00:00.000Z'
FROM "RadarEntry"
WHERE "organizationId" = 'kyruma-global' AND "radarId" = '022'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "RadarHistory" (
  "id", "radarEntryId", "organizationId", "fromStatus", "toStatus", "decision", "notes", "changedBy", "changedAt"
)
SELECT
  'radar-global-023-history-1', "id", 'kyruma-global', NULL, 'WATCH',
  'KYRUMA Experiences se aprueba como capacidad estratégica P2 de alta prioridad R&D.',
  'Beautiful outside. Intelligent inside. Investigación primero; Client Delivery mantiene prioridad P0.',
  'system:approved-context', '2026-09-02T00:00:00.000Z'
FROM "RadarEntry"
WHERE "organizationId" = 'kyruma-global' AND "radarId" = '023'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "BrainRecord" (
  "id", "organizationId", "partnerId", "workspaceId", "projectId", "scopeType", "dnaType", "recordType",
  "title", "content", "sourceReference", "status", "createdBy", "createdAt", "updatedAt"
) VALUES (
  'brain-global-kyruma-experiences-strategy-v1', 'kyruma-global', NULL, NULL, NULL, 'GLOBAL', 'STRATEGY',
  'strategic_capability', 'KYRUMA Experiences™',
  '{"status":"STRATEGIC CAPABILITY — HIGH PRIORITY R&D","principle":"Beautiful outside. Intelligent inside.","definition":"Immersive digital experiences that unite design, product, motion, interaction, storytelling and technology.","offeringTiers":["STANDARD WEB","PREMIUM WEB","KYRUMA EXPERIENCE"],"priorityOrder":["P0 — CLIENT DELIVERY","P1 — SALES / GROWTH","P2 — STRATEGIC INTERNAL INFRASTRUCTURE / R&D"],"radarReferences":["022 — Spatial UI Track Effect","023 — Immersive Product Websites / Cinematic Scroll"],"guardrails":["Use complexity only when it improves storytelling, product understanding, differentiation or engagement.","Do not add heavy production dependencies without a real use case.","Respect reduced motion, responsive behaviour, accessibility and low-performance fallbacks.","Keep KYRUMA Experiences separate from the KYRUMA OS / AI core."],"prototypeBacklog":"KYRUMA EXPERIENCE LAB — PROTOTYPE 001"}'::jsonb,
  'approved-context:kyruma-experiences-2026-09-02', 'active', 'system:approved-context',
  '2026-09-02T00:00:00.000Z', '2026-09-02T00:00:00.000Z'
)
ON CONFLICT ("id") DO NOTHING;
