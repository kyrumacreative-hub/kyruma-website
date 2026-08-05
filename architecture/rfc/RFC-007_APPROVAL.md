# RFC-007 Approval

## Estado

**APPROVED**

## Decisiones aprobadas

- Gateway provider‑agnostic.
- Redacción de PII antes de cualquier llamada al modelo.
- Snapshots minimizados, clasificados y versionados.
- Prompt, modelo y política referenciados por versión.
- Sin uso para entrenamiento ni acciones autónomas.

## Decisiones pendientes

La selección operacional de proveedor, modelo, región y DPA se realiza antes de activar un adaptador externo.

## Impacto

- Foundation: ninguno.
- Product: se mantienen revisión humana y no automatización.
- Engineering: puede implementar contratos y pruebas sin SDK externo.

## Riesgos

No se permite activar un gateway sin los controles operativos definidos.

## Acción requerida

Seleccionar y aprobar proveedor antes de activar integración externa.
