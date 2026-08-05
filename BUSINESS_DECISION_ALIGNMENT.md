# KYRUMA OS™ — Business Decision Alignment

**Fuente:** Business Decision Pack — KYRUMA OS™ Foundation v1.0
**Estado:** Decisiones incorporadas a la propuesta técnica; no implica implementación.

| Decisión de negocio aprobada | Documento técnico actualizado | Resultado |
| --- | --- | --- |
| Lead, Organization, User, Membership, Partner y Workspace son conceptos distintos. | `DOMAIN_MODEL.md`, `AUTHORIZATION_MODEL.md` | Incorporado. |
| Partner solo nace por acción interna autorizada, comienza `ONBOARDING` y usa `KYR-XXX`. | `DOMAIN_MODEL.md`, `DATA_ARCHITECTURE.md`, `EVENT_ARCHITECTURE.md` | Incorporado. |
| Ciclos de vida concretos de Lead, Partner, Discovery Submission e Insight. | `DOMAIN_MODEL.md`, `IMPLEMENTATION_ROADMAP.md` | Incorporado. |
| Workspace interno/external y compatibilidad de `/workspace`. | `ROUTING_ARCHITECTURE.md`, `TECHNICAL_DECISIONS.md` | Incorporado; namespace final `/os` sigue pendiente de RFC. |
| Visibilidad `internal`, `shared`, `partner_private`, `public_link`. | `DOMAIN_MODEL.md`, `ROUTING_ARCHITECTURE.md`, `DATA_ARCHITECTURE.md` | Incorporado. |
| Roles como perfiles y capacidades con contexto completo. | `AUTHORIZATION_MODEL.md`, `TECHNICAL_DECISIONS.md` | Incorporado. |
| Timeline, Audit y analítica son sistemas diferentes. | `EVENT_ARCHITECTURE.md` | Incorporado. |
| Retención flexible y datos restringidos sin declarar cumplimiento legal. | `DATA_ARCHITECTURE.md`, `SECURITY_ARCHITECTURE.md` | Incorporado. |
| Orden funcional: Identity → Partner → Lead → Discovery → Review → Delivery → Portal → Intelligence → Automations. | `IMPLEMENTATION_ROADMAP.md` | Incorporado. |

## Conflictos y decisiones aún pendientes

No hay conflicto material con la arquitectura propuesta. Se corrigieron dos hipótesis previas: el Partner ID pasa a ser consecutivo `KYR-XXX`, y la convivencia en un repositorio deja de ser una decisión definitiva para permanecer como hipótesis operativa.

Siguen pendientes, por decisión expresa: proveedor de identidad, base de datos, almacenamiento, eventos distribuidos, IA, automatizaciones, múltiples workspaces activos, separación de repositorios y migración de `/workspace`.
