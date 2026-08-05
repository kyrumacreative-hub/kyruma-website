# RFC-001 Approval — Pre-Partner Context

## Estado

**APPROVED WITH CONDITIONS**

## Decisiones aprobadas

- Lead Lifecycle requiere un contexto explícito anterior a Partner.
- No se utilizarán Partner ni Workspace ficticios.
- El diseño debe conservar Membership activa, ámbito y autorización en servidor.
- La solución será aditiva y no alterará el actual `ResolvedPartnerContext`.

## Decisiones pendientes

- Contrato exacto de `Organization` interna de KYRUMA.
- Forma final de `ResolvedOrganizationContext` o contexto equivalente.
- Switching e invalidación entre contexto pre-Partner y Partner.

## Impacto

- **Foundation:** requiere RFC de implementación aprobado antes de añadir un provider/contexto.
- **Product:** no cambia reglas; permite expresar el ámbito previo a Partner.
- **Engineering:** bloquea todas las operaciones scoped de Lead hasta concretarlo.

## Riesgos

- Fuga de permisos si el contexto pre-Partner no conserva scope y Membership.
- Duplicación de lógica si se permite resolver Lead fuera de la infraestructura común.

## Acción requerida

**Aprobar el contrato de contexto pre-Partner/Organization con Architecture y Product.**
