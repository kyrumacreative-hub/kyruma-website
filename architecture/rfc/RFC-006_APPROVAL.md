# RFC-006 Approval

## Estado

**APPROVED**

## Decisiones aprobadas

- `IntelligenceScope` derivado de Organization o Partner Context.
- Catálogo `intelligence.*` y matriz inicial de capacidades.
- Scope explícito por Organization, con Partner/Workspace opcionales solo antes de Partner Creation.

## Decisiones pendientes

Ninguna para iniciar Engineering.

## Impacto

- Foundation: extensión aditiva futura del catálogo de capacidades.
- Product: sin cambio de alcance.
- Engineering: implementar el scope derivado y pruebas de autorización.

## Riesgos

La extensión del catálogo debe conservar compatibilidad de roles, grants y revocations.

## Acción requerida

Implementar la extensión aditiva durante el primer incremento de Engineering.
