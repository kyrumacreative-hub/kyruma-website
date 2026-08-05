# PS-005 — Discovery Intelligence™

## 1. Metadata

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | Draft |
| Owner | Product |
| Engineering | Pending Technical Review |
| Depends on | KYRUMA Discovery™, Lead Lifecycle™, Foundation |

## 2. Executive Summary

Discovery Intelligence™ transforma una Submission de Discovery ya completada en material asistencial para el equipo de KYRUMA: resumen ejecutivo, objetivos detectados, retos, oportunidades, recomendaciones de KYRUMA y preguntas sugeridas para una reunión.

No decide si una Organization debe convertirse en Partner. No modifica Lead Lifecycle™, Discovery™, Partner, Project ni Strategy. No ejecuta acciones automáticamente. Todo resultado requiere revisión humana antes de ser utilizado como conocimiento operativo.

## 3. Business Context

KYRUMA Discovery™ recoge contexto valioso antes de una reunión. Discovery Intelligence™ reduce el tiempo de síntesis y ayuda a que la conversación posterior se centre en decisiones y oportunidades, conservando el vínculo verificable con la Submission y versión de origen.

El valor del dominio se mide por utilidad, trazabilidad y revisión humana, no por automatización autónoma ni por volumen de resultados generados.

## 4. Scope

### In scope

- Solicitar análisis de una Discovery Submission completada y versionada.
- Crear un snapshot inmutable y minimizado de la fuente autorizada.
- Generar un Analysis asistencial versionado.
- Mostrar el resultado y su procedencia a usuarios autorizados.
- Registrar revisión humana, aceptación, observaciones o descarte.
- Sustituir un Analysis por una nueva versión sin borrar historial.
- Registrar Audit, Timeline y eventos de dominio.

### Out of scope

- Modificar respuestas de Discovery, Lead, Partner o cualquier otro dato fuente.
- Enviar emails, crear reuniones, propuestas, proyectos o tareas.
- Tomar decisiones de Qualification o Partner Creation.
- Exponer resultados al Partner o crear UI pública.
- Entrenar modelos con datos de KYRUMA, compartir datos con terceros no aprobados o ejecutar acciones autónomas.

## 5. Domain Definition

### Mission

Convertir una Discovery completada en una síntesis asistencial, verificable y revisable por personas de KYRUMA.

### Aggregate Root

**IntelligenceAnalysis** es el Aggregate Root. Cada Analysis pertenece exactamente a un Source Snapshot y conserva la versión de prompt, modelo y política aplicados.

### Core entities

- **IntelligenceAnalysis**: solicitud, estado, versión, resultado y revisión.
- **DiscoverySourceSnapshot**: representación inmutable, minimizada y versionada de una Discovery autorizada.
- **AnalysisReview**: decisión humana, observaciones, revisor y fecha.
- **PromptTemplateVersion**: plantilla aprobada y versionada utilizada en la generación.

### Invariants

- Un Analysis solo procede de una Discovery completada.
- La fuente no se modifica ni se vuelve a leer una vez creado el snapshot.
- Un resultado no cambia los datos fuente ni ejecuta acciones.
- Toda generación tiene modelo, prompt, política y timestamp trazables.
- Todo resultado consumible debe estar revisado por una persona autorizada.
- El historial, los snapshots y las revisiones no se eliminan; se archivan.

## 6. Use Cases

### UC-005.1 — Request Analysis

Un usuario autorizado solicita análisis de una Discovery completada. El sistema valida contexto, capacidad, versión de fuente y política de datos; crea un snapshot y un Analysis en `requested`.

### UC-005.2 — Generate Analysis

Un worker autorizado procesa un Analysis solicitado mediante un gateway de modelo aprobado. Persiste un resultado estructurado o un fallo seguro. La generación no publica ni activa decisiones.

### UC-005.3 — Get Analysis

Un usuario autorizado consulta el resultado, el snapshot de procedencia, las versiones y el estado de revisión dentro del contexto autorizado.

### UC-005.4 — Review Analysis

Un Super Admin, Admin o Strategist autorizado revisa el resultado y lo marca como `approved`, `needs_revision` o `rejected`, con observación cuando corresponda.

### UC-005.5 — Supersede Analysis

Cuando existe una nueva versión de Discovery o una revisión solicita regeneración, se crea un Analysis nuevo. El previo pasa a `superseded` sin perder historial.

### UC-005.6 — Archive Analysis

Un usuario autorizado archiva un resultado que ya no debe estar disponible operativamente, sin eliminar source, Audit ni Timeline.

## 7. State Machine

```text
requested → processing → generated → under_review → approved
                              ↓             ↓
                            failed     needs_revision
                                            ↓
                                      superseded

approved | rejected | superseded | failed → archived
```

Transiciones prohibidas: cualquier paso que active Partner Creation, Qualification, comunicaciones o escrituras sobre la fuente. Un resultado `generated` no se considera conocimiento operativo hasta `approved`.

## 8. Value Objects

- `IntelligenceAnalysisId`
- `DiscoverySubmissionId`
- `DiscoverySubmissionVersion`
- `SourceSnapshotId`
- `AnalysisVersion`
- `PromptTemplateVersion`
- `ModelReference`
- `ModelRunId`
- `ConfidenceScore` (0–1, informativo; nunca decisión automática)
- `ReviewDecision`
- `AnalysisStatus`
- `CorrelationId`

