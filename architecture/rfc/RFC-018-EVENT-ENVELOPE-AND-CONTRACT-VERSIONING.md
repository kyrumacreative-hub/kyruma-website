# RFC-018 — Event Envelope and Contract Versioning

**Estado:** APPROVED  
**PS:** PS-009 Event Bus™

## Decisión

El contrato público se expresa mediante `EventEnvelope<TPayload>` inmutable. `eventType` usa `<domain>.<fact>.v<major>` en minúsculas; `eventVersion` repite el major como entero positivo para validación y consulta. El registro de contratos asocia una combinación exacta tipo/versión con un validador, owner y clasificación PII.

El envelope separa contexto de negocio de metadata técnica. Fechas se serializan como ISO-8601 UTC. IDs son opacos. `correlationId` es obligatorio; `causationId` es `null` únicamente para eventos raíz. `processingDepth` comienza en cero y aumenta al derivar eventos. El máximo v1 es 32.

Los cambios aditivos opcionales son compatibles dentro de la misma versión. Renombrar/eliminar campos, cambiar significado/tipo o hacer obligatorio un campo exige major nuevo. Los consumidores se registran contra tipos/versiones exactos; no existe fallback implícito. Product debe aprobar la retirada de versiones.

La validación previa a persistencia rechaza campos peligrosos mediante claves normalizadas (`password`, `token`, `secret`, `credential`, `cookie`, `connectionString`, `authorization`) en cualquier profundidad. Esto complementa, no sustituye, la minimización contractual.

## Consecuencias

- Contratos de dominio no dependen de Prisma ni del dispatcher.
- Un futuro broker recibe el mismo envelope serializado.
- Versiones incompatibles fallan con error tipado y no se reinterpretan.
- No se impone schema registry externo en v1.

## Resolución

Envelope, naming, compatibilidad, metadata, correlation, causation, PII, secretos y evolución quedan resueltos sin bloqueos.
