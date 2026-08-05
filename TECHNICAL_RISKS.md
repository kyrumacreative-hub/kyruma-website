# KYRUMA OS™ — Technical Risks

| Riesgo | Probabilidad | Impacto | Mitigación / disparador |
| --- | --- | --- | --- |
| Implementar CRM antes de validar ciclo comercial | Media | Alto | Mantener Lead Lifecycle como fase posterior con decisiones de negocio. |
| Confundir Discovery público con portal privado | Alta | Alto | Prefijo `/os`, rutas separadas y contrato de compatibilidad. |
| Fuga entre organizaciones | Media | Crítico | Authorization server-side, scope obligatorio, tests negativos y auditoría. |
| Datos estratégicos en logs, IA o analítica | Media | Crítico | Clasificación, redacción, consentimiento y revisión de proveedores. |
| Elegir proveedor antes de requisitos | Alta | Medio | Decisiones TD-007/008 pendientes y spike acotado futuro. |
| Persistir respuestas sin versión ni retención | Media | Alto | Snapshot versionado, política legal antes de implementar. |
| Acoplamiento a Vercel/Next | Media | Medio | Puertos/repositorios y procesos de migración independientes de rutas. |
| Falta de pruebas en dominios nuevos | Alta | Alto | Criterios de aceptación y tests por aislamiento/autorización antes de UI. |
| Automatizaciones no idempotentes | Media | Alto | Outbox, claves de idempotencia y revisión operativa. |
| Crecimiento de UI especulativa | Alta | Medio | No crear design system/pantallas hasta fase aprobada. |

## Dependencias de negocio que bloquean implementación

- Definición operativa de Partner, Workspace y conversión de Lead.
- Matriz de quién puede ver, editar, publicar y exportar cada recurso.
- Países/contratos de datos, retención y responsables.
- Requisitos de archivos, integraciones de calendario, propuesta y facturación.
- Criterios de calidad, revisión humana y uso permitido para Discovery Intelligence™.
