# PS-008 — Audit™

## 1. Metadata

| Field | Value |
| --- | --- |
| Version | 0.2 |
| Status | Complete · Integrated in Main · CI Validated · Not Deployed |
| Owner | Product |
| Engineering | Complete · `main@0516703` |
| Depends on | Foundation, shared TransactionRunner, Organization/Partner/Workspace context |

## 2. Executive Summary

Audit™ conserva evidencia fiable, inmutable y consultable de las acciones relevantes realizadas dentro de KYRUMA OS™. Permite determinar qué ocurrió, cuándo, quién actuó, sobre qué recurso, desde qué contexto, con qué resultado, qué cambió y qué decisión o evento causó la acción.

Audit™ no sustituye a Timeline™, Analytics™, logging técnico ni observabilidad. Un mismo hecho puede generar registros separados en esos sistemas, pero ninguno utiliza Audit™ como sustituto de su almacenamiento canónico.

## 3. Scope

### In scope

- Registro de acciones críticas, denegadas y fallidas relevantes.
- Actor humano o de sistema identificado explícitamente.
- Organization, Partner y Workspace efectivos cuando existan.
- Recurso, acción, resultado, cambios permitidos y correlación causal.
- Búsqueda autorizada, exportación restringida y retención por categoría.
- Integridad append-only, idempotencia y aislamiento multitenant.

### Out of scope

- Métricas comerciales o analítica de comportamiento.
- Timeline o actividad narrativa para Partners.
- Logging técnico general, trazas y monitorización de rendimiento.
- Contenido completo de documentos o respuestas con PII.
- Detección automática de fraude y cumplimiento jurídico declarado.

## 4. Domain Boundary

Audit™ recibe solicitudes de evidencia mediante contratos estables; no depende de Aggregates internos de otros dominios. Es responsable de validar, normalizar, minimizar y persistir cada evidencia, además de autorizar su consulta y exportación.

- **Audit™:** evidencia técnica y operativa restringida.
- **Timeline™:** actividad comprensible y contextual para usuarios.
- **Analytics™:** datos agregados para métricas.

Los tres sistemas permanecen separados y ninguno es almacenamiento canónico de otro.

## 5. Aggregate and Data Contract

### AuditEvent

`AuditEvent` representa una evidencia inmutable de una acción relevante.

Campos mínimos:

- `id`
- `eventType`
- `occurredAt`
- `recordedAt`
- `actorId`
- `actorType`
- `organizationId`
- `partnerId?`
- `workspaceId?`
- `resourceType`
- `resourceId`
- `action`
- `result`
- `correlationId`
- `causationId?`
- `requestId?`
- `source`
- `metadata`
- `changes`
- `schemaVersion`

`partnerId` y `workspaceId` son opcionales únicamente cuando la acción ocurre antes de su creación o fuera de esos contextos. Las operaciones globales de Super Admin utilizan un contexto de sistema aprobado y siguen perteneciendo a una Organization técnica explícita.

### Results

- `success`
- `denied`
- `failed`

Una operación nunca se registra como `success` antes de confirmar su persistencia. Un rollback puede originar una evidencia independiente `failed`, pero nunca una evidencia exitosa.

## 6. Business Rules

- **BR-AUD-001:** todo AuditEvent es inmutable después de su creación.
- **BR-AUD-002:** no existe eliminación individual mediante operaciones ordinarias.
- **BR-AUD-003:** toda acción crítica identifica actor; los procesos usan actor de sistema explícito.
- **BR-AUD-004:** todo evento pertenece a una Organization o contexto técnico aprobado.
- **BR-AUD-005:** las denegaciones sobre recursos protegidos o con riesgo de seguridad se auditan.
- **BR-AUD-006:** nunca se almacenan contraseñas, tokens, secretos, cadenas de conexión, cookies, cabeceras de autorización, URLs con credenciales, respuestas completas con PII ni contenido completo de documentos.
- **BR-AUD-007:** `changes` usa una allowlist explícita; los valores sensibles se omiten, enmascaran, resumen o sustituyen por referencias seguras.
- **BR-AUD-008:** cada evento conserva `schemaVersion` y permanece interpretable.
- **BR-AUD-009:** los reintentos no crean evidencias confirmadas contradictorias.
- **BR-AUD-010:** toda lectura y exportación respeta Organization, Partner y Workspace efectivos.
- **BR-AUD-011:** toda exportación genera su propio AuditEvent.
- **BR-AUD-012:** Audit™ nunca permite reconstruir secretos o datos cuyo acceso haya sido retirado.
- **BR-AUD-013:** si una evidencia transaccional obligatoria falla, la operación crítica hace rollback.
- **BR-AUD-014:** las consultas no alteran registros ni su orden cronológico.
- **BR-AUD-015:** la retención se aplica por categoría mediante política versionada, sin eliminaciones arbitrarias.

