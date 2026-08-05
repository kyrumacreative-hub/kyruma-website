# PS-004 — Lead Lifecycle™

## 1. Metadata

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | Draft |
| Owner | Product |
| Engineering | Pending Technical Review |

## 2. Executive Summary

### 1.1 Purpose

Lead Lifecycle™ es el dominio de KYRUMA OS™ responsable de gestionar la evolución de una Organization desde su primer contacto con KYRUMA hasta su conversión en un Partner.

Su responsabilidad consiste en recopilar el contexto necesario, registrar todas las decisiones relevantes y garantizar que la creación de un Partner sea un proceso consciente, consistente y completamente trazable.

Lead Lifecycle™ no es un CRM tradicional.

No existe para maximizar conversiones comerciales.

No existe para gestionar oportunidades de venta.

Existe para ayudar a KYRUMA a decidir si una Organization reúne las condiciones necesarias para iniciar una Creative Partnership.

### 1.2 Mission

Transformar incertidumbre en conocimiento suficiente para decidir si una Organization debe convertirse en Partner de KYRUMA.

### 1.3 Business Objective

Lead Lifecycle™ garantiza que toda Organization siga un proceso único antes de convertirse en Partner.

El dominio debe asegurar que:

- toda Organization dispone de contexto suficiente antes de ser evaluada;
- todas las decisiones importantes quedan registradas;
- ninguna información relevante se pierde durante el proceso;
- la creación de Partners es consistente;
- todas las transiciones son auditables.

### 1.4 Domain Responsibilities

Lead Lifecycle™ es el único dominio responsable de:

- crear Leads;
- gestionar su ciclo de vida;
- mantener Ownership;
- coordinar Discovery™;
- ejecutar Qualification;
- aprobar la creación de un Partner;
- conservar el historial completo del proceso.

### 1.5 Out of Scope

Lead Lifecycle™ no gestiona:

- Projects™
- Deliverables™
- Strategy™
- Client Portal™
- Intelligence™
- Knowledge™
- Facturación
- Contratos
- Gestión documental
- Ejecución de proyectos

Estos dominios comienzan únicamente después de la creación del Partner.

### 1.6 Success Criteria

Lead Lifecycle™ se considerará correctamente implementado cuando:

- cualquier usuario autorizado pueda comprender el estado real de una Organization;
- todas las decisiones sean completamente trazables;
- no existan Leads inconsistentes;
- ningún Partner pueda crearse sin recorrer el proceso definido;
- todo el conocimiento permanezca disponible durante el resto del Journey.

### 1.7 Domain Boundary

Lead Lifecycle™ comienza cuando una Organization entra por primera vez en contacto con KYRUMA mediante cualquiera de los canales autorizados.

El dominio finaliza inmediatamente después de:

- crear un Partner;
- archivar definitivamente el Lead;
- mantener el Lead en espera hasta nueva revisión.

Una vez creado el Partner, la responsabilidad pasa al dominio de Onboarding™.

## 3. Business Context

### 2.1 Background

KYRUMA construye Creative Partnerships de largo plazo con organizaciones que consideran su marca una inversión estratégica.

A diferencia de un modelo comercial tradicional, el objetivo de KYRUMA no es aumentar el número de clientes, sino establecer relaciones de alta confianza con un número reducido de Partners cuidadosamente seleccionados.

Por este motivo, el proceso previo a la creación de un Partner constituye una parte crítica del modelo de negocio.

Lead Lifecycle™ nace para proporcionar un proceso único, consistente y completamente trazable que permita gestionar esa etapa de evaluación.

### 2.2 Business Problem

Los sistemas CRM tradicionales presentan limitaciones que no responden al modelo operativo de KYRUMA.

Habitualmente centran su funcionamiento en:

- oportunidades comerciales;
- etapas de venta;
- previsiones de ingresos;
- actividad comercial.

Este enfoque resulta insuficiente para una organización cuyo principal activo es el conocimiento acumulado sobre cada Organization.

Sin un dominio específico aparecen problemas como:

