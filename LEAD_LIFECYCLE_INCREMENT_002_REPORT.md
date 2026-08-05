# Lead Lifecycle — Increment 2 Report

## Implementado

- Value Objects: LeadId, OrganizationId, ContactId, OwnerId, LeadOrigin y LeadStatus.
- Errores tipados de Lead Lifecycle.
- `LeadFactory` como única creación oficial del Aggregate.
- Pruebas de fábrica, invariantes, Value Objects y errores.

## Fuera de alcance

- Persistencia, repositorios, transacciones, eventos, autorización, API y UI.

## Cobertura del núcleo

Las pruebas cubren todas las rutas de creación del Aggregate: valores obligatorios, origen, estado inicial, creador y errores específicos. La cobertura porcentual se incorporará cuando se apruebe una herramienta de cobertura; no se añadió ninguna dependencia en este incremento.

## Compatibilidad

No se modificó Foundation ni Product. El modelo sigue siendo puro y no depende de persistencia, contexto o infraestructura.
