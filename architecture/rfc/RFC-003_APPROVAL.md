# RFC-003 Approval — Lead Persistence, Audit and Timeline

## Estado

**APPROVED WITH CONDITIONS**

## Decisiones aprobadas

- PostgreSQL permanece aprobado como motor lógico de persistencia.
- Las operaciones críticas requerirán atomicidad y rollback completo.
- Audit y Timeline son canales separados.
- Los efectos posteriores usarán un patrón de entrega fiable cuando existan consumidores críticos.

## Decisiones pendientes

- Proveedor, región, backup y acceso de PostgreSQL.
- Límites exactos de transacción y migraciones.
- Puertos persistentes, retención y proyección de Audit/Timeline.

## Impacto

- **Foundation:** no se modifica hasta un RFC de implementación de datos.
- **Product:** sus reglas transaccionales permanecen intactas.
- **Engineering:** no puede persistir Leads, Ownership, Qualification o Partner de forma segura aún.

## Riesgos

- Estados parciales bajo fallo o concurrencia.
- Pérdida de trazabilidad si Audit y Timeline se mezclan.

## Acción requerida

**Seleccionar y aprobar la infraestructura PostgreSQL y el contrato transaccional de Audit/Timeline.**
