# RFC-008 — Intelligence Snapshots and Reliable Events

## Problema

Una llamada a modelo es un efecto externo que no puede revertirse con una transacción PostgreSQL. PS‑005 exige snapshots inmutables, idempotencia, Audit, Timeline y reconciliación segura.

## Decisión requerida

- Forma de snapshot, hash, clasificación y versionado.
- Outbox, correlation ID, deduplicación y reconciliación mediante model run ID.
- Semántica de reintentos, timeout y estado `failed`.
- Separación de Domain Events, Audit y Timeline.

## Decisión aprobada

La solicitud y su snapshot se persistirán de forma atómica con un registro Transactional Outbox. Un worker procesa el evento después de commit y ejecuta el gateway fuera de la transacción de origen. El worker usa `correlationId` y `modelRunId` para deduplicar reintentos y persiste un único resultado estructurado por versión.

La respuesta se guarda en una transacción independiente junto con su evento de dominio, Audit y proyección de Timeline. Los errores de gateway se convierten en `failed` con código seguro, duración y correlation ID; no exponen payload ni secretos. La reconciliación consulta el `modelRunId` antes de repetir una llamada externa.

Ningún worker puede aprobar, crear Partner, modificar la fuente ni ejecutar otra acción. Solo un caso de uso de revisión humana puede producir `approved`.

## Impacto

El patrón reutiliza TransactionRunner, Outbox y envelope idempotente ya aprobados. Requiere adaptadores concretos en Engineering, pero no cambios de Foundation ni consumidores externos durante la primera implementación.

## Estado

**APPROVED**