## 9. Domain Events

- `IntelligenceAnalysisRequested`
- `DiscoverySourceSnapshotted`
- `IntelligenceAnalysisStarted`
- `IntelligenceAnalysisGenerated`
- `IntelligenceAnalysisFailed`
- `IntelligenceAnalysisReviewed`
- `IntelligenceAnalysisSuperseded`
- `IntelligenceAnalysisArchived`

Todos usan envelope versionado e idempotente, payload mínimo y correlation ID. Audit y Timeline son proyecciones separadas.

## 10. Contracts

- `DiscoverySourceProvider`: entrega una Submission completada y autorizada para snapshot.
- `SourceSnapshotRepository`: persiste snapshots inmutables.
- `IntelligenceAnalysisRepository`: persiste Aggregate, versiones y estado.
- `PromptTemplateRepository`: devuelve una plantilla aprobada y versionada.
- `IntelligenceModelGateway`: ejecuta un modelo aprobado y devuelve salida estructurada, sin acceso directo a datos de KYRUMA.
- `IntelligencePolicyGuard`: aplica consentimiento, clasificación de datos, región, retención y reglas de uso del modelo.
- `AnalysisReviewRepository`: conserva decisiones humanas.
- `TransactionRunner`, `AuditContextRecorder`, `DomainEventDispatcher` y Outbox: coordinan persistencia, trazabilidad y publicación fiable.

## 11. Permissions

La matriz final queda pendiente de RFC. Propuesta inicial:

| Action | Super Admin | Admin | Strategist | Designer/Developer/Viewer | Partner |
| --- | --- | --- | --- | --- | --- |
| Request / Read | Yes | Yes | Yes | Read if granted | No |
| Review | Yes | Yes | Yes | No | No |
| Archive | Yes | Yes | No | No | No |
| Configure model/prompt/policy | Yes | No | No | No | No |

Roles solo agrupan capacidades; Membership, scope, visibilidad, grants y revocations continúan siendo obligatorios.

## 12. Data Model

### IntelligenceAnalysis

`id`, `sourceSnapshotId`, `analysisVersion`, `status`, `modelReference`, `modelRunId`, `promptTemplateVersion`, `policyVersion`, `requestedBy`, `requestedAt`, `generatedAt`, `failedAt`, `archivedAt`, `correlationId`.

### DiscoverySourceSnapshot

`id`, `discoverySubmissionId`, `submissionVersion`, `scopeType`, `organizationId`, `partnerId?`, `workspaceId?`, `contentHash`, `classification`, `createdAt`, `retentionPolicyVersion`.

### AnalysisResult

`analysisId`, `executiveSummary`, `objectives`, `challenges`, `opportunities`, `recommendations`, `meetingQuestions`, `confidence`, `createdAt`.

### AnalysisReview

`id`, `analysisId`, `decision`, `notes?`, `reviewedBy`, `reviewedAt`.

## 13. Acceptance Criteria

- No Analysis puede crearse desde una Discovery incompleta o fuera de contexto.
- Cada resultado conserva snapshot, versión de fuente, modelo, prompt, política y correlation ID.
- Un resultado nunca escribe sobre datos fuente ni activa acciones posteriores.
- La revisión humana es visible, permanente y obligatoria antes de uso operativo.
- Regenerar crea una nueva versión y conserva las anteriores.
- Fallos del modelo no filtran datos sensibles ni dejan un estado ambiguo.
- Todas las operaciones críticas son transaccionales, auditables e idempotentes.
- Usuarios fuera de contexto o sin capacidad reciben denegación segura.

## 14. Edge Cases

- Discovery actualizada mientras un Analysis está en `processing`: finalizar contra el snapshot original y marcarlo potencialmente supersedible.
- Respuesta del modelo incompleta o no estructurada: marcar `failed`; no persistir resultado parcial como aprobado.
- Reintento con el mismo correlation ID: operación idempotente.
- Fuente archivada durante procesamiento: conservar la trazabilidad y bloquear uso operativo hasta revisión.
- Datos clasificados como restringidos: denegar generación hasta que una política aprobada lo permita.
- Fallo tras llamada al modelo y antes de persistencia: reconciliar mediante outbox/model run ID sin duplicar efectos.

## 15. Out of Scope

No hay chat, agentes autónomos, automatizaciones, panel de administración de modelos, integración de terceros, UI, recomendación ejecutable ni uso de datos para entrenamiento.

## 16. Future Evolution

Análisis comparativo entre versiones, librería de insights aprobados, preparación de propuesta asistida y preguntas adaptativas solo podrán evaluarse mediante Product Specification nueva.

## 17. Traceability Matrix

| Need | Use case | Event | Acceptance |
| --- | --- | --- | --- |
| Síntesis trazable | Request/Generate/Get | Requested/Generated | Fuente y versiones persistentes |
| Control humano | Review | Reviewed | Revisión obligatoria |
| No automatización | All | — | Sin escrituras/acciones externas |
| Evolución sin pérdida | Supersede/Archive | Superseded/Archived | Historial conservado |
| Seguridad | All | Audit projection | Contexto y capacidades aplicados |
