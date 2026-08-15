# KYRUMA OS™ Engineering Release v0.1.0

## PS-008 Audit™ — Unreleased Engineering Baseline

**Estado:** Complete · Integrated in `main@0516703` · CI Validated · Not Deployed

Incluye evidencia inmutable versionada, persistencia PostgreSQL append-only, aislamiento por Organization, idempotencia, privacidad por allowlist/overlays, retención/exportación controladas y adaptadores transaccionales para Lead Lifecycle y Event Bus. La validación final es GitHub Actions `31883926330`. No se asignó versión ni tag nuevos; `v0.4.0` permanece sin cambios.

## PS-006 Partner Creation™ v1.0

**Estado:** Engineering Complete

Incluye el Aggregate Partner, conversión atómica con Workspace principal y Membership Owner inicial, secuencia pública `KYR-XXX`, persistencia PostgreSQL/Prisma y Application Layer interna limitada a creación y lectura. No incluye API, UI, Event Bus, onboarding, despliegue ni activación externa.

**Fecha:** 2026-08-05

### Controles superados

- Foundation, Lead Lifecycle™, Discovery Intelligence™ y Partner Creation™ en verde.
- Esquema Prisma y siete migraciones validados en desarrollo y test.
- Pruebas PostgreSQL, lint, TypeScript y build superados.

## PS-005 Discovery Intelligence™ v1.0

**Estado:** Engineering Complete

Incluye el dominio interno asistencial, snapshots inmutables, análisis versionado y revisado por personas, persistencia PostgreSQL y capacidades de Foundation. No incluye API, UI, Event Bus, automatizaciones ni despliegue.

**Fecha:** 2026-08-05  
**Estado:** Approved
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

## Pendiente

La siguiente etapa es **EP-004 — Lead Lifecycle**, con estado **Waiting for Product Specification**. No comenzará hasta que exista su especificación de producto y autorización expresa.

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

## Dependencias pendientes

- Selección del proveedor de identidad antes de Login o rutas internas.
- Selección del proveedor de PostgreSQL antes del primer Repository Adapter real.
- Política jurídica de plazos de retención antes de persistir datos de dominio.
- Product Specification aprobada de EP-004 antes de iniciar Lead Lifecycle.

## Decisión ejecutiva de aprobación

La dirección de KYRUMA aprueba formalmente la Foundation como **KYRUMA OS™ Engineering Release v0.1.0 — Foundation**. La Foundation queda congelada salvo correcciones de bugs, vulnerabilidades o incompatibilidades demostradas por futuros dominios. Esta aprobación no autoriza la implementación de ningún dominio funcional.

## Verificación de release

- `npm run test:foundation`: 8 pruebas superadas.
- `npm run lint`: superado.
- `npm run build`: superado.

## Integración en la base estable

La Foundation y los Engineering Standards fueron integrados en `main` tras la aprobación de esta release mediante los commits de merge `f487443` y `cd99b15`. `main` queda preparada para recibir el primer dominio funcional, pero permanece sin dominios funcionales nuevos, sin despliegue y sin activación de infraestructura adicional.

## No implica

Esta Engineering Release no se ha desplegado y no constituye una Release pública. Su integración en `main` es una consolidación técnica interna y no modifica el entorno de producción.
