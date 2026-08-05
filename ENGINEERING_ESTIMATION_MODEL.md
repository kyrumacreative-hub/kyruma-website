# KYRUMA OS™ — Engineering Estimation Model

## Propósito

Este modelo estandariza la planificación de dominios aprobados. No estima PS-004 ni ningún otro dominio mientras no exista una Product Specification lista para implementación.

## Unidades y supuestos

- Estimar en **engineering days** por bloque, con rango optimista/probable/pesimista cuando la incertidumbre sea relevante.
- Separar esfuerzo de implementación, pruebas, revisión y documentación; no ocultar tareas transversales dentro de frontend o backend.
- Declarar dependencias, riesgos, supuestos y trabajo excluido antes de sumar el total.
- El resultado es una previsión para priorización, no un compromiso contractual.

## Desglose obligatorio

| Bloque | Qué incluye | Estimación | Dependencias / riesgos |
| --- | --- | --- | --- |
| Dominio | tipos, reglas puras, estados, validaciones y errores. | `<O / P / Pe>` | `<detalle>` |
| Persistencia | Repository Ports, adaptadores aprobados, migraciones y datos existentes. | `<O / P / Pe>` | `<detalle>` |
| Eventos | contratos, versión, idempotencia, entrega y consumidores aprobados. | `<O / P / Pe>` | `<detalle>` |
| Permisos | Capabilities, Context Guard, visibilidad y pruebas de aislamiento. | `<O / P / Pe>` | `<detalle>` |
| Backend | fronteras de servidor, APIs/casos de uso, observabilidad y errores. | `<O / P / Pe>` | `<detalle>` |
| Frontend | UI aprobada, estados, accesibilidad y responsive. | `<O / P / Pe>` | `<detalle>` |
| QA | unitarias, integración, E2E aplicable, regresión y pruebas manuales. | `<O / P / Pe>` | `<detalle>` |
| Documentación | contratos, operación, checklist, release notes y trazabilidad. | `<O / P / Pe>` | `<detalle>` |

## Riesgo e incertidumbre

Clasificar cada factor como bajo, medio o alto:

- decisiones pendientes de Product;
- dependencia de proveedor o infraestructura;
- migración o compatibilidad con datos existentes;
- cambios de seguridad, permisos o visibilidad;
- consumo de eventos por otros dominios;
- incertidumbre de UX o volumen/rendimiento.

Un riesgo alto no se compensa añadiendo margen de forma opaca: se convierte en una condición, spike técnico o RFC antes de comprometer la estimación.

## Resultado de planificación

```text
Dominio: <nombre>
Readiness: READY / NOT READY
Estimación probable: <n> engineering days
Rango: <optimista> — <pesimista>
Supuestos: <lista>
Riesgos: <lista>
Orden de implementación propuesto: <lista>
Fuera de alcance: <lista>
```
