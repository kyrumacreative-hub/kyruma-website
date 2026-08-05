# RFC-008 Approval

## Estado

**APPROVED**

## Decisiones aprobadas

- Snapshot y solicitud atómicos con Transactional Outbox.
- Worker externo a la transacción de origen.
- Idempotencia por correlation ID y model run ID.
- Resultado, Audit, Timeline y evento persistidos de forma coordinada.
- Solo revisión humana permite `approved`.

## Decisiones pendientes

Ninguna para iniciar Engineering.

## Impacto

- Foundation: ninguno.
- Product: no cambia.
- Engineering: requiere puertos Outbox, worker y reconciliación.

## Riesgos

Un gateway externo puede fallar o responder tarde; se trata mediante estado `failed`, reintento idempotente y reconciliación.

## Acción requerida

Implementar pruebas de idempotencia y fallos antes de conectar un gateway real.
