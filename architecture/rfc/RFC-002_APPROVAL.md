# RFC-002 Approval — Lead Capabilities and Authorization

## Estado

**APPROVED WITH CONDITIONS**

## Decisiones aprobadas

- Las acciones de Lead Lifecycle usarán Capabilities + Memberships.
- Los Roles seguirán siendo agrupaciones de capacidades, no reglas de autorización directas.
- No se reutilizarán capacidades de Partner para acciones de Lead con semántica distinta.
- Las denegaciones se evaluarán en servidor con scope y visibilidad.

## Decisiones pendientes

- Nombres y catálogo final de Capabilities de Lead, Ownership, Discovery y Qualification.
- Matriz de visibilidad y permisos de lectura para historial y Contact.
- Modelo de autorización para Contact autorizado que responde Discovery.

## Impacto

- **Foundation:** ampliación aditiva del catálogo solo mediante RFC de implementación.
- **Product:** debe referenciar la matriz aprobada, sin cambiar sus actores.
- **Engineering:** no puede implementar permisos con seguridad hasta cerrar la matriz.

## Riesgos

- Privilegios excesivos o insuficientes si la matriz queda implícita.
- Acceso externo a Discovery sin contrato de identidad.

## Acción requerida

**Aprobar la matriz de Capabilities, Memberships y visibilidad de Lead Lifecycle.**