- pérdida de contexto;
- duplicidad de información;
- decisiones difíciles de justificar;
- dependencia del conocimiento individual;
- baja trazabilidad.

Lead Lifecycle™ existe para eliminar estas limitaciones.

### 2.3 Business Need

Antes de crear un Partner, KYRUMA debe disponer de información suficiente para responder con confianza a las siguientes preguntas:

#### ¿Quién es esta Organization?

Debe comprenderse:

- actividad;
- mercado;
- estructura;
- contexto;
- personas relevantes.

#### ¿Qué necesita?

Debe conocerse:

- objetivos;
- retos;
- prioridades;
- expectativas.

#### ¿Podemos aportar valor?

La decisión no debe depender únicamente de la posibilidad de vender un servicio.

Debe evaluarse si KYRUMA puede generar un impacto significativo para esa Organization.

#### ¿Queremos construir una Partnership?

La creación de un Partner constituye una decisión estratégica.

No todas las Organizations deben convertirse en Partners.

Lead Lifecycle™ debe proporcionar toda la información necesaria para tomar esta decisión con criterio.

### 2.4 Product Vision

Lead Lifecycle™ será el punto de entrada único de todas las futuras Partnerships de KYRUMA.

Toda Organization iniciará su Journey dentro de este dominio.

El conocimiento generado durante esta fase acompañará permanentemente al Partner durante el resto de su ciclo de vida dentro de KYRUMA OS™.

La información nunca deberá duplicarse, perderse ni reconstruirse.

### 2.5 Business Value

La implantación de Lead Lifecycle™ permitirá:

- mejorar la calidad de las decisiones;
- reducir incertidumbre;
- conservar el conocimiento desde el primer contacto;
- mantener una trazabilidad completa;
- facilitar la colaboración entre miembros del equipo;
- proporcionar contexto a Discovery™, Strategy™, Projects™ y el resto de dominios.

### 2.6 Stakeholders

#### Internos

- Super Admin
- Admin
- Strategist

#### Externos

- Organization
- Contact
- Futuro Partner

### 2.7 Success Metrics

Lead Lifecycle™ habrá alcanzado sus objetivos cuando:

- todas las Organizations entren mediante un único proceso;
- ningún Lead pueda quedar incompleto;
- todas las decisiones relevantes sean trazables;
- ningún Partner pueda crearse sin completar el proceso definido;
- el conocimiento generado pueda reutilizarse íntegramente en los dominios posteriores.

Las métricas comerciales tradicionales (número de Leads, ratio de conversión o volumen de oportunidades) no constituyen indicadores principales del éxito de este dominio.

El éxito se medirá por la calidad, consistencia y trazabilidad del proceso.

### 2.8 Relationship with The KYRUMA Journey™

Lead Lifecycle™ implementa las primeras fases del Journey de KYRUMA:

- Connect
- Understand
- Qualify
- Commit

El dominio finaliza en el momento en que se crea un Partner.

A partir de ese instante la responsabilidad pasa al dominio de Onboarding™.

## 4. Scope

### 3.1 Purpose

Este capítulo define los límites funcionales de Lead Lifecycle™.

Su objetivo es establecer con precisión qué responsabilidades pertenecen a este dominio y cuáles corresponden al resto de KYRUMA OS™, evitando duplicidades, dependencias innecesarias y solapamientos entre dominios.

Lead Lifecycle™ será el único punto de entrada para la creación y evaluación de futuras Partnerships.

### 3.2 In Scope

Lead Lifecycle™ es responsable de las siguientes capacidades funcionales.

#### Lead Management

- Crear Leads.
- Actualizar información del Lead.
- Gestionar el ciclo de vida del Lead.
- Archivar Leads.
- Reactivar Leads archivados.

#### Organization Management

- Asociar un Lead a una Organization.
- Detectar posibles duplicados.
- Reutilizar Organizations existentes.
- Evitar Leads activos duplicados.

#### Contact Management

