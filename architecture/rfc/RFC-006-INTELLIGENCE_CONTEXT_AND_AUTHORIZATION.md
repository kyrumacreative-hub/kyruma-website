# RFC-006 — Intelligence Context and Authorization

## Problema

Discovery Intelligence™ puede analizar una fuente de Lead antes de Partner Creation o una fuente de Partner después de ella. Foundation dispone de Organization Context y Partner Context, pero no de un contrato común de scope para el dominio.

## Decisión requerida

- Definir si el dominio recibe una unión de contextos resueltos o un `IntelligenceScope` derivado.
- Aprobar capacidades `intelligence.request`, `intelligence.read`, `intelligence.review`, `intelligence.archive` y `intelligence.policy.manage`.
- Aprobar visibilidad de Analysis, snapshot y PII para cada Membership.

## Alternativas

1. Unión explícita de Organization/Partner Context derivada por Application Layer.
2. Nuevo contexto transversal en Foundation.
3. Duplicar guard por dominio.

La alternativa 3 se descarta. La 1 es recomendada inicialmente por ser aditiva y no modificar Foundation; la 2 requeriría evidencia de incompatibilidad.

## Estado

**Pending Architecture Approval**
