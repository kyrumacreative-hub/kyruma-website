# Engineering Implementation Plan — PS-004 Lead Lifecycle™

## Workstreams y orden

1. **Domain Model:** Aggregate `Lead`, invariantes, estados, errores y eventos tipados.
2. **Persistence:** esquema PostgreSQL, migraciones, restricciones de unicidad y outbox.
3. **Repositories:** puertos y adaptadores PostgreSQL.
4. **Services:** creación, Ownership, Discovery, Qualification, Partner Creation, archivo/reactivación.
5. **Transactions:** límites atómicos, rollback, idempotencia y concurrencia.
6. **Domain Events:** envelope versionado, Audit y Timeline separados.
7. **Authorization:** contexto pre-Partner y `lead.*` tras el RFC de implementación de Foundation.
8. **API:** fronteras de servidor aprobadas, errores seguros y validación.
9. **Tests:** dominio, aplicación, integración, concurrencia, permisos y regresión.
10. **Observability:** correlación, Audit, métricas operativas y Domain Implementation Report.

## Dependencias

- Contrato de contexto pre-Partner y catálogo `lead.*` aprobados para la fase de autorización.
- PostgreSQL y política de datos aprobados para persistencia real.
- Contratos de eventos para consumidores, outbox y Audit/Timeline.
- No se modificará Foundation dentro de esta rama; cualquier adaptación será un cambio RFC independiente.

## Estrategia de pruebas

- Unitarias para invariantes, transiciones y errores del Aggregate.
- Aplicación para casos de uso, puertos y eventos declarados tras confirmación.
- Integración para PostgreSQL, restricciones de unicidad, rollback y outbox.
- Autorización para Membership, scope, visibilidad y revocación.
- Regresión de web pública y `/workspace` antes de cualquier merge futuro.

## Estrategia de migración

No se ejecutarán migraciones hasta disponer de proveedor PostgreSQL. Las migraciones serán aditivas, versionadas, reversibles cuando sea seguro y precedidas por backup probado. Las restricciones de unicidad se aplicarán en base de datos, no solo en aplicación.

## Riesgos

- Contexto pre-Partner y `lead.*` requieren implementación RFC antes de endpoints protegidos.
- PII e invitaciones quedan fuera de cualquier adaptador real hasta activar la política aprobada.
- No se crearán consumidores de eventos ni automatizaciones antes del outbox idempotente.
