# Technical Review — EP-004.1 Lead Creation

| Campo | Valor |
| --- | --- |
| Product Specification | [PS-004 — Lead Lifecycle™](product/specifications/PS-004-Lead-Lifecycle.md), EP-004.1 |
| Revisión | v1.0 |
| Fecha | 2026-08-05 |
| Decisión | **APPROVED WITH CONDITIONS** |

## 1. Resumen ejecutivo

EP-004.1 define de forma suficiente la intención del dominio, el Aggregate Root (`Lead`), el flujo de creación, reglas, estados iniciales, eventos, actores, relaciones, casos límite y criterios de aceptación. Es técnicamente viable sin alterar su intención funcional.

No obstante, no puede comenzar implementación hasta resolver cuatro condiciones arquitectónicas: contexto para entidades pre-Partner, Capability específica de Lead, persistencia/Audit/Timeline aprobados y contratos de datos/operación de los canales de entrada. Estas condiciones existen porque Foundation está congelada y sus propios documentos las identifican como gates para el primer dominio.

- **Viabilidad técnica:** alta, una vez satisfechas las condiciones.
- **Riesgo global:** medio-alto mientras estas dependencias sigan abiertas.
- **Recomendación:** aprobar EP-004.1 de forma condicionada; abrir los RFC y decisiones indicados antes de planificar código.

## 2. Revisión de arquitectura

| Área | Resultado | Evidencia / condición |
| --- | --- | --- |
| Foundation | Condicional | La Foundation está congelada. `FOUNDATION_READINESS_REPORT.md` exige identidad real, persistencia PostgreSQL, política de datos y RFC/matriz de permisos antes de implementar un dominio. |
| Context | Bloqueante condicionado | `ResolvedPartnerContext` requiere Partner y Workspace; EP-004.1 crea un Lead antes de que exista Partner. Se requiere RFC para un contexto autorizado pre-Partner/Organization o una decisión equivalente aprobada. |
| Identity | Condicional | Foundation resuelve identidad mediante Memberships. Debe definirse cómo se valida que el `ownerId` pertenece a un usuario interno elegible en el ámbito pre-Partner. |
| Capabilities | Bloqueante condicionado | El catálogo actual no contiene `lead.create` ni una Capability equivalente. `partner.create` no cumple la especificación: Strategist no la posee y Lead no es Partner. Requiere RFC/adición aprobada al catálogo. |
| Domain boundaries | Compatible con condiciones | `Lead` como Aggregate Root respeta el patrón. Organization, Contact, Ownership, Discovery Submission y Qualification Decision requieren contratos separados y no acceso directo de otros dominios. |
| Domain Events | Condicional | `LeadCreated` es un hecho de dominio adecuado. `TimelineInitialized` y `AuditInitialized` deben conservarse según Product, pero su clasificación y entrega deben respetar la separación aprobada entre Domain Event, Timeline y Audit. |

No se autoriza modificar Foundation dentro de EP-004.1. Cualquier ajuste requerido debe ser un RFC técnico independiente y aprobado.

## 3. Modelo de dominio e integridad

### Consistencias confirmadas

- Lead es el Aggregate Root y concentra las modificaciones relevantes.
- La relación Lead → Organization, Contact principal y Owner principal es explícita.
- La unicidad de Lead activo por Organization está declarada en BR-002, INV-009, EC-006 y AC-007.
- Timeline y Audit desde la creación aparecen como invariantes, reglas, flujo y Acceptance Criteria.

### Condiciones técnicas

| Elemento | Observación técnica | Condición |
| --- | --- | --- |
| Organization | EP-004.1 permite reutilizar o crear. Falta contrato de identidad/canonicalización para aplicar detección de duplicados de forma consistente. | Product debe definir qué datos hacen válida/igual una Organization y cómo se resuelve la confirmación en API e importación. |
| Contact | Se exige un Contact principal pero no se definen atributos, identidad, visibilidad ni retención. | Product debe completar el contrato mínimo y tratamiento de PII antes de persistir. |
| Owner | Se define como usuario interno, mientras Foundation autoriza mediante Membership. | Aclarar si `ownerId` identifica User o Membership y qué ocurre si la Membership deja de estar activa. |
| Lead activo | La especificación prohíbe duplicados activos pero no clasifica `On Hold` para esa regla. | Product debe declarar si `On Hold` se considera activo a efectos de BR-002/INV-009. |
| Historial | INV-006 exige no eliminar historial. | Definir políticas de archivado, exportación y plazos legales antes de guardar datos reales. |

