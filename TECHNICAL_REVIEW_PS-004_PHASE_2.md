# Technical Review — PS-004 Phase 2

| Alcance | EP-004.1 a EP-004.5 |
| --- | --- |
| Fecha | 2026-08-05 |
| Decisión | **APPROVED WITH CONDITIONS** |

## Resumen ejecutivo

Las cinco épicas forman un flujo coherente: crear Lead, asignar Ownership, recopilar Discovery, emitir Qualification y crear Partner mediante decisión humana. El modelo no introduce un CRM genérico y respeta la separación de responsabilidades declarada por Product.

La implementación continúa bloqueada por condiciones de Foundation y contratos transversales aún no aprobados. No se recomienda iniciar código ni EP-004.6/004.7 hasta cerrarlas.

## Observaciones

| Clasificación | Observación | Impacto / condición |
| --- | --- | --- |
| Blocking | Foundation solo resuelve `ResolvedPartnerContext` con Partner y Workspace, mientras Lead existe antes de Partner. | RFC de contexto pre-Partner/Organization. |
| Blocking | No existen Capabilities de Lead, Ownership o Qualification; los Roles no pueden sustituirlas. | RFC de catálogo y matriz de Membership/visibilidad. |
| Blocking | Persistencia PostgreSQL, transacciones, Audit y Timeline persistentes no existen. | RFC de datos e infraestructura antes de BR/AC transaccionales. |
| Blocking | Contact, invitaciones Discovery y enlaces seguros implican PII/autenticación externa sin política ni proveedor. | Política legal y contrato de identidad/enlace antes de datos reales. |
| Blocking | EV-001 a EV-017 no definen versión, actor, ámbito, payload, consumidores ni idempotencia. | Contratos de eventos y separación Domain Event/Audit/Timeline. |
| Important | Owner se expresa como usuario, Foundation autoriza Memberships. | Definir identidad del Owner, colaboración y comportamiento ante revocación. |
| Important | `On Hold` no está clasificado para la unicidad de Lead activo. | Definirlo para BR-002/INV-009 y concurrencia. |
| Important | API/importación y Discovery reenvíos no fijan semántica de idempotencia/duplicados. | Completar Edge Cases antes de pruebas. |
| Important | Discovery declara que Lead Lifecycle es propietario del proceso y Discovery del contenido. | Definir interfaz pública y ownership de Submission, enlace, versión y cierre. |
| Important | Qualification habilita Partner Creation, pero no define el valor/cierre que constituye decisión elegible. | Fijar contrato de decisión y transición. |
| Nice to have | Los estados de Lead, Discovery, Qualification y Partner Creation están separados. | Publicar diagrama transversal para facilitar QA. |

## Arquitectura, contexto e identidad

Los límites de dominio son correctos: Lead es Aggregate Root; Ownership no cambia estado; Discovery no cambia directamente el Lead; Qualification no crea Partner; Partner Creation no activa Workspace ni Onboarding. Esto último es compatible con la decisión ejecutiva aprobada.

La arquitectura actual no ofrece un contexto autorizado para organizaciones sin Partner. La solución no debe implementarse dentro de estas épicas: exige RFC. El mismo criterio aplica a Capabilities nuevas, ya que Foundation está congelada.

## State Machines e integridad

- Lead: `Identified` solo permite Discovery In Progress, On Hold o Archived; falta definir si On Hold cuenta como activo.
- Discovery: Pending → In Progress → Completed → Reviewed; faltan transiciones de revocación/reenvío y relación exacta con versiones.
- Qualification: Not Started → In Progress → Decision Recorded → Completed; debe concretar el valor de decisión que habilita Partner Creation.
- Partner Creation: Eligible → Creation Requested → Partner Created; es coherente con la activación independiente de Workspace.

Las operaciones concurrentes de creación de Lead, cambio de Owner, decisión de Qualification y creación de Partner requieren unicidad e idempotencia en la infraestructura transaccional pendiente.

## Trazabilidad

| Área | Estado |
| --- | --- |
| Business Rules / Acceptance Criteria | Presente en EP-004.1 a EP-004.5. |
| User Stories / Main Flows | Presente. |
| Eventos / permisos / datos | Presente, pero sin contratos técnicos completos. |
| Edge Cases | Presente; faltan decisiones de canales no interactivos, tokens y reintentos. |
| Foundation compatibility | Condicional a RFCs bloqueantes. |

## Decisión final — APPROVED WITH CONDITIONS

**APPROVED WITH CONDITIONS.** La especificación es coherente a nivel funcional y puede continuar su maduración documental. No está autorizada para implementación hasta resolver todos los puntos `Blocking` y completar las condiciones `Important` que afectan integridad, permisos o seguridad.