- Crear Contacts.
- Editar Contacts.
- Asociar múltiples Contacts a una Organization.
- Definir un Contact principal para cada Lead.

#### Ownership

- Asignar Owner.
- Reasignar Owner.
- Registrar histórico de Owners.
- Mantener responsabilidad única sobre cada Lead.

#### Discovery Integration

- Iniciar Discovery™.
- Asociar Discovery Submissions al Lead.
- Gestionar versiones de Discovery.
- Registrar el estado de Discovery.
- Determinar si el Lead dispone del conocimiento necesario para avanzar.

#### Qualification

- Ejecutar el proceso de evaluación.
- Registrar decisiones.
- Aplicar Decision Playbooks.
- Aprobar o rechazar la creación de un Partner.

#### Partner Creation

- Crear Partner.
- Generar identificador público KYR-XXX.
- Activar Workspace inicial.
- Transferir el contexto completo al siguiente dominio.

#### Timeline

- Registrar todos los eventos relevantes del Lead.
- Mostrar la evolución completa del proceso.

#### Audit

- Registrar todas las operaciones críticas.
- Mantener trazabilidad permanente.
- Permitir reconstruir cualquier decisión tomada.

### 3.3 Out of Scope

Las siguientes responsabilidades pertenecen a otros dominios y quedan explícitamente fuera del alcance de Lead Lifecycle™.

#### Projects™

- planificación;
- ejecución;
- seguimiento;
- gestión operativa.

#### Deliverables™

- entregables;
- revisiones;
- publicaciones;
- aprobaciones finales.

#### Strategy™

- definición estratégica;
- roadmap;
- decisiones posteriores al alta del Partner.

#### Knowledge™

- reutilización del conocimiento;
- patrones;
- aprendizaje organizativo.

#### Intelligence™

- recomendaciones mediante IA;
- automatizaciones;
- generación de Insights.

#### Client Portal™

- acceso del Partner;
- autenticación externa;
- experiencia del cliente.

#### Commercial Management

Lead Lifecycle™ no gestiona:

- presupuestos;
- contratos;
- facturación;
- forecasting;
- pipeline comercial;
- métricas de ventas.

### 3.4 Inputs

Lead Lifecycle™ podrá iniciarse únicamente mediante alguno de los siguientes canales autorizados:

- Discovery Form.
- Contact Form.
- Referencia.
- Creación manual.
- Importación autorizada.
- API aprobada.

Todos los canales deberán generar exactamente el mismo modelo de Lead.

### 3.5 Outputs

El dominio únicamente puede finalizar mediante uno de los siguientes resultados.

#### Partner Created

La Organization pasa al dominio de Onboarding™.

#### Archived

El proceso termina sin crear un Partner.

Toda la información permanece disponible.

#### On Hold

El Lead permanece dentro del dominio hasta una nueva evaluación.

No inicia ningún dominio posterior.

### 3.6 Domain Ownership

Lead Lifecycle™ es el único dominio autorizado para:

- crear Leads;
- modificar su estado;
- gestionar Ownership;
- iniciar Discovery™;
- registrar Qualification;
- aprobar la creación de un Partner;
- archivar o reactivar Leads.

Ningún otro dominio podrá modificar directamente estos elementos.

La comunicación entre dominios deberá realizarse mediante eventos de dominio y nunca mediante acceso directo a la lógica interna de Lead Lifecycle™.

### 3.7 Success Criteria

El alcance del dominio se considerará correctamente implementado cuando:

- toda Organization inicie su Journey mediante Lead Lifecycle™;
- ningún Partner pueda existir sin un Lead previo;
- ninguna responsabilidad definida en este capítulo sea implementada por otro dominio;
- todas las transiciones hacia dominios posteriores sean explícitas y trazables;
- el conocimiento generado durante esta fase pueda reutilizarse íntegramente sin pérdida de información.

## 5. Domain Definition

### 4.1 Domain Mission

Lead Lifecycle™ tiene como misión transformar el primer contacto entre una Organization y KYRUMA en una decisión informada sobre el inicio de una Creative Partnership.

