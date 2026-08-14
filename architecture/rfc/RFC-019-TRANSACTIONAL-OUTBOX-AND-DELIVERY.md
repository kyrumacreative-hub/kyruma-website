# RFC-019 — Transactional Outbox and Delivery

**Estado:** APPROVED  
**PS:** PS-009 Event Bus™

## Decisión

PostgreSQL es el transporte durable v1. `EventOutbox` conserva el envelope JSON y columnas consultables. La creación acepta el `TransactionContext` compartido y obtiene el `Prisma.TransactionClient` mediante `PrismaTransactionContextStore`; así la mutación de dominio y el evento comparten el `TransactionRunner` existente.

El dispatcher reclama lotes mediante bloqueo transaccional `FOR UPDATE SKIP LOCKED`, crea una entrega independiente por registro de consumer/handler y marca el Outbox como despachado solo tras materializar todas las entregas conocidas. Un lease (`lockedAt`, `lockOwner`) permite recuperar procesos interrumpidos. No se borra Outbox.

La semántica es at-least-once. La frontera `EventTransport` separa persistencia/routing del transporte y permite sustituir el dispatcher por un broker sin cambiar productores, envelopes ni handlers. No hay orden global; el lote se ordena por creación solo para operación determinista.

## Consecuencias

- El commit de negocio no depende de que un consumer termine.
- Un crash antes de marcar dispatch provoca repetición segura.
- La unicidad `(eventId, consumer, handler)` evita duplicar registros de entrega.
- La publicación fuera de una transacción de negocio sigue usando `TransactionRunner` como unidad propia.

## Resolución

Atomicidad, locking, concurrencia, recuperación, batch, estados y sustitución futura por broker quedan resueltos sin bloqueos.
