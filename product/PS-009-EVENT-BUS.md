# PS-009 — Event Bus™

**Versión:** 0.1  
**Estado:** PRODUCT APPROVED  
**Owner:** Product  
**Architecture:** RFC-018, RFC-019 y RFC-020 requeridos

## Objetivo y principios

Event Bus™ transporta hechos confirmados entre módulos de KYRUMA OS™ de forma fiable y desacoplada. No es fuente de verdad, workflow engine, scheduler, sistema de autorización, Audit™, Timeline, logging, notificaciones ni integración directa con proveedores. Los dominios conservan el ownership de sus datos y contratos.

La v1 usa PostgreSQL Transactional Outbox y dispatcher interno, ofrece entrega **at-least-once** y deja una frontera estable para sustituir el transporte por un broker externo. No promete exactly-once ni orden global.

## Alcance

- Event Envelope canónico e inmutable.
- contratos explícitamente versionados y ownership por dominio;
- publicación transaccional, routing y suscripción;
- procesamiento aislado por consumer/handler;
- registros operativos, idempotencia, retries y dead letters recuperables;
- correlation, causation, protección de loops y observabilidad segura.

## Event Envelope

Campos obligatorios: `eventId`, `eventType`, `eventVersion`, `occurredAt`, `publishedAt`, `correlationId`, `causationId`, `organizationId`, `source`, `aggregateType`, `aggregateId`, `payload` y `metadata`.

Campos opcionales: `partnerId`, `workspaceId`, `actorId` y `requestId`. Los payloads contienen solo datos necesarios, identifican presencia de PII y nunca incluyen secretos, credenciales, tokens, cookies, connection strings, documentos completos ni Aggregates completos.

Los tipos son Domain Event, Integration Event y System Event. Un Domain Event no se convierte automáticamente en Integration Event. Los System Events no modifican directamente estado de negocio.

## Contratos y versiones

Cada evento tiene un único dominio propietario. Solo ese dominio define semántica, compatibilidad y retirada. El nombre público incluye versión (`workspace.activated.v1`). Cambios incompatibles requieren versión nueva; un productor puede emitir versiones paralelas durante una transición. Cada consumidor declara nombre, tipos/versiones, handler, retry e idempotencia.

## Publicación y entrega

Un hecho se publica solo después de confirmarse. Cuando depende de una operación persistida, la mutación y el Outbox Event se guardan mediante el `TransactionRunner` en la misma transacción. Tras el commit, el dispatcher crea entregas independientes por handler. Un consumidor fallido no bloquea a los demás.

Cada entrega conserva `eventId`, consumer, handler, estado, intentos y timestamps. Estados oficiales: `pending`, `processing`, `processed`, `retrying`, `dead_lettered`.

## Idempotencia, retries y dead letters

La clave de procesamiento es `(eventId, consumer, handler)`. El efecto observable de una entrega repetida equivale a una sola ejecución. La política estándar es intento inicial y retries tras 1m, 5m, 30m, 2h y 12h; después se marca `dead_lettered`. Errores tipados no recuperables pueden ir directamente a dead letter.

Las dead letters nunca se borran silenciosamente. Conservan evento, handler, causa normalizada, intentos e historial. El reprocesamiento autorizado reutiliza `eventId`, mantiene la historia, crea nueva evidencia operativa y se integra con Audit™ cuando esté disponible.

## Correlation, causation, orden y loops

Una cadena conserva `correlationId`; un evento causado por otro usa `causationId = eventId` causante. No hay orden global. Cuando un Aggregate requiere orden, el productor incluye secuencia en metadata y el consumidor la valida.

La infraestructura limita la profundidad de una cadena y rechaza ciclos anómalos usando correlation, causation, tipo y profundidad. El evento original nunca se modifica.

## Casos de uso

- `PublishEventUseCase`
- `DispatchPendingEventsUseCase`
- `ProcessEventUseCase`
- `RetryFailedDeliveryUseCase`
- `ReprocessDeadLetterUseCase`
- `GetEventDeliveryStatusUseCase`

## Reglas de negocio

1. `eventId` es único; tipo y versión son obligatorios.
2. Todo evento identifica productor, Organization y Aggregate.
3. Un evento persistido es inmutable.
4. Todo handler es idempotente y aislado.
5. Los retries conservan `eventId`.
6. Las dead letters permanecen recuperables y su intervención se audita.
7. No se almacenan secretos.
8. No hay orden global ni eliminación silenciosa.
9. Outbox y operación de negocio son atómicos.
10. Cambios incompatibles incrementan versión.

## Edge cases exigidos

- Duplicado: no repite efectos.
- Caída después del commit: Outbox conserva el evento.
- Fallo de handler: registra intento y programa retry.
- Éxito antes de registrar `processed`: una redelivery sigue siendo segura por idempotencia del efecto.
- Versión incompatible o secreto: error tipado y dead letter/rechazo seguro.
- Evento fuera de orden: el consumidor aplica su política explícita.
- Loop: se detiene la cadena y se conserva evidencia técnica.

## Acceptance Criteria

- AC-EVT-001: no se pierde un evento transaccional confirmado.
- AC-EVT-002: los handlers toleran duplicados.
- AC-EVT-003/004: eventos inmutables y contratos versionados.
- AC-EVT-005: un consumer fallido no bloquea otros.
- AC-EVT-006/007: dead letters recuperables y retries con el mismo `eventId`.
- AC-EVT-008: no se persisten secretos.
- AC-EVT-009/010: atomicidad Outbox y ausencia de efectos duplicados.
- AC-EVT-011: correlation/causation reconstruyen la cadena.
- AC-EVT-012/013: no hay eliminación silenciosa y el reprocesamiento se audita.
- AC-EVT-014: incompatibilidad implica versión nueva.
- AC-EVT-015: un broker externo puede sustituir al dispatcher sin cambiar contratos de dominio.

## Integraciones y restricciones

Se reutilizan exclusivamente IDs compartidos, Organization context, `TransactionRunner`, `PrismaTransactionContextStore`, Prisma/PostgreSQL, clock, errores tipados y patrones existentes. No se modifica Foundation ni PS-004 a PS-008 salvo integración estrictamente necesaria y documentada. Audit™ crítico conserva su vía transaccional directa; el Event Bus no lo sustituye.

## Decisiones Product

- PD-EVT-001: at-least-once.
- PD-EVT-002: Transactional Outbox obligatorio.
- PD-EVT-003: PostgreSQL + dispatcher interno.
- PD-EVT-004: sin orden global.
- PD-EVT-005: handlers idempotentes.
- PD-EVT-006: 1m → 5m → 30m → 2h → 12h → dead letter.
- PD-EVT-007: eventos inmutables.
- PD-EVT-008: no almacena estado canónico.
- PD-EVT-009: Audit crítico no depende exclusivamente del bus.
- PD-EVT-010: broker externo fuera de v1.

## Gates

Architecture debe resolver RFC-018 Event Envelope and Contract Versioning, RFC-019 Transactional Outbox and Delivery y RFC-020 Consumer Idempotency and Dead Letter. Engineering solo comienza con los tres aprobados y `READY FOR ENGINEERING` emitido.
