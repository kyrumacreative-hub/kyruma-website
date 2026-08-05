# RFC-007 — Intelligence Model and Data Policy

## Problema

El dominio procesará Discovery, que puede contener PII y datos estratégicos. No hay proveedor, región, DPA, política de retención ni lista de modelos aprobados.

## Decisión requerida

- Proveedor(es), modelo(s), región y condiciones de tratamiento de datos.
- Clasificación, minimización y política de redacción de snapshots.
- Retención, exportación, archivo y eliminación legalmente aprobadas.
- Política de prompts, acceso a plantillas y prohibición de entrenamiento no autorizado.

## Decisión aprobada

`IntelligenceModelGateway` será provider‑agnostic. Ningún SDK ni proveedor se incorporará a Domain o Application. La activación de un adaptador requerirá una configuración operativa aprobada que declare proveedor, modelo, región, DPA y versión de política.

Antes de llamar al gateway, `IntelligencePolicyGuard` aplicará minimización y redacción: nombres, apellidos, emails y teléfonos no se incluirán en el snapshot enviado al modelo. El contenido clasificado como restringido se deniega hasta una autorización posterior específica. El snapshot conserva hash, clasificación y referencias; no se reutiliza como material de entrenamiento ni se comparte fuera del adaptador aprobado.

Los prompts son plantillas aprobadas y versionadas. Cada ejecución conserva solo `modelReference`, `promptTemplateVersion`, `policyVersion`, `modelRunId` y correlation ID necesarios para trazabilidad. Retención, archivo, exportación y eliminación siguen la política general de KYRUMA: archivar antes que eliminar y aplicar los plazos legales cuando estén formalizados.

## Impacto

La selección concreta de proveedor queda fuera de Engineering inicial. El primer adaptador no podrá activarse sin DPA, región compatible y pruebas de redacción de PII.

## Estado

**APPROVED**
