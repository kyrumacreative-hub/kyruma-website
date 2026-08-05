# RFC-004 Approval — Contact PII and Discovery Invitations

## Estado

**APPROVED WITH CONDITIONS**

## Decisiones aprobadas

- Contact y Discovery se tratarán como datos potencialmente personales.
- Se aplicará el principio de archivar antes que eliminar, con versionado y exportación cuando corresponda.
- Los enlaces revocados no autorizarán nuevas respuestas.
- No se expondrán datos de otro ámbito al detectar posibles duplicados.

## Decisiones pendientes

- Base legal, campos mínimos y plazos de retención.
- Modelo de identidad/autorización de Contact.
- Expiración, reenvío, un solo uso y almacenamiento de enlaces.

## Impacto

- **Foundation:** sin cambio hasta que exista un proveedor/contrato de identidad externo aprobado.
- **Product:** conserva sus reglas de Contact, invitación y revocación.
- **Engineering:** no puede almacenar PII ni enviar invitaciones reales hasta la decisión legal y de seguridad.

## Riesgos

- Incumplimiento de privacidad.
- Acceso no autorizado mediante enlaces reutilizados o expuestos.

## Acción requerida

**Obtener aprobación Legal y de Seguridad para la política de Contact e invitaciones Discovery.**
