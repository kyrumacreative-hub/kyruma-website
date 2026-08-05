# Lead Lifecycle — Increment 5A Report

## Implementado

- Sustitución de `UnitOfWork` por `TransactionRunner` basado en callback.
- Contexto transaccional opaco e independiente del proveedor.
- ADR de la decisión de persistencia.
- Checklist de activación PostgreSQL.

## No implementado

- Repositorios Prisma, Unit of Work/TransactionRunner Prisma, conexión, migraciones aplicadas, datos o pruebas de integración.

## Validación

La modificación es contractual y no introduce dependencia de infraestructura en el dominio. PostgreSQL continúa desactivado hasta configurar `DATABASE_URL`.
