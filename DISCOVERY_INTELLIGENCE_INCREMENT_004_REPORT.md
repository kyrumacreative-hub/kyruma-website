# Discovery Intelligence™ — Increment 004 Report

## Estado

**Completado** en `feature/discovery-intelligence`, sobre la base compartida integrada desde PS-004.

## Infraestructura reutilizada

- Prisma Client y esquema PostgreSQL compartidos.
- `TransactionRunner.run(...)` y `PrismaTransactionContextStore` de Lead Lifecycle.
- Sin contrato transaccional, migración base o cliente Prisma duplicados.

## Persistencia entregada

- Modelos PostgreSQL `IntelligenceSnapshot` e `IntelligenceAnalysis`.
- Migración `20260805143703_discovery_intelligence_init` aplicada en desarrollo y test.
- Relación restrictiva Analysis → Snapshot.
- Unicidad de snapshot por Submission/versión; Analysis por Snapshot/versión; e idempotencia por Snapshot/correlation ID.
- Índices para consultas de historial por Submission/versión y snapshots por Organization.
- Repositorios Prisma reales para snapshots y analyses, con lecturas de historial, snapshot, correlación y Organization.

## Integridad comprobada

- Los snapshots son create-only: los repositorios no exponen actualización.
- El payload continúa protegido por el Snapshot inmutable del dominio.
- La creación de Analysis exige un Snapshot existente mediante clave foránea.
- Operaciones coordinadas usan transacciones reales y el contexto Prisma permanece opaco fuera de infraestructura.
- Reintentos con igual Snapshot/correlation ID son rechazados por la restricción de idempotencia.

## Pruebas

- Pruebas unitarias del dominio y mappers sin base de datos.
- Pruebas PostgreSQL reales, exclusivamente contra `TEST_DATABASE_URL`, de persistencia, recuperación, historial, aislamiento por Organization, idempotencia y rollback.
- Las pruebas de integración se ejecutan en un comando separado para no requerir una base de datos en la suite unitaria.

## Fuera de alcance

- Application Layer, API, UI, modelo de IA, Outbox, Audit y Event Bus.
- No se ha desplegado ni fusionado Discovery Intelligence™.
