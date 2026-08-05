# RFC-007 — Intelligence Model and Data Policy

## Problema

El dominio procesará Discovery, que puede contener PII y datos estratégicos. No hay proveedor, región, DPA, política de retención ni lista de modelos aprobados.

## Decisión requerida

- Proveedor(es), modelo(s), región y condiciones de tratamiento de datos.
- Clasificación, minimización y política de redacción de snapshots.
- Retención, exportación, archivo y eliminación legalmente aprobadas.
- Política de prompts, acceso a plantillas y prohibición de entrenamiento no autorizado.

## Recomendación

No enviar PII ni contenido clasificado como restringido a ningún gateway hasta aprobar política legal y de seguridad. Mantener modelo y prompt como referencias versionadas, no valores libres en solicitudes.

## Estado

**Pending Product, Legal and Security Approval**
