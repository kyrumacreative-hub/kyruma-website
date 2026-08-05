# KYRUMA OS™ — Implementation Roadmap

**Estado:** Roadmap incremental alineado con Business Decision Pack v1.0. Identity & Permissions y Partner Context están implementados como infraestructura sin proveedor ni dominio funcional. Ninguna fase posterior comienza sin RFC aprobado y autorización expresa.

| Fase | Objetivo / entregables | Dependencias | Riesgos y criterio de aceptación | Fuera de alcance |
| --- | --- | --- | --- | --- |
| 1. Identity and permissions | Proveedor elegido, User/Membership, capacidades, invitación/revocación y Audit Event básico. | TD-007, matriz de permisos y política de sesión. | Tests de denegación y aislamiento; sin privilegios implícitos. | SSO avanzado, automatizaciones. |
| 2. Partner context | Organization, Partner, Workspace interno principal y shell autorizado. | Fase 1, `KYR-XXX` transaccional y definición de activación externa. | Un actor solo ve sus ámbitos; Partner empieza `ONBOARDING`; `/workspace` sigue igual. | Portal externo, proyectos, IA. |
| 3. Lead Lifecycle | Persistencia de Lead, estados aprobados, conversión interna explícita y timeline interna. | Fase 2, retención de PII. | Conversión trazable/idempotente; no CRM genérico. | Campañas, scoring, automatizaciones. |
| 4. Discovery persistence | Plantillas versionadas y Submission inmutable vinculable a Lead/Organization/Partner. | Fase 3, política de datos. | UI pública compatible; historial y acceso probados. | Reescritura del Discovery, IA. |
| 5. Discovery review | Revisión interna, estados `UNDER_REVIEW/REVIEWED` y Timeline separada de auditoría. | Fase 4, criterios de revisión. | Nada se comparte o convierte automáticamente. | Insights de IA. |
| 6. Meetings and proposals | Meetings y propuestas versionadas con estados de envío/aceptación. | Reglas comerciales y calendario/propuesta elegidos. | Estados y permisos consistentes, no doble envío. | Facturación automática. |
| 7. Projects and deliverables | Project, Task, Strategy Decision, Document, Asset y Deliverable internos. | Proceso de entrega validado. | Un proyecto refleja el proceso KYRUMA, no un gestor genérico. | Portal público completo. |
| 8. Client Portal | Vista Partner de recursos `shared`, invitaciones y enlaces públicos controlados. | Fase 7, matriz de visibilidad y archivos. | Ninguna nota/draft interno filtrado; UX/accesibilidad revisadas. | Colaboración en tiempo real no validada. |
| 9. Intelligence | Insights en borrador, trazabilidad a sources y revisión humana. | Criterios de IA, proveedor aprobado y evaluación de privacidad. | Nunca publica ni modifica datos automáticamente. | Agente autónomo o scoring. |
| 10. Automations | Notificaciones, recordatorios y efectos de eventos aprobados. | Outbox, políticas de comunicación y dueños operativos. | Idempotencia, opt-out, observabilidad y rollback. | Flujos autónomos no auditables. |

## Gates obligatorios

- Cada fase requiere definición de negocio, RFC aprobado, criterios de aceptación y autorización expresa.
- Las fases se desarrollan en ramas protegidas y entornos preview; no se despliega sin pruebas de autorización, migración revisada y rollback.
- La web pública y `/workspace` se prueban explícitamente en toda entrega mientras convivan con OS.
- Antes de Foundation funcional, seleccionar identidad y persistencia mediante un spike limitado; no introducir proveedores ni dependencias por anticipación.
