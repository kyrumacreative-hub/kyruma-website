# Architecture Decision Record — PS-005 Discovery Intelligence™

## AD-005.1 — Scope transversal

**Decisión:** `IntelligenceScope` se deriva de un contexto resuelto existente, Organization o Partner; no se crea un contexto mutable nuevo.

## AD-005.2 — Authorization

**Decisión:** capacidades `intelligence.*` aditivas, evaluadas mediante Membership, scope, visibilidad, grants y revocations. La matriz por rol no sustituye la autorización.

## AD-005.3 — Modelo y datos

**Decisión:** gateway provider‑agnostic; snapshots minimizados; PII redactada; prompts, modelos y políticas versionados; sin entrenamiento ni acciones autónomas.

## AD-005.4 — Consistencia y efectos externos

**Decisión:** snapshot y solicitud se persisten con Transactional Outbox; un worker idempotente llama al gateway fuera de la transacción; solo revisión humana aprueba un resultado.

## Resultado

Estas decisiones son compatibles con Foundation y con el principio de Intelligence exclusivamente asistencial.
