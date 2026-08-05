# KYRUMA OS™ — Technical Decisions

| ID | Contexto y alternativas | Recomendación | Consecuencias / riesgo | Estado |
| --- | --- | --- | --- | --- |
| TD-001 | Web pública y OS: mismo repo, monorepo o servicio separado. | Mantener mismo repositorio y App Router al inicio, con límites por feature. | Menor operación; vigilar acoplamiento y tiempos de build. | Propuesta |
| TD-002 | `/workspace` público puede colisionar con portal. | Mantenerlo compatible y usar prefijo `/os` para operación. | Cambia la referencia inicial; evita romper Discovery. | Propuesta |
| TD-003 | Roles rígidos frente a RBAC con capacidades. | Roles como paquetes y capacidades con ámbito. | Más modelo inicial, mejor mínimo privilegio. | Propuesta |
| TD-004 | Documento/archivo en DB frente a almacenamiento de objetos. | Metadatos relacionales + objeto externo autorizado. | Requiere proveedor y política de URLs. | Propuesta |
| TD-005 | Eventos síncronos, bus externo o outbox. | Eventos locales + outbox al implementar efectos. | Evita infraestructura prematura; exige idempotencia. | Propuesta |
| TD-006 | Transformar Discovery actual o reescribirlo. | Conservar UI/contrato y crear adaptador de persistencia futuro. | Posible trabajo de traducción/versionado. | Propuesta |
| TD-007 | Identidad propia o proveedor. | Evaluar proveedor gestionado en fase Identity. | Coste, lock-in y residencia pendientes. | Pendiente |
| TD-008 | Base de datos/proveedor concreto. | Elegir relacional gestionado tras requisitos de región, backup y coste. | Bloquea implementación de datos, no diseño. | Pendiente |
| TD-009 | IA automática o revisión. | Insights quedan en borrador y trazables a fuentes; revisión humana antes de compartir. | Limita automatización inicial, reduce riesgo. | Propuesta |