## 7. Initially Auditable Actions

### Identity and authorization

- Inicio y cierre de sesión, recuperación y revocación de sesión.
- Acceso denegado, cambio de rol, grants y revocations.
- Invitación creada, aceptada, expirada o revocada.

### Product domains

- Lead creado, actualizado, reasignado, cualificado, archivado o reactivado.
- Análisis de Discovery generado, revisado, archivado o consultado cuando contiene información sensible.
- Conversión a Partner iniciada, completada, fallida o repetida.
- Workspace creado, activado o actualizado; Members e invitaciones modificados.

### Data and administration

- Exportación, eliminación aprobada, anonimización y cambio de retención.
- Acceso administrativo extraordinario.

La enumeración concreta se versionará. Añadir un tipo de evento no amplía automáticamente los datos permitidos en `metadata` o `changes`.

## 8. Use Cases

### UC-008.1 — Record Audit Event

Valida y registra una evidencia después de confirmar la operación o dentro de la misma transacción cuando la atomicidad sea obligatoria.

### UC-008.2 — Get Audit Event

Obtiene una evidencia concreta dentro del scope y clasificación autorizados.

### UC-008.3 — Search Audit Events

Busca por intervalo temporal, actor, recurso, acción, resultado, correlación, Organization, Partner y Workspace mediante paginación estable.

### UC-008.4 — Export Audit Events

Genera una exportación limitada al scope autorizado, excluye datos restringidos, asigna identificador y expiración, y audita solicitud, resultado y descarga autorizada.

### UC-008.5 — Apply Retention Policy

Aplica una política versionada y trazable por categoría, respetando anonimización y futuros legal holds, sin habilitar borrado arbitrario.

## 9. Capabilities and Visibility

Capacidades canónicas:

- `audit.read`
- `audit.read.security`
- `audit.export`
- `audit.retention.manage`

| Role | Default access |
| --- | --- |
| Super Admin | Todas las capacidades, sujetas a scope y auditoría |
| Admin | `audit.read`, `audit.export` dentro de Organizations autorizadas |
| Strategist | `audit.read`, excluyendo seguridad restringida |
| Designer / Developer / Viewer | Sin acceso general |
| Partner | Sin acceso al Audit técnico |

Los roles no conceden acceso por sí solos: Foundation aplica Membership, scope, grants y revocations. Todo acceso extraordinario requiere grant explícito y queda auditado.

## 10. Transaction and Delivery Model

Las acciones críticas persisten la operación y su AuditEvent en la misma transacción compartida. Como mínimo:

- Cambios de permisos.
- Creación de Partner y activación de Workspace.
- Aceptación o revocación de invitaciones.
- Exportación, eliminación o anonimización.
- Operaciones administrativas extraordinarias.

Las acciones no críticas pueden usar entrega asíncrona fiable. El Event Bus puede transportar solicitudes, pero no es la única garantía de trazabilidad ni es obligatorio para el camino crítico.

La idempotencia de una evidencia confirmada se evalúa, como mínimo, por `organizationId`, `correlationId`, `eventType`, `resourceType`, `resourceId` y `schemaVersion`. Los reintentos pueden aportar telemetría técnica separada, pero no resultados contradictorios.

## 11. Storage and Integrity

Audit™ utiliza un registro append-only como fuente de verdad. Los eventos se crean, consultan, exportan bajo autorización y pueden sufrir anonimización controlada por política; no se actualizan ni eliminan mediante operaciones ordinarias.

La solución debe ser compatible con PostgreSQL e infraestructura compartida y contemplar:

- Restricciones contra `UPDATE` y `DELETE` no autorizados.
- Acceso de escritura mínimo y separado del acceso de lectura/exportación.
- Índices por contexto, tiempo, actor, recurso y correlación.
- Particionado futuro sin cambiar el contrato del dominio.
- Orden estable por `occurredAt`, `recordedAt` e `id`.
- Migraciones aditivas y contratos versionados.

## 12. Privacy, Retention and Export

Categorías iniciales de retención:

1. Seguridad e identidad.
2. Autorización y permisos.
3. Operaciones sobre datos.
4. Exportación, eliminación y anonimización.
5. Actividad operativa.
6. Errores y accesos denegados.

La arquitectura admite periodos diferentes, conservación legal futura, anonimización, suspensión temporal de eliminación y cambios de política sin alterar el modelo central. Los periodos jurídicamente definitivos quedan pendientes de validación legal antes de producción.

