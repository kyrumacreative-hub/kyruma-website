# KYRUMA Platform v1.0 — LIVE

**Fecha de publicación:** 5 de agosto de 2026  
**Estado:** Producción activa en `https://www.kyruma.com`

## Incluye

- KYRUMA Discovery™ con ocho conversaciones, progreso, guardado automático, resumen editable y envío.
- Marketing Foundation instalada y condicionada al consentimiento, pero inactiva hasta que se configuren las variables de entorno de los proveedores externos.
- Footer social y documentación de despliegue, eventos y analítica.

## Validación de release

- Lint, TypeScript y build de producción superados.
- `workspace-v2` fusionada mediante fast-forward en `main` y publicada en Vercel.
- `/workspace` comprobada en producción: bienvenida, ocho conversaciones y navegación disponibles.
- Sin errores de consola durante la comprobación.
- Sin identificadores de analítica configurados, no se cargan scripts de GTM, Meta Pixel ni Microsoft Clarity.

## Próximo paso

Enviar el Discovery al primer cliente y registrar el feedback real en `KYR-DISCOVERY-FEEDBACK-001`. La activación de analítica queda en el backlog de operaciones y puede realizarse posteriormente sin cambios de arquitectura.
