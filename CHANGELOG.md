# Changelog

## [Unreleased] — PS-008 Audit™

Engineering complete and ready for merge. Adds immutable versioned Audit evidence, PostgreSQL append-only protection, privacy overlays, retention/export evidence, authorized application services and shared-transaction integrations. Validated by GitHub Actions run `31883790132`. No release number or tag was inferred; `v0.4.0` remains unchanged and production remains undeployed.

## [0.4.0] — 2026-08-14

**PS-009 Event Bus™ v1.0 — Engineering Complete.** Added versioned immutable envelopes, PostgreSQL Transactional Outbox, internal dispatcher, at-least-once isolated delivery, idempotent processing, progressive retries, recoverable dead letters and transport contracts for a future external broker. Integrated in `main@1d76a7f`, tagged `v0.4.0` and validated by successful CI at `175bae7` and `6c6491b`. Earlier failed runs were intermediate and are superseded. No production deployment.

## [0.3.0] — 2026-08-05

**PS-006 Partner Creation™ v1.0 — Engineering Complete.** Added the Partner domain, atomic PostgreSQL conversion persistence, concurrency-safe KYR identifier allocation, Organization-scoped application services and tests. API, UI, Event Bus and deployment remain excluded.

## [0.2.0] — 2026-08-05

**PS-005 Discovery Intelligence™ v1.0 — Engineering Complete.** Added immutable snapshots, human-reviewed analysis lifecycle, PostgreSQL persistence, Foundation capabilities and application coordination. API, UI, Event Bus and autonomous actions remain excluded.

Todas las modificaciones relevantes de KYRUMA OS™ se registran aquí por Engineering Release. Una release de ingeniería no implica despliegue, publicación pública ni fusión con `main`.

El formato sigue una adaptación de Keep a Changelog y usa versionado semántico mientras el producto se encuentra en fase pre-1.0.

## [0.1.0] — 2026-08-05

**Resumen:** primera Engineering Release interna de KYRUMA OS™. Cierra la Foundation aprobada como referencia estable y reutilizable antes de cualquier dominio funcional.

### Added

- Arquitectura técnica de KYRUMA OS™: límites de plataforma, modelo de dominio, routing, datos, eventos, seguridad, riesgos y roadmap.
- Foundation Phase 1: identidad desacoplada de proveedor, Capabilities + Memberships y autorización de servidor.
- Foundation Phase 2: Partner Context, Workspace Context, Membership Resolver, Context Guard, switching y eventos base.
- Documentación de decisiones empresariales, revisión de arquitectura y readiness de Foundation.
- Suite de pruebas de Foundation para autorización, aislamiento de contexto y switching.

### Changed

- Se consolida el patrón de futuros módulos: reciben `ResolvedPartnerContext`, verifican Capability y visibilidad, y no resuelven contexto por su cuenta.

### Fixed

- No aplica: esta release no introduce correcciones funcionales sobre dominios de negocio.

### Documentation

- Technical Foundation, Architecture Review, Business Decision Alignment, Identity & Permissions, Partner Context y Foundation Readiness.
- Changelog, notas de release e historial de versiones para trazabilidad de hitos internos.

### Integration

- Foundation y Engineering Standards integrados en `main` como nueva base estable para el primer dominio funcional.
- La integración no implica despliegue ni activación de módulos funcionales.

### Excluded

- Lead Lifecycle, Discovery persistente, Strategy, Projects, Documents, Meetings, Client Portal, Intelligence y automatizaciones.
- Proveedor real de identidad, PostgreSQL/infraestructura, login, rutas `/os`, UI interna, Timeline y Audit persistentes.
