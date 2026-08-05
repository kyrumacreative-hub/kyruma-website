# KYRUMA OS™ — Implementation Roadmap

**Estado:** Propuesta incremental. Cada fase necesita aprobación explícita, decisión de negocio suficiente y criterio de salida cumplido. No se inicia durante la fase de arquitectura.

| Fase | Objetivo / entregables | Dependencias | Riesgos y criterio de aceptación | Fuera de alcance |
| --- | --- | --- | --- | --- |
| 1. Foundation | Contratos de dominio, configuración por entorno, observabilidad base y pruebas de arquitectura. | TD-001 aprobada, decisiones de datos/identidad encaminadas. | No tocar Discovery público; lint/build y contratos documentados. | CRM, UI de portal, IA. |
| 2. Identity and permissions | Proveedor elegido, User/Membership, capacidades, invitación/revocación y audit básico. | TD-007, matriz de permisos, política de sesión. | Tests de denegación y aislamiento; sin privilegios implícitos. | SSO avanzado, automatizaciones. |
| 3. Partner context | Organization, Partner, Workspace y shell `/os` mínimo autorizado. | Fase 2, definición Partner/Workspace. | Un actor solo ve sus ámbitos; `/workspace` sigue igual. | Proyectos, documentos, IA. |
| 4. Lead Lifecycle | Persistencia de Lead, conversión explícita, timeline y estado. | Definición comercial y retención PII. | Conversión trazable/idempotente; no CRM genérico. | Campañas, scoring, automatizaciones. |
| 5. Discovery persistence | Plantillas versionadas, Submission inmutable y revisión interna. | Fase 3, política de Discovery y datos. | UI pública compatible; historial y acceso probados. | Reescritura del Discovery, IA. |
| 6. Discovery Intelligence | Insights en borrador, trazabilidad a submissions y revisión humana. | Criterios de IA, proveedor aprobado, evaluación de privacidad. | Nunca publica automáticamente; calidad/seguridad evaluadas. | Agente autónomo, recomendaciones sin revisión. |
| 7. Meetings and proposals | Meetings, propuestas versionadas y eventos de aceptación. | Reglas comerciales y calendario/propuesta elegidos. | Estados y permisos consistentes, no doble envío. | Facturación completa. |
| 8. Projects | Project, Task, Strategy Decision y Deliverable internos. | Proceso real de entrega validado. | Un proyecto refleja el proceso KYRUMA medido, no un gestor genérico. | Portal público completo. |
| 9. Client Portal | Vista partner de entregables, timeline y documentos publicados. | Fase 8, matriz de visibilidad y archivos. | Ninguna nota/draft interno filtrado; UX/accessibility revisadas. | Colaboración en tiempo real si no se valida. |
| 10. Automations | Notificaciones, recordatorios y efectos de eventos aprobados. | Outbox, políticas de comunicación y dueños operativos. | Idempotencia, opt-out, observabilidad y rollback. | Flujos autónomos no auditables. |

## Orden de decisión recomendado

1. Validar Discovery con clientes y completar `KYR-DISCOVERY-FEEDBACK-001`.
2. Aprobar definiciones de Partner/Workspace, roles, datos y retención.
3. Seleccionar identidad y persistencia mediante un spike limitado, no una implementación completa.
4. Autorizar solo Foundation y después Identity como primer bloque funcional.

## Gates de despliegue futuros

- Las fases de OS se desarrollan en ramas protegidas y entornos preview.
- No se fusiona ninguna fase sin pruebas de autorización, migración revisada y plan de rollback.
- Producción pública y `/workspace` se prueban explícitamente en toda entrega mientras convivan con OS.
