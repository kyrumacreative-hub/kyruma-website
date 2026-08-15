# KYRUMA Platform v1.0 — Technical Production Candidate

**Fecha de publicación:** 5 de agosto de 2026  
**Estado:** Producción activa en `https://www.kyruma.com`

## Incluye

- KYRUMA Discovery™ con ocho conversaciones, progreso, guardado automático, resumen editable y envío.
- Marketing Foundation condicionada al consentimiento. GTM, GA4, Meta Pixel y Meta CAPI están activos; Clarity permanece inactivo hasta completar su gate externo.
- Footer social y documentación de despliegue, eventos y analítica.

## Validación de release

- Lint, TypeScript y build de producción superados.
- `workspace-v2` fusionada mediante fast-forward en `main` y publicada en Vercel.
- `/workspace` comprobada en producción: bienvenida, ocho conversaciones y navegación disponibles.
- Sin errores de consola durante la comprobación.
- El rechazo bloquea todos los scripts de marketing y la aceptación carga GTM/GA4/Meta Pixel sin errores.
- El consentimiento puede retirarse o modificarse desde `/cookies`.

## Gates para `v1.0.0`

Completar Clarity y el tramo comercial TEST de KYR-002. El contrato revisado jurídicamente sigue siendo obligatorio antes del primer cliente real. Véase `KYRUMA_PLATFORM_V1_FINAL_READINESS_REPORT.md`.