Su responsabilidad consiste en reducir progresivamente la incertidumbre mediante la recopilación de contexto, la documentación de decisiones y la evaluación estructurada de la Organization.

El dominio no persigue cerrar ventas.

Persigue garantizar que toda decisión de crear un Partner esté basada en conocimiento suficiente, trazabilidad completa y criterios homogéneos.

### 4.2 Domain Responsibility

Lead Lifecycle™ es el único dominio responsable de gestionar la relación entre KYRUMA y una Organization antes de que exista un Partner.

Su responsabilidad comienza con la creación del Lead y finaliza cuando ocurre uno de los siguientes eventos:

- Se crea un Partner.
- El Lead se archiva.
- El Lead permanece en espera.

Una vez creado el Partner, toda responsabilidad pasa al siguiente dominio del Journey.

### 4.3 Aggregate Root

El Aggregate Root del dominio es:

**Lead**

Toda modificación relevante deberá producirse a través del Lead.

Ninguna entidad dependiente podrá modificar directamente su estado sin pasar por el Aggregate Root.

Esto garantiza:

- consistencia;
- integridad;
- cumplimiento de las reglas de negocio;
- trazabilidad.

### 4.4 Core Entities

#### Lead

Representa la evaluación activa de una posible Partnership entre KYRUMA y una Organization.

Es la entidad principal del dominio.

#### Organization

Representa la empresa u organización evaluada.

Puede disponer de múltiples Leads históricos.

Solo uno podrá permanecer activo simultáneamente.

#### Contact

Representa una persona perteneciente a una Organization.

Una Organization puede disponer de múltiples Contacts.

Cada Lead tendrá exactamente un Contact principal.

#### Owner

Representa al usuario interno responsable del Lead.

Cada Lead tendrá exactamente un Owner principal.

El cambio de Owner nunca eliminará el historial anterior.

#### Discovery Submission

Representa una versión concreta del proceso Discovery™.

Un Lead podrá disponer de múltiples versiones.

Las versiones anteriores nunca se eliminarán.

#### Qualification Decision

Representa la decisión formal tomada durante Qualification.

Cada decisión deberá permanecer registrada permanentemente.

### 4.5 Domain Invariants

Las siguientes reglas nunca podrán incumplirse.

#### INV-001

Todo Lead pertenece exactamente a una Organization.

#### INV-002

Todo Lead dispone exactamente de un Owner principal.

#### INV-003

Todo Lead dispone de Timeline desde su creación.

#### INV-004

Todo Lead dispone de Audit desde su creación.

#### INV-005

No puede existir un Partner sin un Lead previo.

#### INV-006

El historial nunca podrá eliminarse.

#### INV-007

Toda decisión relevante deberá quedar registrada.

#### INV-008

Solo un usuario autorizado podrá aprobar la creación de un Partner.

#### INV-009

No podrán existir dos Leads activos para la misma Organization.

#### INV-010

Toda transición de estado generará automáticamente Timeline y Audit.

### 4.6 Domain Boundaries

Lead Lifecycle™ puede interactuar con:

- Identity Foundation
- Partner Context
- Discovery™
- Timeline
- Audit

La interacción con otros dominios se realizará exclusivamente mediante eventos de dominio o interfaces públicas aprobadas.

Lead Lifecycle™ nunca modificará directamente:

- Projects™
- Deliverables™
- Strategy™
- Knowledge™
- Intelligence™
- Client Portal™

### 4.7 Domain Inputs

El dominio acepta como entradas:

- Discovery Form.
- Contact Form.
- Referencia.
- Creación manual.
- Importación autorizada.
- API aprobada.

Todos los canales deberán producir exactamente el mismo modelo funcional de Lead.

### 4.8 Domain Outputs

Lead Lifecycle™ únicamente genera los siguientes resultados:

- Lead creado.
- Discovery iniciada.
- Discovery completada.
- Qualification registrada.
- Partner creado.
- Lead archivado.
- Lead reactivado.

