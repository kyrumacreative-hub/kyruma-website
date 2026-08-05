# KYRUMA OS™ — Technical Decisions

| ID | Contexto y alternativas | Recomendación | Consecuencias / riesgo | Estado |
| --- | --- | --- | --- | --- |
| TD-001 | Web pública y OS: mismo repo, monorepo o servicio separado. | Mantener convivencia actual como hipótesis operativa, con límites por feature; no aprobar separación aún. | Menor operación; vigilar acoplamiento y tiempos de build. | Pendiente |
| TD-002 | `/workspace` público puede colisionar con portal. | Mantenerlo compatible; el prefijo `/os` sigue siendo propuesta técnica para operación. | La compatibilidad está aprobada; el namespace final requiere RFC. | Propuesta |
| TD-003 | Roles rígidos frente a RBAC con capacidades. | Roles como paquetes y capacidades con ámbito. | Más modelo inicial, mejor mínimo privilegio. | Aprobada |
| TD-004 | Documento/archivo en DB frente a almacenamiento de objetos. | Metadatos relacionales + objeto externo autorizado. | Requiere proveedor y política de URLs. | Propuesta |
| TD-005 | Eventos síncronos, bus externo o outbox. | Eventos locales + outbox al implementar efectos. | Evita infraestructura prematura; exige idempotencia. | Propuesta |
| TD-006 | Transformar Discovery actual o reescribirlo. | Conservar UI/contrato y crear adaptador de persistencia futuro. | Posible trabajo de traducción/versionado. | Aprobada |
| TD-007 | Identidad propia o proveedor. | Evaluar proveedor gestionado en fase Identity. | Coste, lock-in y residencia pendientes. | Pendiente |
| TD-008 | Base de datos/proveedor concreto. | Elegir relacional gestionado tras requisitos de región, backup y coste. | Bloquea implementación de datos, no diseño. | Pendiente |
| TD-009 | IA automática o revisión. | Si se autoriza Intelligence, los Insights quedan en borrador y trazables a fuentes; revisión humana antes de compartir. | Intelligence no está aprobada para implementar. | Pendiente |
