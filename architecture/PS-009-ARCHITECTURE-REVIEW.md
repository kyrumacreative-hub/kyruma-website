# PS-009 Event Bus™ — Architecture Review

**Resultado:** APPROVED — ENGINEERING COMPLETE — INTEGRATED IN MAIN

**Fecha:** 2026-08-14

**Baseline canónico:** `main@1d76a7f` / `v0.4.0`

**CI final:** SUCCESS (`175bae7`, `6c6491b`)

**Producción:** NOT DEPLOYED

## Evidencia

- RFC-018 resuelve envelope, naming, versiones, compatibilidad y seguridad del payload.
- RFC-019 resuelve Outbox atómico, dispatcher, concurrencia y frontera de transporte.
- RFC-020 resuelve idempotencia, retries, dead letters, recuperación, aislamiento y loops.

## Restricciones de implementación

Se reutilizan `TransactionRunner`, `PrismaTransactionContextStore`, Prisma/PostgreSQL, Organization context, errores tipados y clock inyectable. Foundation y PS-004 a PS-008 permanecen congelados salvo la ampliación estrictamente necesaria del esquema y exports de composición. No se introduce broker, scheduler, API, UI ni despliegue.

## Riesgos aceptados

- At-least-once exige idempotencia adicional para efectos externos.
- La operación periódica del dispatcher queda a cargo del runtime futuro; PS-009 entrega el caso de uso invocable.
- La política de retención física queda pendiente de una política operativa aprobada; v1 no borra eventos.

No quedan bloqueos arquitectónicos reales. El gate **READY FOR ENGINEERING** fue emitido y satisfecho. La implementación aprobada está integrada en `main@1d76a7f`, validada por CI y no desplegada a producción.