No genera:

- proyectos;
- tareas;
- entregables;
- documentos;
- facturación;
- accesos del Partner.

### 4.9 Ownership

Lead Lifecycle™ es propietario exclusivo de:

- Lead;
- Ownership;
- Qualification;
- Partner Creation;
- State Machine del Lead;
- Timeline del Lead;
- Audit del Lead.

Ningún otro dominio podrá alterar estos elementos.

### 4.10 Success Definition

Lead Lifecycle™ habrá cumplido correctamente su misión cuando una Organization pueda recorrer todo el proceso desde su identificación inicial hasta la creación del Partner sin pérdida de información, sin inconsistencias y con trazabilidad completa de todas las decisiones.

El éxito del dominio no se medirá por el número de Partners creados, sino por la calidad, consistencia y auditabilidad del proceso que conduce a esa decisión.

## 6. EP-004.1 — Lead Creation

### 5.1 Objective

Lead Creation define el proceso mediante el cual una Organization entra por primera vez en KYRUMA OS™ y se crea un Lead válido.

El objetivo de esta épica es garantizar que todos los Leads nazcan con un contexto mínimo consistente, completamente auditado y preparados para continuar su Journey mediante Discovery™.

La creación de un Lead no representa una decisión comercial.

Representa el inicio del proceso de evaluación de una posible Creative Partnership.

### 5.2 User Story

**Como** Strategist de KYRUMA,

**quiero** crear un Lead asociado a una Organization,

**para** comenzar un proceso estructurado de evaluación que determine si esa Organization debe convertirse en Partner.

### 5.3 Actors

Puede iniciar este proceso:

- Super Admin
- Admin
- Strategist

No pueden iniciar este proceso:

- Designer
- Developer
- Viewer
- Partner

### 5.4 Triggers

La creación de un Lead podrá iniciarse mediante cualquiera de los siguientes canales autorizados:

- Discovery Form.
- Contact Form.
- Referencia.
- Creación manual.
- Importación aprobada.
- API aprobada.

Todos los canales deberán producir exactamente el mismo resultado funcional.

### 5.5 Preconditions

Antes de crear un Lead deberán cumplirse las siguientes condiciones.

#### Organization

Debe existir una Organization válida.

Si no existe, deberá crearse durante el flujo.

#### Contact

Debe existir un Contact principal.

Si no existe, deberá crearse.

#### Owner

Debe existir exactamente un Owner.

No podrán crearse Leads sin responsable.

#### Origin

Debe registrarse el origen del Lead.

El origen será obligatorio e inmutable.

### 5.6 Main Flow

#### Paso 1

Se inicia una solicitud de creación de Lead.

#### Paso 2

El sistema busca una Organization existente.

Si existe:

→ reutilizar.

Si no existe:

→ crear.

#### Paso 3

Registrar o seleccionar Contact principal.

#### Paso 4

Asignar Owner.

#### Paso 5

Registrar origen.

#### Paso 6

Crear Lead.

#### Paso 7

Inicializar automáticamente:

- Timeline.
- Audit.
- Estado.
- Fecha de creación.

#### Paso 8

Emitir eventos de dominio.

#### Paso 9

El Lead queda disponible para iniciar Discovery™.

### 5.7 Business Rules

#### BR-001

Todo Lead pertenece exactamente a una Organization.

#### BR-002

No pueden existir dos Leads activos para una misma Organization.

#### BR-003

Todo Lead dispone exactamente de un Contact principal.

#### BR-004

Todo Lead dispone exactamente de un Owner principal.

#### BR-005

Todo Lead registra un origen.

#### BR-006

El origen nunca podrá modificarse.

#### BR-007

Todo Lead nace en estado **Identified**.

#### BR-008

La creación genera automáticamente Timeline.

#### BR-009

La creación genera automáticamente Audit.

#### BR-010

Todo Lead queda preparado para iniciar Discovery™.

#### BR-011

Toda creación debe ser transaccional.

Si cualquier operación falla, el sistema deberá cancelar completamente la creación.

