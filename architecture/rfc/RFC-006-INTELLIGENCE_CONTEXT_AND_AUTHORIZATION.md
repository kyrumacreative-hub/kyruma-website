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

## Decisión aprobada

Se adopta la alternativa 1: `IntelligenceScope` será un contrato de aplicación derivado exclusivamente de un `ResolvedOrganizationContext` o un `ResolvedPartnerContext` ya resuelto. No resolverá Memberships, Partner ni Workspace y no creará un tercer contexto mutable en Foundation.

El catálogo aditivo aprobado para la siguiente implementación de Foundation es:

- `intelligence.request`
- `intelligence.read`
- `intelligence.review`
- `intelligence.archive`
- `intelligence.policy.manage`

Matriz inicial: Super Admin recibe todas; Admin recibe request/read/review/archive; Strategist recibe request/read/review; los demás roles no reciben capacidad por defecto. Los grants y revocations continúan siendo la única excepción a esta matriz.

El scope conserva `organizationId` siempre; `partnerId` y `workspaceId` son opcionales antes de Partner Creation y obligatorios cuando el recurso se consulta desde Partner Context. Una fuente pre‑Partner nunca se reautoriza como Partner sin una transición explícita y auditada.

## Impacto

No modifica contratos existentes de Foundation. La ampliación del catálogo será aditiva y deberá realizarse en un incremento de Engineering posterior con pruebas de Membership, scope, visibilidad, grants y revocations.

## Estado

**APPROVED**
