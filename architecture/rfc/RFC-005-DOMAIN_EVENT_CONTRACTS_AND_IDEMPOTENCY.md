# RFC-005 — Domain Event Contracts and Idempotency

**Estado:** Draft  
**Origen:** Technical Review PS-004 Phase 2  
**Decisión requerida antes de:** consumidores de EV-001 a EV-017

## Problema

PS-004 define diecisiete eventos, pero no declara versión, actor, ámbito, payload, consumidores, semántica de entrega o idempotencia. Architecture distingue Domain Event, Timeline Event, Audit Event y analítica; sin contrato, EV-002/003 y eventos posteriores pueden duplicar responsabilidades.

## Objetivo

Definir un sobre común de eventos y el patrón de entrega compatible con TD-005: hechos confirmados, consumidores desacoplados e idempotencia antes de efectos críticos.

## Decisiones pendientes

- Envelope: `eventId`, versión, fecha, actor, ámbito, recurso y correlación.
- Payload mínimo y clasificación de datos por evento.
- Qué eventos son hechos de dominio y cuáles son registros/proyecciones de Audit o Timeline.
- Entrega local, outbox y estrategia de reintento.
- Consumidores iniciales y control de duplicados.

## Criterios de aceptación

- Un evento se declara solo tras confirmar la transacción.
- Reintentos no duplican Partner, Timeline, Audit ni notificaciones.
- Eventos no contienen PII innecesaria.
- Audit y Timeline no se usan como sustitutos de hechos de dominio.