## 4. UC-001 — Lead Creation

El flujo principal es completo a nivel funcional: resolver/crear Organization, registrar Contact, asignar Owner, registrar Origin, crear Lead, inicializar Timeline/Audit/estado/fecha, emitir eventos y dejar preparado Discovery.

### Transacción y rollback

BR-011 y EC-004 exigen rollback completo. La unidad atómica debe incluir, como mínimo, la creación/reutilización vinculada, Lead, estado inicial, Timeline inicial, Audit inicial y los hechos que solo pueden declararse tras confirmar la operación. La infraestructura de persistencia y el patrón de entrega de eventos no están implementados; definirlos es una condición de entrada, no una decisión a tomar durante código.

### Concurrencia

EC-006 identifica correctamente dos solicitudes simultáneas. La especificación exige unicidad, pero no define el contrato de respuesta para la solicitud perdedora ni el comportamiento de reintentos de canales API/importación. Product debe precisarlo para que Acceptance Criteria y pruebas sean deterministas.

### Ramas alternativas no cerradas

- Duplicado potencial: EC-005 solicita confirmación, pero el flujo no establece quién confirma ni el comportamiento de un canal no interactivo.
- Organization archivada/histórica: solo se especifica que un Lead archivado permite uno nuevo; no se establece el comportamiento si la Organization o Contact no son utilizables.
- Owner inexistente: EC-003 bloquea correctamente; falta resultado cuando el Owner existe pero no tiene Membership activa o está fuera de ámbito.

## 5. Eventos, Audit y Timeline

| Evento | Evaluación | Observación |
| --- | --- | --- |
| EV-001 `LeadCreated` | Adecuado | Debe versionarse y emitirse solo después de confirmar BR-011. Falta declarar payload mínimo, actor, ámbito y consumidores. |
| EV-002 `TimelineInitialized` | Condicional | Product lo requiere. Arquitectura define Timeline como proyección separada, no sustituto de un Domain Event. Debe definirse si representa hecho de dominio o registro/proyección inicial. |
| EV-003 `AuditInitialized` | Condicional | Product lo requiere. Audit es un registro técnico/de seguridad independiente. Debe definirse su contrato sin exponer datos sensibles ni confundirlo con evento de negocio. |

No falta un evento funcional evidente para el alcance de creación. Sí falta el contrato técnico mínimo de los tres y la garantía de entrega/idempotencia antes de introducir consumidores críticos.

## 6. Permisos y visibilidad

Product define correctamente los actores permitidos y denegados. Foundation implementa Roles como agrupación de Capabilities y exige Membership activa scoped.

| Requisito Product | Estado técnico |
| --- | --- |
| Super Admin puede crear | Implementable tras definir Capability Lead. |
| Admin puede crear | Implementable tras definir Capability Lead. |
| Strategist puede crear | Implementable tras definir Capability Lead. |
| Designer, Developer, Viewer y Partner no crean | Implementable mediante Capability ausente. |
| Consulta según contexto | No verificable hasta definir contexto pre-Partner y visibilidad de Lead/Contact. |

Condición: RFC de Capability y matriz de permisos que declare `lead.create`, lectura asociada y el ámbito/visibilidad aplicables. No se deben usar Capabilities de Partner como sustituto.

## 7. Datos, seguridad y UX técnica

### Datos y seguridad

- `Contact` puede contener datos personales; falta clasificación, base de retención, archivado, exportación y eliminación legalmente aprobada.
- `origin` es obligatorio e inmutable, pero falta catálogo/validación de valores y trazabilidad de canal para API/importación.
- Debe evitarse que la detección de Organization revele datos de otro ámbito a un actor no autorizado.
- Los IDs internos no deben exponerse como control de acceso; la autorización se hace con contexto y Membership.

### UX técnica

- EC-005 exige una confirmación ante posible duplicado: Product debe definir el resultado y mecanismo para que UI, API e importación tengan una semántica idéntica.
- EC-004 requiere rollback completo: la interfaz futura deberá reflejar un resultado único, sin presentar un Lead creado si la transacción falla.
- Los estados de carga/reintento y mensajes seguros deben derivar de errores tipados; no requieren diseñar UI en esta épica.

## 8. Traceability Review

