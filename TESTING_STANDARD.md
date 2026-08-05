# KYRUMA OS™ — Testing Standard

## Principio

Las pruebas validan contratos y decisiones de negocio, no detalles accidentales de implementación. Cada nuevo dominio debe añadir pruebas proporcionales a su riesgo antes de poder activarse.

## Pirámide de pruebas

| Nivel | Qué valida | Obligatorio al crear un dominio |
| --- | --- | --- |
| Unitarias de dominio | reglas puras, estados, validaciones y errores | Sí |
| Aplicación | orquestación, capacidades, contexto, puertos y eventos | Sí |
| Contrato de puertos | adaptadores y contratos contra infraestructura | Al introducir el adaptador |
| Integración | proveedor de identidad, PostgreSQL, sesiones o colas | Al introducir cada dependencia |
| E2E | ruta/flujo de usuario aprobado | Al introducir UI o una API pública |

La Foundation usa el runner nativo de Node y `tsconfig.foundation-tests.json`. No se introduce un nuevo framework de pruebas ni una dependencia de cobertura en esta preparación. Cuando exista un primer dominio aprobado, su RFC definirá la incorporación mínima al comando de pruebas correspondiente.

## Casos mínimos por dominio

- Acción permitida con Capability, Membership, ámbito y visibilidad correctos.
- Denegación por Capability ausente, Membership revocada, Partner equivocado y Workspace no autorizado.
- Transiciones válidas e inválidas del ciclo de vida.
- Validación de entradas y errores seguros.
- Persistencia solicitada a través del Repository Port correcto.
- Evento emitido solo tras una operación confirmada.
- Audit y Timeline solicitados solo cuando la especificación lo exige.
- Cambio de contexto no reutiliza datos o permisos del Partner anterior.

## Fixtures y aislamiento

- Usar IDs y nombres sintéticos; no incluir datos de clientes, correos ni tokens reales.
- Crear fixtures explícitos para User, Membership, Organization, Partner, Workspace y visibilidad.
- No depender del orden de ejecución, tiempo de red ni estado global mutable.
- Probar la frontera pública del módulo; no convertir detalles privados en API solo para testearlos.

## Criterio de calidad

No se exige un porcentaje global artificial. La cobertura debe demostrar las decisiones de riesgo: autorización, aislamiento de contexto, transiciones, auditoría y errores. Cualquier zona no cubierta debe quedar documentada con motivo, impacto y prueba prevista antes de activar el dominio.
