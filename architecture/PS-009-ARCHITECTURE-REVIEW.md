# PS-009 Event Bus™ — Architecture Review

**Resultado:** APPROVED — READY FOR ENGINEERING  
**Fecha:** 2026-08-14

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

No quedan bloqueos arquitectónicos reales. Se emite **READY FOR ENGINEERING**.