| Artefacto | Evidencia en PS-004 | Estado | Ausencia o condición |
| --- | --- | --- | --- |
| Business Rules | BR-001 a BR-012 | Completo | Clasificación de `On Hold` para unicidad sigue abierta. |
| User Case | User Story + 5.6 Main Flow | Condicional | Se denomina User Story/Main Flow, no UC-001; faltan salidas de error/reintento deterministas. |
| State Machine | 5.10 | Condicional | Estado inicial y transiciones definidos; falta semántica de `On Hold` para Lead activo. |
| Domain Events | EV-001 a EV-003 | Condicional | Faltan contrato, payload, versión, actor, ámbito, consumidores e idempotencia. |
| Permissions | 5.8 | Condicional | Faltan Capability, Membership scope, visibilidad y lectura. |
| Data Model | 5.11 y 5.12 | Condicional | Faltan contratos de Organization, Contact y Owner. |
| Edge Cases | EC-001 a EC-006 | Condicional | Faltan canal no interactivo, reintentos y Owner con Membership inválida. |
| Acceptance Criteria | AC-001 a AC-012 | Condicional | AC-009 depende de contratos de evento; AC-010 de Audit/Timeline persistentes. |

## 9. Riesgos técnicos

| Nivel | Riesgo | Impacto | Mitigación | Bloquea implementación |
| --- | --- | --- | --- | --- |
| Alto | Contexto actual exige Partner/Workspace antes de que exista Partner. | Acceso no autorizado o arquitectura paralela. | RFC de contexto pre-Partner/Organization. | Sí |
| Alto | No existe Capability de Lead. | Permisos Product no implementables de forma correcta. | RFC de Capability/matriz de permisos. | Sí |
| Alto | Sin persistencia, Audit y Timeline reales. | BR-008/009/011 y AC-004/005/010/011 no verificables. | RFC de datos, transacción y contratos de Audit/Timeline. | Sí |
| Alto | Política PII de Contact pendiente. | Riesgo legal y de seguridad. | Decisión legal de clasificación/retención antes de datos reales. | Sí |
| Medio | Identidad/alcance de Organization, Contact y Owner incompletos. | Integridad, duplicados y ownership inconsistentes. | Completar Product Specification. | Sí |
| Medio | Eventos sin contrato técnico. | Duplicidad o pérdida de trazabilidad. | Definir versión, payload, consumidores e idempotencia. | Sí |
| Medio | Canales no interactivos sin decisión de duplicado/reintento. | Resultados divergentes por canal. | Completar Edge Cases. | Sí |
| Bajo | Estados UX de error/rollback no especificados. | Experiencia inconsistente futura. | Completar al diseñar la interfaz aprobada. | No |

## 10. Recomendaciones y condiciones de aprobación

1. Aprobar un RFC de contexto pre-Partner/Organization; no reutilizar `ResolvedPartnerContext` para un Lead sin Partner.
2. Aprobar una Capability específica de Lead y su matriz de Membership/visibilidad. Este cambio no pertenece a la implementación de EP-004.1.
3. Resolver el RFC de datos e infraestructura: PostgreSQL/proveedor, transacción, Repository Ports y contratos de Audit/Timeline.
4. Incorporar la política legal de datos de Contact antes de almacenar PII.
5. Product debe completar los huecos enumerados en las secciones de modelo, concurrencia, canales no interactivos, estados activos y contratos de eventos.
6. Reabrir esta review tras cerrar las condiciones y completar `PRODUCT_IMPLEMENTATION_CHECKLIST.md`.

Estas recomendaciones no añaden funcionalidades ni cambian reglas de Product; definen las condiciones necesarias para aplicarlas de forma compatible con Foundation.

## 11. Implementation Preview — sin código

Una vez las condiciones estén cerradas, el orden técnico recomendado será:

1. RFC aprobados y checklist `READY`.
2. Contratos de contexto/capacidades y puertos transversales aprobados.
3. Reglas puras de Lead, estado inicial, validación e invariantes.
4. Repository Ports y modelo de persistencia transaccional.
5. Caso de uso de creación, autorización, rollback y eventos confirmados.
6. Adaptadores aprobados de persistencia/Audit/Timeline.
7. Pruebas unitarias, de aplicación, concurrencia, permisos y aislamiento de contexto.
8. Interfaz solo si una especificación posterior la autoriza; no forma parte de esta review.

## 12. Decisión final — APPROVED WITH CONDITIONS

**APPROVED WITH CONDITIONS.**

EP-004.1 es técnicamente coherente en su objetivo y no contradice la arquitectura a nivel de dominio. Sin embargo, no está lista para comenzar implementación hasta satisfacer las seis condiciones de la sección 10 y los riesgos bloqueantes. Ninguna de esas condiciones se resuelve mediante código funcional dentro de la épica ni autoriza modificar Foundation sin RFC aprobado.
