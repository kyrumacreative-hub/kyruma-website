# RFC-002 — Lead Capabilities and Authorization

**Estado:** Draft  
**Origen:** Technical Review PS-004 Phase 2  
**Decisión requerida antes de:** EP-004.1 a EP-004.5

## Problema

Foundation autoriza por Capabilities + Memberships. El catálogo no contiene capacidades de Lead, Ownership, Qualification ni las acciones necesarias para Discovery pre-Partner. Usar `partner.create` como sustituto contradice los permisos definidos por Product.

## Objetivo

Definir un catálogo mínimo de capacidades y una matriz de Membership, ámbito y visibilidad para Lead Lifecycle, sin convertir Roles en control de autorización directo.

## Alcance propuesto para decisión

- Acciones de Lead: crear, leer, actualizar, archivar, reactivar.
- Acciones de Ownership: asignar, reasignar, consultar historial, solicitar cambio.
- Acciones de Discovery, Qualification y Partner Creation declaradas por PS-004.
- Visibilidad de Lead, Contact, historial, Discovery y Qualification.

## Alternativas

1. Añadir Capabilities granulares al catálogo aprobado.
2. Reutilizar Capabilities de Partner/Discovery existentes.
3. Autorizar directamente por Role.

La alternativa 3 contradice TD-003. La alternativa 2 solo es válida si una acción tiene exactamente la misma semántica y ámbito, lo que no ocurre para `lead.create`.

## Decisiones pendientes

- Nombres finales de Capabilities.
- Alcance de Strategist para crear frente a reasignar Owner.
- Capacidad para responder Discovery y modelo de Contact autorizado.
- Visibilidad y auditabilidad de consultas de historial.

## Criterios de aceptación

- Cada caso de uso tiene Capability, contexto y visibilidad explícitos.
- Roles solo agrupan capacidades.
- Revocación y scope mismatch se prueban en servidor.
- Ningún Partner, Designer, Developer o Viewer obtiene permisos implícitos.