Cuando una identidad deja de existir, se conserva su identificador histórico no reutilizable y la trazabilidad estructural; sus datos personales pueden anonimizarse sin reasignar la evidencia.

Las exportaciones requieren `audit.export`, respetan scope y filtros temporales, excluyen datos restringidos, caducan y nunca producen enlaces públicos permanentes.

## 13. Domain Events

- `AuditEventRecorded`
- `AuditExportRequested`
- `AuditExportCompleted`
- `AuditExportFailed`
- `AuditRetentionApplied`

Estos eventos no sustituyen al AuditEvent canónico y usan contrato versionado, payload mínimo y correlación explícita.

## 14. Edge Cases

- Actor eliminado: conservar identificador histórico y representación anonimizada segura.
- Rollback de operación principal: no registrar `success`; emitir `failed` separado si la política lo exige.
- Fallo de Audit durante operación crítica: rollback completo.
- Intento de auditar un secreto: rechazar o transformar antes de persistir, sin copiar el valor al error.
- Exportación fuera de scope: denegar y auditar el intento.
- Reintento: devolver o reconocer la evidencia confirmada sin duplicar resultados.
- Evento asíncrono fuera de orden: conservar tiempos de ocurrencia y registro, y ordenar consultas de forma estable.
- Cambio de clasificación o retención: aplicar la nueva política mediante operación trazable, sin mutación arbitraria.

## 15. Acceptance Criteria

- **AC-AUD-001:** ningún AuditEvent puede modificarse mediante operaciones ordinarias después de persistirse.
- **AC-AUD-002:** toda consulta y exportación respeta el aislamiento de contexto y clasificación.
- **AC-AUD-003:** secretos y payloads sensibles completos nunca aparecen en Audit™.
- **AC-AUD-004:** toda operación crítica registra actor, acción, recurso, resultado, contexto y fecha.
- **AC-AUD-005:** toda exportación queda auditada y expira.
- **AC-AUD-006:** las denegaciones relevantes quedan registradas sin filtrar información protegida.
- **AC-AUD-007:** los reintentos no producen evidencias confirmadas contradictorias.
- **AC-AUD-008:** una operación revertida nunca aparece como exitosa.
- **AC-AUD-009:** contratos históricos siguen siendo interpretables mediante `schemaVersion`.
- **AC-AUD-010:** la política de retención no permite eliminaciones arbitrarias y deja evidencia de su aplicación.

## 16. Required Architecture Decisions

- RFC-015 — Audit Storage and Immutability.
- RFC-016 — Audit Transaction and Delivery Model.
- RFC-017 — Audit Privacy, Retention and Export.

## 17. Out of Scope for v1

- Detección de fraude o anomalías.
- Firmas criptográficas, ledger distribuido o almacenamiento WORM externo.
- Portal de autoservicio para Partners.
- Legal hold operativo hasta existir política jurídica aprobada.
- SIEM externo y exportación continua.
- Métricas, alertas y observabilidad general.

## 18. Product Decisions

1. La fuente de verdad es append-only y compatible con PostgreSQL.
2. La auditoría crítica comparte transacción con la operación principal; la no crítica puede usar entrega fiable posterior.
3. `metadata` y `changes` usan allowlists y nunca almacenan secretos o payloads completos sensibles.
4. La identidad histórica permanece, con anonimización controlada cuando corresponda.
5. La retención es configurable por categoría; los periodos definitivos requieren validación legal.
6. Foundation conserva la autoridad sobre capacidades, scopes, grants y revocations.
7. Las exportaciones están limitadas, expiran y se auditan a sí mismas.
8. El Event Bus no es requisito del camino crítico.
9. Audit™, Timeline™ y Analytics™ permanecen separados.
10. La aplicación no expone actualización ni eliminación individual de AuditEvent.
11. Intentos, fallos, denegaciones y éxitos confirmados son resultados distintos.
12. La clave de idempotencia evita evidencias confirmadas contradictorias.

## 19. Traceability Matrix

| Need | Use case | Decision/RFC | Acceptance |
| --- | --- | --- | --- |
| Evidencia inmutable | Record/Search | PD 1, 10 / RFC-015 | AC-001, AC-009 |
| Atomicidad | Record | PD 2, 8, 11 / RFC-016 | AC-004, AC-008 |
| Privacidad | Record/Retention | PD 3–5 / RFC-017 | AC-003, AC-010 |
| Aislamiento | Get/Search/Export | PD 6–7 / RFC-017 | AC-002, AC-005, AC-006 |
| Reintentos seguros | Record | PD 12 / RFC-016 | AC-007 |
| Límites de dominio | All | PD 9 | Almacenamientos separados |
