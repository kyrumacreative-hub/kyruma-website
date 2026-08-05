# RFC-008 — Intelligence Snapshots and Reliable Events

## Problema

Una llamada a modelo es un efecto externo que no puede revertirse con una transacción PostgreSQL. PS‑005 exige snapshots inmutables, idempotencia, Audit, Timeline y reconciliación segura.

## Decisión requerida

- Forma de snapshot, hash, clasificación y versionado.
- Outbox, correlation ID, deduplicación y reconciliación mediante model run ID.
- Semántica de reintentos, timeout y estado `failed`.
- Separación de Domain Events, Audit y Timeline.

## Recomendación

Persistir snapshot y solicitud en una transacción; ejecutar el gateway fuera de ella; persistir la respuesta con idempotencia y publicar eventos mediante Transactional Outbox. Nunca marcar `approved` desde el worker.

## Estado

**Pending Architecture Approval**
