# RFC-020 — Consumer Idempotency and Dead Letter

**Estado:** APPROVED  
**PS:** PS-009 Event Bus™

## Decisión

`EventProcessingRecord` es simultáneamente registro de entrega y barrera de idempotencia con clave única `(eventId, consumer, handler)`. Cada handler se procesa en una transacción propia; el fallo de uno no revierte ni bloquea otros. El handler recibe el mismo `TransactionContext` para que su efecto y el estado `processed` puedan confirmarse juntos.

La política cuenta el intento inicial más cinco retries. Tras fallar se programa 1m, 5m, 30m, 2h y 12h; el siguiente fallo pasa a `dead_lettered`. `NonRetryableEventError` va directamente a dead letter. Solo se persisten código y mensaje sanitizado, nunca stack, payload duplicado ni secreto.

El reprocesamiento autorizado cambia la misma entrega a `pending`, conserva `attemptCount` e incrementa `reprocessCount`; no muta el evento ni borra historia. Requiere `organizationId` coincidente y un `AuditRecorder` port. Si Audit™ no está compuesto, una implementación explícita debe registrar la intervención; no se permite un fallback silencioso.

La protección de loops rechaza profundidad superior a 32 y la repetición del mismo tipo dentro de la cadena de causación conocida. Las cadenas incompletas se protegen al menos por profundidad.

## Consecuencias

- La infraestructura no puede garantizar exactly-once frente a efectos externos; cada adapter externo necesita su propia idempotency key.
- Los estados oficiales son `pending`, `processing`, `processed`, `retrying`, `dead_lettered`.
- Los leases expirados vuelven a ser reclamables.

## Resolución

Identidad del handler, atomicidad, retry, errores no recuperables, dead-letter recovery, autorización, Audit, aislamiento y loop protection quedan resueltos sin bloqueos.
