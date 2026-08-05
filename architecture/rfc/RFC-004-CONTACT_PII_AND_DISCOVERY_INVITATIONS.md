# RFC-004 — Contact PII and Discovery Invitations

**Estado:** Draft  
**Origen:** Technical Review PS-004 Phase 2  
**Decisión requerida antes de:** almacenar Contact o enviar invitaciones Discovery

## Problema

Contact, respuestas Discovery e invitaciones seguras implican datos personales, enlaces de acceso externo y posibles reenvíos/revocaciones. PS-004 define la intención funcional, pero no clasificación de datos, retención, autenticación/autoridad del Contact ni ciclo de vida del enlace.

## Objetivo

Definir una política compatible con el principio aprobado de archivar antes que eliminar, versionado/auditoría y exportación cuando corresponda.

## Decisiones pendientes

- Datos mínimos, sensibles y prohibidos para Contact y Discovery.
- Base legal, plazos, archivado, exportación y eliminación.
- Identidad de Contact autorizado y revocación de acceso.
- Entropía, expiración, un solo uso, reenvío y almacenamiento de enlaces Discovery.
- Qué información puede exponerse al detectar posibles Organizations duplicadas.

## Criterios de aceptación

- No se almacenan ni registran secretos o respuestas completas innecesarias.
- Un enlace revocado o caducado no autoriza respuesta.
- API, importación y UI no revelan datos de otro ámbito.
- Existe procedimiento de exportación/retención aprobado por Legal.
