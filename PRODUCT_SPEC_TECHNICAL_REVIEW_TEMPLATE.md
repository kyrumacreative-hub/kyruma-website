# KYRUMA OS™ — Product Specification Technical Review

> **Uso:** copiar este documento como `TECHNICAL_REVIEW_<DOMAIN>.md` al recibir una Product Specification. Este documento evalúa; no autoriza ni implementa cambios por sí mismo.

| Campo | Valor |
| --- | --- |
| Product Specification | `PS-XXX — <Domain> vX.Y` |
| Dominio | `<Domain>` |
| Revisor técnico | `<name>` |
| Fecha | `YYYY-MM-DD` |
| Versión de la review | `v0.1` |
| Decisión | `Approved` / `Approved with Conditions` / `Rejected` |

## 1. Resumen ejecutivo

- **Viabilidad técnica:** `<alta / media / baja + motivo>`
- **Riesgo global:** `<alto / medio / bajo + motivo>`
- **Recomendación:** `<decisión y condiciones, si existen>`
- **Alcance evaluado:** `<resumen breve de la especificación>`

## 2. Revisión de arquitectura

| Área | Comprobación | Resultado | Evidencia / acción necesaria |
| --- | --- | --- | --- |
| Foundation | Respeta límites congelados y no exige cambios implícitos. | `<OK / riesgo / bloqueo>` | `<detalle>` |
| Context | Recibe `ResolvedPartnerContext` cuando el dominio tiene ámbito. | `<OK / riesgo / bloqueo>` | `<detalle>` |
| Capabilities | Declara Capability, Membership y visibilidad por caso de uso. | `<OK / riesgo / bloqueo>` | `<detalle>` |
| Domain Events | Define hechos confirmados, versión, actor, ámbito y consumidores. | `<OK / riesgo / bloqueo>` | `<detalle>` |
| Dependencias | Evita proveedores y librerías no justificadas. | `<OK / riesgo / bloqueo>` | `<detalle>` |

Indicar si el dominio exige un RFC técnico. Si una modificación afecta a Foundation, la decisión debe ser **Rejected** o **Approved with Conditions** hasta que el RFC se apruebe; Foundation no se modifica como parte de esta review.

## 3. Revisión del dominio

- **Responsabilidad única:** `<qué es dueño de resolver el dominio>`
- **Límites:** `<qué no pertenece al dominio>`
- **Dependencias entrantes/salientes:** `<dominios, contratos o eventos>`
- **Riesgo de acoplamiento:** `<bajo / medio / alto + mitigación>`
- **Propietario de cada dato y transición:** `<detalle>`

## 4. Revisión de datos

| Tema | Validación | Resultado / condición |
| --- | --- | --- |
| Integridad | Identificadores, ownership, invariantes y concurrencia. | `<detalle>` |
| Persistencia | Repository Port, necesidad de PostgreSQL y migraciones futuras. | `<detalle>` |
| Versionado | Versiones de entidad, esquemas y eventos cuando aplique. | `<detalle>` |
| Auditoría | Hechos de seguridad/operación que requieren Audit. | `<detalle>` |
| Retención | Archivado, exportación, eliminación y dependencias legales. | `<detalle>` |

## 5. Revisión de seguridad

- **Permisos:** `<matriz por caso de uso y Capability>`
- **Visibilidad:** `<internal / shared / partner_private / public_link, si aplica>`
- **Aislamiento de contexto:** `<Partner, Workspace y Organization>`
- **Datos sensibles y amenazas:** `<riesgos y mitigaciones>`
- **Decisión de seguridad:** `<apto / condiciones / bloqueo>`

## 6. Revisión de UX técnica

Identificar incoherencias técnicas que podrían afectar la experiencia: estados de carga, operaciones asíncronas, errores recuperables, consistencia tras cambio de contexto, accesibilidad, comportamiento móvil, datos desactualizados y rollback perceptible para la persona usuaria.

| Hallazgo | Impacto UX | Recomendación | Prioridad |
| --- | --- | --- | --- |
| `<hallazgo>` | `<detalle>` | `<acción>` | `<alta / media / baja>` |

## 7. Riesgos

| Nivel | Riesgo | Impacto | Mitigación | Bloquea implementación |
| --- | --- | --- | --- | --- |
| Alto | `<riesgo>` | `<detalle>` | `<acción>` | `<sí / no>` |
| Medio | `<riesgo>` | `<detalle>` | `<acción>` | `<sí / no>` |
| Bajo | `<riesgo>` | `<detalle>` | `<acción>` | `<sí / no>` |

## 8. Preguntas abiertas para Product

1. `<pregunta que afecte reglas, estados, permisos, datos o alcance>`
2. `<pregunta>`

Una pregunta que cambie la decisión, la seguridad, el modelo de datos o los criterios de aceptación bloquea la implementación hasta su respuesta versionada en el Product Book.

## 9. Decisión

### Approved

La especificación está completa, es compatible con Foundation y puede pasar a planificación técnica.

### Approved with Conditions

Puede planificarse o iniciarse únicamente tras cumplir las condiciones numeradas siguientes:

1. `<condición verificable>`

### Rejected

No puede iniciar implementación. Indicar contradicción, riesgo o ausencia que Product debe resolver:

`<motivo y próximo paso>`

## Trazabilidad

- Product Specification: `<enlace o referencia>`
- RFC técnico, si aplica: `<enlace o N/A>`
- Checklist de implementación: `PRODUCT_IMPLEMENTATION_CHECKLIST.md`
- Estimación: `ENGINEERING_ESTIMATION_MODEL.md`
