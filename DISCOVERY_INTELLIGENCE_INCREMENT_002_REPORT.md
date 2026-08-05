# Discovery Intelligence™ — Increment 002 Report

## Estado

**Completado** en `feature/discovery-intelligence` y alineado con PS-005 Discovery Intelligence™ v1.0.

## Alcance entregado

- `DiscoverySourceSnapshot` inmutable, versionado y vinculado a una Submission concreta.
- Servicios puros `IntelligenceAnalysisService`, `IntelligenceSnapshotService` y `ConfidenceAssessmentService`.
- `ConfidenceScore` tratado exclusivamente como dato informativo validado entre `0` y `1`; no existe un algoritmo de scoring.
- Ocho eventos oficiales de PS-005, con envelope versionado: identificador, Aggregate, tipo de Aggregate, versión, fecha y correlation ID.
- Gestión de eventos pendientes en `IntelligenceAnalysis`: `recordEvent`, `pullDomainEvents` y `clearDomainEvents`.
- Pruebas unitarias para inmutabilidad, versionado, eventos, servicios, transiciones, errores y límites de confianza.

## Garantías de dominio

- El Snapshot solo se crea a partir de una fuente declarada como `completed` y no muta la fuente original.
- Su payload se copia y congela en profundidad para preservar trazabilidad de auditoría.
- Un Analysis registra los eventos oficiales al solicitarse, iniciarse, generarse, fallar, revisarse, sustituirse o archivarse.
- Los eventos son internos: no hay Event Bus, Outbox, persistencia ni consumidores en este incremento.
- Ningún servicio inicia, completa ni altera KYRUMA Discovery™.

## Fuera de alcance deliberadamente

- PostgreSQL, Prisma, repositorios y transacciones.
- API, UI, contexto, autorización e identidad.
- Cálculo automático de confianza, modelos de IA, publicaciones externas, Event Bus y Outbox.

## Cobertura y validación

El dominio cuenta con 13 pruebas unitarias en el runner nativo de Node. Validan fábrica, Aggregate, estados, eventos, Snapshot, servicios, ConfidenceScore, errores y escenarios inválidos. Las integraciones con Foundation, infraestructura y mensajería se cubrirán solo al introducir esas capas.

## Riesgos abiertos

- La conservación física de snapshots, auditabilidad durable e idempotencia de publicación requieren la capa de persistencia y Outbox previstas por PS-005 y sus RFC aprobados.
- La procedencia de una fuente `completed` se valida como contrato de dominio; su resolución real corresponde a un futuro puerto de aplicación.
