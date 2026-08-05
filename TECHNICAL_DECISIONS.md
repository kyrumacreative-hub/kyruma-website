# KYRUMA OS™ — Technical Decisions

| ID | Contexto y alternativas | Recomendación | Consecuencias / riesgo | Estado |
| --- | --- | --- | --- | --- |
| TD-001 | Web pública y OS: mismo repo, monorepo o servicio separado. | Mantener web pública y OS en el mismo repositorio con límites por feature hasta que una necesidad técnica demuestre lo contrario. | Menor operación; vigilar acoplamiento y tiempos de build. | Aprobada |
| TD-002 | `/workspace` público puede colisionar con portal. | Mantenerlo compatible; el prefijo `/os` sigue siendo propuesta técnica para operación. | La compatibilidad está aprobada; el namespace final requiere RFC. | Propuesta |
| TD-003 | Roles rígidos frente a RBAC con capacidades. | Roles como paquetes y capacidades con ámbito. | Más modelo inicial, mejor mínimo privilegio. | Aprobada |
| TD-004 | Documento/archivo en DB frente a almacenamiento de objetos. | Metadatos relacionales + objeto externo autorizado. | Requiere proveedor y política de URLs. | Propuesta |
| TD-005 | Eventos síncronos, bus externo o outbox. | Eventos locales + outbox al implementar efectos. | Evita infraestructura prematura; exige idempotencia. | Propuesta |
| TD-006 | Transformar Discovery actual o reescribirlo. | Conservar UI/contrato y crear adaptador de persistencia futuro. | Posible trabajo de traducción/versionado. | Aprobada |
| TD-007 | Identidad propia o proveedor. | Diseñar mediante puerto desacoplado; elegir proveedor en RFC posterior. | Coste, lock-in y residencia siguen pendientes; el dominio no depende de ellos. | Aprobada |
| TD-008 | Base de datos/proveedor concreto. | PostgreSQL como motor lógico; elegir proveedor tras requisitos de región, backup y coste. | El proveedor sigue pendiente; los repositorios protegen el dominio. | Aprobada |
| TD-009 | IA automática o revisión. | Si se autoriza Intelligence, los Insights quedan en borrador y trazables a fuentes; revisión humana antes de compartir. | Intelligence no está aprobada para implementar. | Pendiente |
