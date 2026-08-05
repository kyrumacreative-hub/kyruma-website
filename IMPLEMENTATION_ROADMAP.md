# KYRUMA OS™ — Implementation Roadmap

**Estado:** Foundation completada mediante KYRUMA OS™ Engineering Release v0.1.0. Ningún dominio funcional comienza sin Product Specification aprobada y autorización expresa.

| Fase | Estado | Objetivo / entregables | Dependencias | Riesgos y criterio de aceptación | Fuera de alcance |
| --- | --- | --- | --- | --- |
| Foundation — Architecture, Identity & Permissions, Partner Context, Readiness | Completed | Infraestructura de identidad, permisos y contexto desacoplada. | Decisiones de Foundation aprobadas. | Pruebas de aislamiento y contexto; web pública y `/workspace` sin cambios. | Dominios funcionales, login, proveedor y base de datos real. |
| EP-004 — Lead Lifecycle | Waiting for Product Specification | Persistencia de Lead, estados aprobados, conversión interna explícita y Timeline interna. | Product Specification, política de retención de PII y autorización expresa. | Conversión trazable/idempotente; no CRM genérico. | Campañas, scoring, automatizaciones. |
| EP-005 — Discovery persistence | Blocked by predecessor | Plantillas versionadas y Submission inmutable vinculable a Lead/Organization/Partner. | EP-004 y política de datos. | UI pública compatible; historial y acceso probados. | Reescritura del Discovery, IA. |
| EP-006 — Discovery review | Blocked by predecessor | Revisión interna, estados `UNDER_REVIEW/REVIEWED` y Timeline separada de auditoría. | EP-005 y criterios de revisión. | Nada se comparte o convierte automáticamente. | Insights de IA. |
| EP-007 — Meetings and proposals | Planned | Meetings y propuestas versionadas con estados de envío/aceptación. | Reglas comerciales y calendario/propuesta elegidos. | Estados y permisos consistentes, no doble envío. | Facturación automática. |
| EP-008 — Projects and deliverables | Planned | Project, Task, Strategy Decision, Document, Asset y Deliverable internos. | Proceso de entrega validado. | Un proyecto refleja el proceso KYRUMA, no un gestor genérico. | Portal público completo. |
| EP-009 — Client Portal | Planned | Vista Partner de recursos `shared`, invitaciones y enlaces públicos controlados. | EP-008, matriz de visibilidad y archivos. | Ninguna nota/draft interno filtrado; UX/accesibilidad revisadas. | Colaboración en tiempo real no validada. |
| EP-010 — Intelligence | Planned | Insights en borrador, trazabilidad a sources y revisión humana. | Criterios de IA, proveedor aprobado y evaluación de privacidad. | Nunca publica ni modifica datos automáticamente. | Agente autónomo o scoring. |
| EP-011 — Automations | Planned | Notificaciones, recordatorios y efectos de eventos aprobados. | Outbox, políticas de comunicación y dueños operativos. | Idempotencia, opt-out, observabilidad y rollback. | Flujos autónomos no auditables. |

## Gates obligatorios

- Cada fase requiere definición de negocio, RFC aprobado, criterios de aceptación y autorización expresa.
- Las fases se desarrollan en ramas protegidas y entornos preview; no se despliega sin pruebas de autorización, migración revisada y rollback.
- La web pública y `/workspace` se prueban explícitamente en toda entrega mientras convivan con OS.
- Antes de Foundation funcional, seleccionar identidad y persistencia mediante un spike limitado; no introducir proveedores ni dependencias por anticipación.
