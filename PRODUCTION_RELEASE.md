# KYRUMA Website — Final Production Release

**Fecha de publicación:** 15 de agosto de 2026
**Estado:** Website final verificada en `https://www.kyruma.com`

## Cierre final

- Deployment Vercel `7PEkxS2qhoysf5A9J3v9w7ymj3s9`: READY sobre `main@84b9743`.
- Contacto oficial publicado: `hello@kyruma.com` y `614 189 346` (`tel:+34614189346`).
- Audit completo de npm: 0 vulnerabilidades.
- 152/152 pruebas, incluidas 30/30 PostgreSQL: PASS.
- Prisma, TypeScript, lint y build de producción: PASS.
- Regresión visual/funcional ES/EN y consentimiento rejected/accepted: PASS.
- Sin pasarelas de pago; cualquier validación comercial utiliza exclusivamente `TEST ONLY — BANK TRANSFER`.

## Incluye

- KYRUMA Discovery™ con ocho conversaciones, progreso, guardado automático, resumen editable y envío.
- Marketing Foundation condicionada al consentimiento. GTM, GA4, Meta Pixel, Meta CAPI y Microsoft Clarity están activos.
- Footer social y documentación de despliegue, eventos y analítica.

## Validación de release

- Lint, TypeScript y build de producción superados.
- `workspace-v2` fusionada mediante fast-forward en `main` y publicada en Vercel.
- `/workspace` comprobada en producción: bienvenida, ocho conversaciones y navegación disponibles.
- Sin errores de consola durante la comprobación.
- El rechazo bloquea todos los scripts de marketing y la aceptación carga GTM/GA4/Meta Pixel/Clarity sin errores.
- El consentimiento puede retirarse o modificarse desde `/cookies`.

## Gates operativos externos

Los artefactos comerciales externos del dry run KYR-002 no están disponibles en el repositorio. El contrato revisado jurídicamente sigue siendo obligatorio antes del primer cliente real. Ninguno de estos puntos bloquea el cierre técnico de Website.
