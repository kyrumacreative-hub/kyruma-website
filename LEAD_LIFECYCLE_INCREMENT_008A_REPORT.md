# Lead Lifecycle — Increment 8A Report

## Objetivo

Completar los contratos de aplicación necesarios para exponer una API interna posterior, sin crear rutas, UI, proveedor de sesión, PostgreSQL operativo ni Event Bus.

## Implementado

- Casos de uso de lectura de Lead, historial de Ownership y estado de Discovery.
- Actualización del Contact principal, único campo de relación mutable ya presente en el Aggregate; el origen permanece inmutable.
- Archivo y reactivación explícita con motivo, actor, metadata de archivo y eventos de dominio.
- Inicio de Qualification con comprobación de Discovery completada y ausencia de Qualification abierta.
- Puertos de lectura para Discovery y estado de Qualification.
- Puerto de Partner Creation que coordina creación de Partner, identificador público `KYR-XXX`, Workspace y Membership inicial sin activar acceso externo ni Onboarding.
- `CreatePartnerUseCase` coordinado con el puerto y con la decisión de Qualification indicada.
- Audit Context y autorización mediante `ResolvedOrganizationContext` en todos los nuevos casos de uso.

## Transiciones

- `identified`, `discovery_in_progress`, `discovery_completed`, `qualified` y `on_hold` pueden archivar.
- `archived` solo puede reactivarse a `identified`.
- Se mantienen las transiciones aprobadas hacia `qualified` y `partner_created`.
- Las transiciones inválidas se rechazan desde el Aggregate.

## Fuera de alcance

- API, UI, adaptadores de PostgreSQL, proveedor de identidad, Timeline persistente, Event Bus, Onboarding y activación de acceso externo.
- Cambios en Foundation, PS-004 y contratos externos existentes.

## Validación

- `test:foundation`: 13 pruebas superadas.
- `test:lead-lifecycle`: 28 pruebas superadas.
- Lint, TypeScript y build: superados.

## Riesgo abierto

Los puertos nuevos no tienen adaptadores reales mientras no se active infraestructura PostgreSQL. La futura API deberá recibir sus dependencias mediante composición de servidor, sin acceder a repositorios desde controllers.
