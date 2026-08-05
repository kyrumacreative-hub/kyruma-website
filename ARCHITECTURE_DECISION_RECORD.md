# Architecture Decision Record — PS-004

## 1. Contexto pre-Partner

**Decisión:** introducir, mediante el RFC de implementación correspondiente, un `ResolvedOrganizationContext` aditivo para recursos pre-Partner. Incluirá actor, Membership activa, Organization interna de KYRUMA, capacidades y visibilidades permitidas; no contendrá Partner ni Workspace. La transición a `ResolvedPartnerContext` ocurrirá solo tras Partner Creation.

**Justificación:** Lead Lifecycle existe antes de Partner y no puede reutilizar un Partner/Workspace ficticio sin vulnerar el aislamiento de Foundation.

**Ventajas:** mantiene contexto explícito, evita autorización paralela y permite una transición limpia a Partner.

**Riesgos e impacto:** requiere una extensión aditiva de Foundation y pruebas de switching/revocación; no afecta los contextos actuales de Partner.

**Recomendación final:** adoptar este contrato como única vía de acceso pre-Partner.

**Estado:** RESOLVED.

## 2. Capabilities y autorización de Lead Lifecycle

**Decisión:** añadir un namespace de capacidades `lead.*` en el catálogo de Foundation: `lead.create`, `lead.read`, `lead.update`, `lead.archive`, `lead.reactivate`, `lead.ownership.assign`, `lead.ownership.request`, `lead.ownership.history.read`, `lead.discovery.start`, `lead.discovery.read`, `lead.qualification.execute`, `lead.qualification.read` y `lead.partner.create`. Todas se evaluarán con Membership activa, `ResolvedOrganizationContext` y visibilidad explícita.

**Justificación:** las acciones de Lead no son acciones de Partner y no pueden heredarse de Roles o de capacidades con semántica distinta.

**Ventajas:** autorización granular, verificable y compatible con Capabilities + Memberships.

**Riesgos e impacto:** el catálogo cambia de forma aditiva y requiere pruebas de grants/revocations. Existe una contradicción funcional que Product debe cerrar: EP-004.1 permite que Strategist cree un Lead que exige Owner, mientras EP-004.2 reserva la asignación inicial de Owner a Super Admin/Admin.

**Recomendación final:** implementar las capacidades anteriores. El Strategist puede solicitar una reasignación y proponer un nuevo Owner, pero no aprobar ni ejecutar cambios de Ownership; esas acciones quedan restringidas a Super Admin y Admin.

**Estado:** RESOLVED.

## 3. Persistencia, Audit y Timeline

**Decisión:** usar PostgreSQL como sistema de registro transaccional, Repository Ports en los dominios y un patrón Transactional Outbox para declarar eventos después de confirmar la transacción. Audit y Timeline se persistirán mediante puertos distintos y proyecciones separadas.

**Justificación:** PS-004 exige rollback completo, unicidad bajo concurrencia e historial permanente; escrituras coordinadas en aplicación no satisfacen estas garantías.

**Ventajas:** atomicidad, idempotencia, migraciones controladas y separación de seguridad/producto.

**Riesgos e impacto:** necesita un proveedor gestionado, región, backup, acceso y política de recuperación; Foundation no cambia hasta el RFC de implementación de datos. La selección de proveedor queda fuera de Product y se resolverá durante la preparación de infraestructura.

**Recomendación final:** adoptar PostgreSQL + Transactional Outbox; el proveedor se seleccionará con criterios de región, continuidad y coste.

**Estado:** RESOLVED.

## 4. PII de Contact e invitaciones Discovery

**Decisión:** clasificar nombre, apellidos, email y teléfono de Contact como PII. El acceso queda limitado a Super Admin, Admin y Owner del Lead. Las invitaciones Discovery usarán token de un solo uso, expiración, revocación, auditoría completa y URLs sin datos personales.

**Justificación:** la seguridad de invitaciones y la retención de PII no pueden deducirse de reglas funcionales.

**Ventajas:** minimización de datos, no exposición inter-ámbito y trazabilidad coherente con archivado antes que eliminación.

**Riesgos e impacto:** los plazos de retención y exportación se aplicarán conforme a la política legal aprobada cuando se prepare infraestructura. Afecta interfaz futura, proveedor de correo/identidad y almacenamiento.

**Recomendación final:** aplicar estos controles desde el primer adaptador de persistencia e invitaciones, con pruebas de acceso por Owner y de token revocado/caducado.

**Estado:** RESOLVED.

## 5. Contratos de eventos e idempotencia

**Decisión:** todos los eventos de PS-004 usarán un envelope versionado con `eventId`, `eventType`, `eventVersion`, `occurredAt`, `actorId`, `organizationId`, `resourceId` y `correlationId`; su payload contendrá solo datos mínimos. `LeadCreated`, cambios de Ownership, Discovery, Qualification, Partner Creation, archivo y reactivación son Domain Events. Audit y Timeline se producirán como registros/proyecciones separados, no como sustitutos de esos hechos.

**Justificación:** evita duplicados, filtración de PII y acoplamiento entre el hecho de negocio, Audit y Timeline.

**Ventajas:** consumidores idempotentes, evolución compatible y correlación operativa.

**Riesgos e impacto:** el outbox y los consumidores deben deduplicar por `eventId`; EV-002, EV-003 y eventos equivalentes de inicialización deberán materializarse como registros Audit/Timeline, conservando la intención de Product sin clasificarlos erróneamente como hechos de dominio.

**Recomendación final:** adoptar este envelope y patrón antes de crear cualquier consumidor de eventos.

**Estado:** RESOLVED.

## Conclusión

Todas las condiciones de diseño arquitectónico quedan resueltas. PostgreSQL queda aprobado como motor de persistencia con transacciones atómicas; la elección de proveedor se incorpora a la preparación de infraestructura y no bloquea el inicio de Engineering. PS-004 puede declararse **READY FOR ENGINEERING** sin modificar Foundation hasta el RFC de implementación correspondiente.
