# RFC-003 — Lead Persistence, Audit and Timeline

**Estado:** Draft  
**Origen:** Technical Review PS-004 Phase 2  
**Decisión requerida antes de:** cualquier persistencia de Lead

## Problema

PS-004 exige transacciones completas, unicidad de Lead activo, historial permanente, Audit y Timeline desde la creación. Foundation aprueba PostgreSQL como motor lógico, pero no define proveedor, adaptadores, transacciones ni puertos persistentes de Audit/Timeline.

## Objetivo

Definir la estrategia de persistencia y las fronteras de Audit/Timeline necesarias para que las reglas BR-008/009/011, BR-017/018 y criterios relacionados sean verificables.

## Decisiones pendientes

- Proveedor, región, backups y acceso a PostgreSQL.
- Restricciones de unicidad, concurrencia y estrategia de reintento.
- Límites de la transacción de creación, Ownership, Qualification y Partner Creation.
- Contratos, retención y proyección de Audit frente a Timeline.
- Migraciones, versionado y rollback de datos.

## Alternativas

1. Una transacción PostgreSQL para los cambios atómicos y un patrón outbox para efectos posteriores.
2. Escrituras independientes coordinadas en aplicación.

La alternativa 2 no satisface el rollback completo exigido por Product.

## Criterios de aceptación

- No existen dos Leads activos para una Organization bajo concurrencia.
- Un fallo no deja Lead, Timeline, Audit ni Partner parcialmente creados.
- Audit y Timeline permanecen canales distintos.
- Las migraciones, backups y restauración tienen procedimiento probado.