#### BR-012

Toda creación genera un evento de dominio LeadCreated.

### 5.8 Permissions

Puede crear Leads:

- Super Admin
- Admin
- Strategist

Puede consultar:

- Usuarios con acceso al contexto correspondiente.

No pueden crear:

- Designer
- Developer
- Viewer
- Partner

### 5.9 Domain Events

#### EV-001

LeadCreated

Se produce cuando el Lead queda creado correctamente.

#### EV-002

TimelineInitialized

Se produce al crear el Timeline inicial.

#### EV-003

AuditInitialized

Se produce al crear el registro inicial de auditoría.

### 5.10 State Machine

Estado inicial:

**Identified**

Desde este estado únicamente podrán ejecutarse las siguientes transiciones:

- Discovery In Progress
- On Hold
- Archived

No podrá crearse un Partner directamente desde Identified.

### 5.11 Data Model

#### Lead

Campos obligatorios:

- id
- organizationId
- ownerId
- primaryContactId
- origin
- status
- createdAt
- createdBy

Campos opcionales:

- archivedAt
- archivedBy
- archiveReason

### 5.12 Entity Relationships

Organization

1

↓

N

Lead

---

Organization

1

↓

N

Contact

---

Lead

1

↓

1

Owner

---

Lead

1

↓

1

Timeline

---

Lead

1

↓

1

Audit

---

Lead

1

↓

N

Discovery Submission

---

Lead

1

↓

N

Qualification Decision

---

Lead

0..1

↓

1

Partner

### 5.13 Edge Cases

#### EC-001

La Organization ya existe.

Resultado:

Reutilizar.

#### EC-002

Existe un Lead archivado.

Resultado:

Permitir un nuevo Lead.

#### EC-003

No existe Owner.

Resultado:

Bloquear la creación.

#### EC-004

Fallo durante la creación.

Resultado:

Rollback completo.

#### EC-005

Se detecta una posible Organization duplicada.

Resultado:

Solicitar confirmación antes de crear una nueva Organization.

#### EC-006

Se reciben dos solicitudes simultáneas para la misma Organization.

Resultado:

Garantizar que únicamente pueda existir un Lead activo.

### 5.14 Acceptance Criteria

#### AC-001

No existe ningún Lead sin Organization.

#### AC-002

No existe ningún Lead sin Contact principal.

#### AC-003

No existe ningún Lead sin Owner.

#### AC-004

Todo Lead genera Timeline.

#### AC-005

Todo Lead genera Audit.

#### AC-006

Todo Lead inicia en estado **Identified**.

#### AC-007

No existen Leads activos duplicados.

#### AC-008

Toda creación registra el origen.

#### AC-009

Toda creación genera los eventos correspondientes.

#### AC-010

Toda creación es completamente trazable.

#### AC-011

Toda creación es transaccional.

#### AC-012

El Lead queda preparado para iniciar Discovery™.

### 5.15 Definition of Done

EP-004.1 se considerará finalizada cuando:

- el caso de uso UC-001 esté completamente definido;
- todas las Business Rules sean implementables;
- la State Machine esté documentada;
- los Domain Events estén definidos;
- el modelo de datos sea consistente;
- las relaciones entre entidades estén definidas;
- los permisos estén documentados;
- los Edge Cases estén cubiertos;
- todos los Acceptance Criteria sean verificables;
- Engineering pueda revisar la épica sin necesidad de interpretar el comportamiento esperado.

## 7. EP-004.2 — Lead Ownership

## 8. EP-004.3 — Discovery Integration

## 9. EP-004.4 — Qualification

## 10. EP-004.5 — Partner Creation

## 11. EP-004.6 — Archive & Reactivation

## 12. EP-004.7 — Validation

## 13. State Machine

## 14. Permissions

## 15. Domain Events

## 16. Data Model

## 17. Acceptance Criteria

## 18. Edge Cases

## 19. Out of Scope

## 20. Future Evolution

## 21. Traceability Matrix
