# KYRUMA OS™ Engineering Release v0.1.0

**Fecha:** 2026-08-05  
**Estado:** Released (Engineering internal)  
**Tag:** `os-foundation-v0.1.0`  
**Alcance:** Foundation aprobada y congelada

## Objetivo

Entregar una base técnica trazable para futuros dominios de KYRUMA OS™ sin alterar la web pública, KYRUMA Discovery™ ni el comportamiento productivo de KYRUMA Platform.

## Incluido

### Architecture

- Límites entre web pública, KYRUMA Discovery™ y la futura plataforma OS.
- Modelo de dominio, routing propuesto, datos, eventos, seguridad, riesgos y roadmap.
- Revisión ejecutiva y alineamiento con las decisiones de negocio aprobadas.

### Identity & Permissions

- Puertos de identidad independientes del proveedor.
- Modelo de autorización basado en Capabilities + Memberships; los Roles solo agrupan capacidades.
- Evaluación y guard de autorización de servidor.

### Partner Context

- Resolución de User, Membership, Organization, Partner y Workspace con contexto explícito.
- Partner público `KYR-XXX`, resolución multi-workspace compatible, guard de contexto y cambio de Partner.
- Eventos de infraestructura de contexto sin consumidores de negocio.

### Foundation Readiness

- Revisión cruzada, documentación consolidada, inventario de riesgos/deuda y checklist para el primer dominio funcional.
- Pruebas unitarias de Foundation que validan autorización, Membership revocada, aislamiento de contexto, Workspace y switching.

## Excluido explícitamente

- Lead Lifecycle.
- Discovery como dominio persistente.
- Strategy.
- Projects.
- Documents.
- Client Portal.
- Intelligence.

También quedan fuera Login, proveedor de identidad, base de datos real, rutas internas, UI, Audit persistente, Timeline funcional, integraciones y automatizaciones.

## Decisiones relevantes

- La autenticación se mantiene desacoplada del proveedor.
- PostgreSQL está aprobado como motor lógico; el proveedor de infraestructura sigue abierto.
- Crear un Partner es siempre una decisión humana interna; activar su Workspace es independiente y exige onboarding.
- Los datos se archivan antes de eliminarse, se versionan/auditan cuando corresponda y se exportan cuando aplique; los plazos concretos quedan pendientes de asesoramiento jurídico.
- Intelligence será asistencial: no modifica datos ni ejecuta acciones automáticamente.
- Web pública y KYRUMA OS™ comparten repositorio hasta que exista una necesidad técnica demostrable de separarlos.

## Riesgos abiertos

| Riesgo | Estado | Próximo tratamiento |
| --- | --- | --- |
| Proveedor de identidad sin seleccionar | Abierto, no bloqueante | Antes de Login o rutas internas. |
| Persistencia PostgreSQL sin proveedor | Abierto, no bloqueante | Antes del primer repositorio real. |
| Política legal de retención sin plazos | Abierto, condicionante | Antes de almacenar datos de dominio. |
| Eventos sin outbox ni garantías de entrega | Abierto, no bloqueante | Antes de consumidores críticos o efectos externos. |
| Audit y Timeline sin implementación persistente | Abierto, condicionante | Antes de activar un dominio que los requiera. |

## Verificación de release

- `npm run test:foundation`: 8 pruebas superadas.
- `npm run lint`: superado.
- `npm run build`: superado.

## No implica

Esta Engineering Release no se ha fusionado con `main`, no se ha desplegado y no constituye una Release pública. La siguiente implementación funcional requiere una Product Specification y aprobación expresa.
