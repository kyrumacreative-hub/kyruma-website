# ADR-001 — Persistence Transaction Model

**Estado:** Accepted  
**Fecha:** 2026-08-05

## Contexto

El contrato original de `UnitOfWork` exponía `begin()`, `commit()` y `rollback()`. Prisma usa transacciones interactivas delimitadas por callback (`$transaction(async tx => ...)`), por lo que ese contrato no puede implementarse correctamente sin ejecutar SQL manual, mantener estado mutable de infraestructura o filtrar `TransactionClient` al dominio.

## Alternativas evaluadas

1. Mantener `begin/commit/rollback` y emularlo con SQL manual.
2. Exponer `Prisma.TransactionClient` a servicios y repositorios.
3. Usar un ejecutor transaccional con callback y contexto opaco.

La alternativa 1 contradice el uso de transacciones nativas de Prisma. La alternativa 2 acopla el dominio al proveedor.

## Decisión

Se adopta `TransactionRunner.run<T>((context) => Promise<T>)`. `TransactionContext` es opaco para el dominio. Cada infraestructura adapta su transacción nativa dentro del callback y proporciona repositorios scoped al contexto cuando sea necesario.

## Impacto

- El nombre `UnitOfWork` se sustituye por `TransactionRunner`, que describe mejor el límite real.
- Los contratos de repositorio siguen independientes de Prisma y SQL.
- Un futuro adaptador Prisma podrá usar `$transaction`; otro proveedor podrá implementar el mismo puerto sin modificar servicios de dominio.

## Compatibilidad futura

El patrón permite outbox transaccional, rollback automático ante error y pruebas de integración con cualquier proveedor. No modifica Foundation, Product ni el modelo de dominio.
