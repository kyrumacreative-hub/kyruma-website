# RFC-005 Approval — Domain Event Contracts and Idempotency

## Estado

**APPROVED WITH CONDITIONS**

## Decisiones aprobadas

- Los eventos describen hechos confirmados y se versionarán.
- Domain Event, Audit Event y Timeline Event permanecerán separados.
- Los eventos se declararán solo después de confirmar la operación.
- Los consumidores críticos exigirán idempotencia.

## Decisiones pendientes

- Envelope final y payload mínimo de EV-001 a EV-019.
- Clasificación de eventos de inicialización de Timeline/Audit.
- Patrón outbox, reintentos, correlación y consumidores iniciales.

## Impacto

- **Foundation:** sin modificación hasta que el contrato esté aprobado para implementación.
- **Product:** conserva los eventos definidos; Engineering concreta su forma técnica.
- **Engineering:** no debe construir consumidores ni automatizaciones antes del contrato.

## Riesgos

- Duplicados, pérdida de eventos o información personal excesiva en payloads.
- Acoplamiento de Timeline/Audit a efectos de negocio.

## Acción requerida

**Aprobar el envelope de eventos y el patrón de entrega idempotente.**
