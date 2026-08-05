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

### 6.1 Objective

Lead Ownership define cómo KYRUMA asigna, mantiene y transfiere la responsabilidad sobre un Lead durante todo su ciclo de vida.

El objetivo es garantizar que en todo momento exista una única persona responsable de cada Lead, preservando la trazabilidad completa de todas las reasignaciones realizadas.

Lead Ownership no modifica el estado del Lead.

Únicamente gestiona quién es responsable de su evolución.

### 6.2 User Story

Como Admin o Strategist,

quiero asignar y reasignar el Owner de un Lead,

para asegurar que siempre exista una persona claramente responsable de su seguimiento y evolución.

### 6.3 Actors

Puede asignar o cambiar un Owner:

- Super Admin
- Admin

Puede solicitar una reasignación:

- Strategist

No pueden modificar Ownership:

- Designer
- Developer
- Viewer
- Partner

### 6.4 Scope

Incluye:

- Asignación inicial.
- Cambio de Owner.
- Historial de Owners.
- Validaciones.
- Auditoría.
- Timeline.

No incluye:

- Cambios de estado.
- Qualification.
- Discovery.
- Partner Creation.

### 6.5 Main Flow

#### Asignación inicial

1. Se crea el Lead.
2. Se selecciona un Owner.
3. El sistema valida que dispone de capacidad para gestionar Leads.
4. Se registra la asignación.
5. Se generan Timeline y Audit.

#### Reasignación

1. Un usuario autorizado solicita el cambio.
2. Se selecciona el nuevo Owner.
3. El sistema valida permisos.
4. Se registra el motivo.
5. Se registra fecha.
6. Se registra usuario responsable.
7. Se actualiza el Lead.
8. Se generan Timeline y Audit.

### 6.6 Business Rules

#### BR-013

Todo Lead tendrá exactamente un Owner principal.

#### BR-014

Nunca podrá existir un Lead sin Owner.

#### BR-015

El cambio de Owner no modifica el estado del Lead.

#### BR-016

Toda reasignación requiere un motivo.

#### BR-017

Toda reasignación genera Audit.

#### BR-018

Toda reasignación genera Timeline.

#### BR-019

El historial de Owners nunca se elimina.

#### BR-020

Solo usuarios autorizados pueden modificar Ownership.

#### BR-021

El Owner deberá pertenecer a la Organization interna de KYRUMA.

#### BR-022

Un Lead podrá tener colaboradores, pero únicamente un Owner principal.

#### BR-023

La eliminación de un usuario nunca eliminará el historial de Ownership.

#### BR-024

Toda consulta del historial deberá ser trazable.

### 6.7 Domain Events

#### EV-004

OwnerAssigned

#### EV-005

OwnerChanged

#### EV-006

OwnershipHistoryUpdated

### 6.8 Permissions

Crear Owner inicial:

- Super Admin
- Admin

Cambiar Owner:

- Super Admin
- Admin

Solicitar cambio:

- Strategist

Consultar historial:

Según capacidades del contexto.

### 6.9 Data Model

#### Ownership

Campos:

- id
- leadId
- ownerId
- assignedBy
- assignedAt
- reason
- active

Histórico:

- previousOwnerId
- endedAt
- endedBy

### 6.10 Edge Cases

#### EC-007

Owner desactivado.

Resultado:

El Lead deberá reasignarse antes de continuar.

#### EC-008

Intento de asignar un usuario sin permisos.

Resultado:

Operación rechazada.

#### EC-009

Cambio simultáneo de Owner.

Resultado:

Solo una operación podrá completarse.

#### EC-010

El nuevo Owner coincide con el actual.

Resultado:

No realizar cambios.

#### EC-011

Falta motivo.

Resultado:

Bloquear reasignación.

### 6.11 Acceptance Criteria

#### AC-013

Todo Lead dispone exactamente de un Owner.

#### AC-014

No existen Leads sin responsable.

#### AC-015

Toda reasignación queda auditada.

#### AC-016

Toda reasignación genera Timeline.

#### AC-017

El historial nunca se pierde.

#### AC-018

El cambio de Owner no modifica el estado del Lead.

#### AC-019

Solo usuarios autorizados pueden cambiar Ownership.

#### AC-020

Toda operación de Ownership es completamente trazable.

### 6.12 Definition of Done

EP-004.2 estará finalizada cuando:

- exista un modelo único de Ownership;
- todas las reglas sean implementables;
- el historial sea permanente;
- la reasignación sea auditable;
- Engineering pueda implementar el dominio sin ambigüedades.

## 8. EP-004.3 — Discovery Integration

### 7.1 Objective

Discovery Integration define cómo Lead Lifecycle™ inicia, mantiene y finaliza el proceso Discovery™, garantizando que toda la información obtenida quede asociada permanentemente al Lead.

Discovery™ constituye el mecanismo principal mediante el cual KYRUMA transforma información inicial en conocimiento suficiente para evaluar una posible Partnership.

Lead Lifecycle™ es propietario del proceso.

Discovery™ es propietaria del contenido.

### 7.2 User Story

Como Strategist,

quiero iniciar un proceso Discovery para un Lead,

para comprender el contexto de la Organization antes de tomar una decisión de Qualification.

### 7.3 Actors

Puede iniciar Discovery:

- Super Admin
- Admin
- Strategist

Puede responder Discovery:

- Contact principal
- Contact autorizado

No pueden iniciar Discovery:

- Designer
- Developer
- Viewer
- Partner

### 7.4 Scope

Incluye:

- Inicio de Discovery.
- Invitaciones.
- Reenvíos.
- Estado.
- Versiones.
- Asociación al Lead.
- Cierre de Discovery.

No incluye:

- Contenido del cuestionario.
- IA.
- Análisis.
- Qualification.

### 7.5 Preconditions

- El Lead existe y dispone de un Owner principal.
- El Lead se encuentra en estado Identified o en un estado que permita iniciar Discovery según la State Machine del Lead.
- Existe un Contact principal o un Contact autorizado para responder.
- El usuario que inicia Discovery dispone de permisos sobre el contexto correspondiente.

### 7.6 Main Flow

#### Inicio

1. El Lead alcanza estado Identified.
2. El usuario inicia Discovery.
3. El sistema genera una Discovery Submission.
4. Se crea un enlace seguro.
5. Se envía invitación.
6. Discovery queda en estado Pending.

#### Respuesta

1. El Contact completa Discovery.
2. El sistema valida respuestas.
3. Se almacena una nueva versión.
4. Discovery pasa a Completed.
5. Se generan Timeline y Audit.

#### Reenvío

1. El usuario solicita un nuevo envío.
2. Se genera una nueva invitación.
3. No se pierde el historial anterior.

#### Cierre

1. El proceso Discovery queda en estado Completed o Reviewed.
2. Lead Lifecycle™ conserva la asociación y disponibilidad del resultado para Qualification.
3. Discovery™ conserva el contenido y las versiones generadas.

### 7.7 Business Rules

#### BR-025

Todo Discovery pertenece exactamente a un Lead.

#### BR-026

Un Lead puede tener múltiples Discovery Submission.

#### BR-027

Las versiones nunca sustituyen a las anteriores.

#### BR-028

Toda Discovery tiene estado.

#### BR-029

Toda Discovery genera Timeline.

#### BR-030

Toda Discovery genera Audit.

#### BR-031

No puede iniciarse Qualification sin una Discovery completada.

#### BR-032

Un enlace Discovery puede revocarse.

#### BR-033

Toda invitación registra fecha.

#### BR-034

Toda respuesta registra versión.

#### BR-035

Discovery nunca modifica directamente el estado del Lead.

### 7.8 Domain Events

#### EV-007

DiscoveryStarted

#### EV-008

DiscoveryInvitationSent

#### EV-009

DiscoveryCompleted

#### EV-010

DiscoveryReopened

#### EV-011

DiscoveryVersionCreated

### 7.9 Permissions

Puede iniciar:

- Super Admin
- Admin
- Strategist

Puede responder:

- Contact autorizado.

Puede consultar:

Según capacidades.

### 7.10 Data Model

#### Discovery

Campos:

- id
- leadId
- version
- status
- startedAt
- completedAt
- completedBy
- invitationSentAt
- revokedAt

### 7.11 State Machine

Pending

↓

In Progress

↓

Completed

↓

Reviewed

### 7.12 Edge Cases

#### EC-012

El enlace Discovery ha sido revocado.

Resultado:

No permitir nuevas respuestas mediante ese enlace.

#### EC-013

Un Contact no autorizado intenta responder.

Resultado:

Operación rechazada.

#### EC-014

El Contact reabre una versión completada.

Resultado:

Crear una nueva versión sin sustituir el historial anterior.

#### EC-015

Se solicita un reenvío con una invitación pendiente.

Resultado:

Registrar la nueva invitación y conservar el historial de envíos.

#### EC-016

Se intenta iniciar Qualification con Discovery no completada.

Resultado:

Bloquear la operación.

### 7.13 Acceptance Criteria

#### AC-021

Toda Discovery pertenece a un Lead.

#### AC-022

Toda invitación queda asociada a una Discovery.

#### AC-023

Las versiones anteriores permanecen disponibles.

#### AC-024

Toda Discovery tiene un estado verificable.

#### AC-025

Toda invitación, respuesta y cierre generan trazabilidad.

#### AC-026

No puede iniciarse Qualification sin una Discovery completada.

#### AC-027

Un enlace revocado no permite nuevas respuestas.

#### AC-028

Discovery no modifica directamente el estado del Lead.

### 7.14 Definition of Done

EP-004.3 estará finalizada cuando:

- Discovery quede asociada permanentemente al Lead;
- las invitaciones y versiones conserven historial;
- los estados y permisos sean verificables;
- Qualification solo pueda utilizar una Discovery completada;
- Engineering pueda implementar la integración sin interpretar el contenido de Discovery™.

## 9. EP-004.4 — Qualification

### 8.1 Objective

Qualification define el proceso mediante el cual KYRUMA determina si una Organization debe convertirse en Partner.

El objetivo de esta épica es garantizar que la decisión de continuar, pausar o finalizar una posible Partnership sea consistente, justificada, trazable y basada en la información obtenida durante Discovery™.

Qualification no crea el Partner.

Qualification únicamente emite una decisión.

### 8.2 User Story

Como Strategist,

quiero evaluar un Lead utilizando toda la información disponible,

para decidir si KYRUMA debe continuar hacia la creación de un Partner.

### 8.3 Actors

Puede ejecutar Qualification:

- Super Admin
- Admin
- Strategist

Puede consultar:

- Usuarios autorizados según capacidades.

No pueden ejecutar Qualification:

- Designer
- Developer
- Viewer
- Partner

### 8.4 Scope

Incluye:

- Inicio de Qualification.
- Revisión de Discovery.
- Registro de decisiones.
- Aplicación de criterios.
- Resultado final.
- Historial de decisiones.

No incluye:

- Creación del Partner.
- Onboarding.
- Proyectos.
- IA.

### 8.5 Preconditions

Qualification únicamente podrá iniciarse cuando:

- El Lead exista.
- Discovery esté completada.
- Exista un Owner.
- No exista una Qualification abierta para el mismo Lead.
- El usuario disponga de permisos sobre el contexto correspondiente.

### 8.6 Main Flow

1. Un usuario autorizado inicia Qualification.
2. El sistema verifica que existe una Discovery completada.
3. El usuario revisa el contexto disponible del Lead.
4. Se registra la decisión y el motivo.
5. Se registra la fecha y el usuario responsable.
6. Se conserva la decisión dentro del historial de Qualification.
7. Se generan Timeline y Audit.
8. El Lead queda disponible para el siguiente resultado permitido por la decisión.

### 8.7 Business Rules

#### BR-036

No puede iniciarse Qualification sin una Discovery completada.

#### BR-037

Todo Lead tiene como máximo una Qualification abierta.

#### BR-038

Toda Qualification registra una decisión.

#### BR-039

Toda decisión requiere un motivo.

#### BR-040

Toda decisión registra fecha y usuario responsable.

#### BR-041

El historial de Qualification nunca se elimina.

#### BR-042

Toda Qualification genera Timeline y Audit.

#### BR-043

Qualification no crea directamente un Partner.

#### BR-044

Una decisión de continuar habilita la creación de Partner, pero no la ejecuta.

#### BR-045

Una decisión de pausa mantiene el Lead dentro de Lead Lifecycle™.

#### BR-046

Una decisión de finalización archiva el Lead sin crear Partner.

### 8.8 Domain Events

#### EV-012

QualificationStarted

#### EV-013

QualificationDecisionRecorded

#### EV-014

QualificationCompleted

### 8.9 Permissions

Puede iniciar y registrar decisiones:

- Super Admin
- Admin
- Strategist

Puede consultar:

- Usuarios con acceso al contexto correspondiente.

### 8.10 Data Model

#### Qualification Decision

Campos:

- id
- leadId
- status
- decision
- reason
- decidedBy
- decidedAt
- createdAt

### 8.11 State Machine

Not Started

↓

In Progress

↓

Decision Recorded

↓

Completed

Desde Completed, la decisión podrá habilitar Partner Creation, mantener el Lead On Hold o archivar el Lead.

### 8.12 Edge Cases

#### EC-017

Discovery no está completada.

Resultado:

Bloquear Qualification.

#### EC-018

Existe una Qualification abierta.

Resultado:

No iniciar una segunda Qualification.

#### EC-019

Falta motivo de decisión.

Resultado:

Bloquear el registro.

#### EC-020

Dos usuarios registran una decisión simultáneamente.

Resultado:

Solo una operación podrá completarse.

### 8.13 Acceptance Criteria

#### AC-029

No puede iniciarse Qualification sin Discovery completada.

#### AC-030

Toda decisión tiene motivo, fecha y usuario responsable.

#### AC-031

No existe más de una Qualification abierta por Lead.

#### AC-032

El historial de decisiones permanece disponible.

#### AC-033

Toda Qualification genera Timeline y Audit.

#### AC-034

Qualification no crea directamente un Partner.

### 8.14 Definition of Done

EP-004.4 estará finalizada cuando:

- Qualification utilice una Discovery completada;
- todas las decisiones sean trazables;
- el historial sea permanente;
- Partner Creation quede separado de Qualification;
- Engineering pueda implementar la épica sin interpretar el resultado esperado.

## 10. EP-004.5 — Partner Creation

### 9.1 Objective

Partner Creation define el proceso mediante el cual una Organization aprobada durante Qualification se convierte en Partner de KYRUMA.

El objetivo es garantizar que la creación de un Partner sea una decisión humana interna, explícita, trazable y basada exclusivamente en un Lead cualificado.

La creación del Partner no activa automáticamente su Workspace ni inicia Onboarding™.

### 9.2 User Story

Como Super Admin o Admin,

quiero crear un Partner a partir de un Lead cualificado,

para formalizar el inicio de una Creative Partnership sin perder el contexto acumulado.

### 9.3 Actors

Puede crear un Partner:

- Super Admin
- Admin

Puede consultar el resultado:

- Usuarios con acceso al contexto correspondiente.

No pueden crear un Partner:

- Strategist
- Designer
- Developer
- Viewer
- Partner

### 9.4 Scope

Incluye:

- Validación de Lead cualificado.
- Decisión humana interna de creación.
- Creación del Partner.
- Generación del identificador público KYR-XXX.
- Asociación permanente con el Lead de origen.
- Transferencia del contexto al dominio de Onboarding™.
- Timeline y Audit.

No incluye:

- Activación del Workspace.
- Invitación de usuarios externos.
- Onboarding.
- Proyectos.
- Client Portal™.

### 9.5 Preconditions

- El Lead existe.
- El Lead tiene una Qualification completada con decisión de continuar.
- Existe una Organization asociada al Lead.
- No existe un Partner creado previamente a partir del mismo Lead.
- El usuario dispone de permisos de creación de Partner.

### 9.6 Main Flow

1. Un usuario autorizado solicita crear un Partner desde un Lead cualificado.
2. El sistema valida la decisión de Qualification y la unicidad de la conversión.
3. Se crea el Partner asociado a la Organization.
4. Se genera el identificador público KYR-XXX.
5. Se conserva la referencia permanente al Lead de origen.
6. Se registra la decisión humana interna y el usuario responsable.
7. Se generan Timeline y Audit.
8. Se emite el evento de creación.
9. La responsabilidad operativa pasa a Onboarding™.

### 9.7 Business Rules

#### BR-047

No puede crearse un Partner sin un Lead previo.

#### BR-048

No puede crearse un Partner sin una Qualification completada con decisión de continuar.

#### BR-049

La creación de un Partner es siempre una decisión humana interna.

#### BR-050

Un Lead solo puede crear un Partner.

#### BR-051

Todo Partner recibe un identificador público KYR-XXX.

#### BR-052

La creación conserva permanentemente la referencia al Lead de origen.

#### BR-053

La creación de Partner genera Timeline y Audit.

#### BR-054

La creación de Partner genera un evento de dominio PartnerCreated.

#### BR-055

La creación del Partner no activa automáticamente su Workspace.

#### BR-056

La creación del Partner no inicia automáticamente Onboarding™.

### 9.8 Domain Events

#### EV-015

PartnerCreated

#### EV-016

PartnerPublicIdGenerated

#### EV-017

PartnerCreationRecorded

### 9.9 Permissions

Puede crear:

- Super Admin
- Admin

Puede consultar:

- Usuarios con acceso al contexto correspondiente.

### 9.10 Data Model

#### Partner Creation

Campos:

- id
- leadId
- partnerId
- organizationId
- publicId
- createdBy
- createdAt
- qualificationDecisionId

### 9.11 State Machine

Eligible

↓

Creation Requested

↓

Partner Created

`Partner Created` es un estado final para la conversión del Lead. La activación de Workspace y Onboarding™ se producen en procesos posteriores e independientes.

### 9.12 Edge Cases

#### EC-021

El Lead no tiene Qualification elegible.

Resultado:

Bloquear la creación.

#### EC-022

Ya existe un Partner para el mismo Lead.

Resultado:

No crear un segundo Partner.

#### EC-023

Falla la generación del identificador público.

Resultado:

Cancelar completamente la creación.

#### EC-024

Dos solicitudes intentan crear Partner desde el mismo Lead.

Resultado:

Solo una operación podrá completarse.

### 9.13 Acceptance Criteria

#### AC-035

No existe Partner sin Lead de origen.

#### AC-036

No existe Partner sin Qualification elegible.

#### AC-037

Cada Lead crea como máximo un Partner.

#### AC-038

Todo Partner recibe un identificador público KYR-XXX.

#### AC-039

Toda creación es trazable mediante Timeline y Audit.

#### AC-040

La creación no activa automáticamente Workspace ni Onboarding™.

### 9.14 Definition of Done

EP-004.5 estará finalizada cuando:

- la creación de Partner dependa de una Qualification elegible;
- la decisión humana interna quede registrada;
- el Lead de origen permanezca vinculado;
- el identificador público sea único y trazable;
- Workspace y Onboarding™ permanezcan fuera de esta épica;
- Engineering pueda implementar el proceso sin interpretar la decisión de negocio.

## 11. EP-004.6 — Archive & Reactivation

### 10.1 Objective

Archive & Reactivation define cómo KYRUMA conserva un Lead cuando no debe continuar activamente y cómo puede recuperarlo para una nueva evaluación sin perder su historial.

El objetivo es asegurar que archivar nunca equivale a eliminar y que reactivar un Lead es una decisión explícita, trazable y compatible con la unicidad de Leads activos.

### 10.2 User Story

Como Admin o Strategist,

quiero archivar o reactivar un Lead,

para conservar su contexto completo y poder retomar una posible Partnership cuando exista una nueva razón para evaluarla.

### 10.3 Actors

Puede archivar o reactivar:

- Super Admin
- Admin
- Strategist

Puede consultar:

- Usuarios autorizados según capacidades del contexto.

No pueden archivar ni reactivar:

- Designer
- Developer
- Viewer
- Partner

### 10.4 Scope

Incluye:

- Archivo de Lead.
- Registro del motivo, fecha y responsable.
- Conservación de Timeline, Audit, Ownership, Discovery y Qualification.
- Reactivación explícita.
- Validación de unicidad de Lead activo.

No incluye:

- Eliminación de Lead o de historial.
- Creación de Partner.
- Cambios en contenido de Discovery.
- Gestión de Projects, Onboarding o Client Portal™.

### 10.5 Preconditions

- El Lead existe y pertenece al contexto autorizado.
- El actor dispone de permisos para archivar o reactivar.
- Para reactivar, no existe otro Lead activo para la misma Organization.

### 10.6 Main Flow

#### Archivo

1. Un usuario autorizado solicita archivar el Lead.
2. Se registra el motivo.
3. El sistema registra fecha y responsable.
4. El Lead pasa a Archived.
5. Se conservan todos los datos e historial existentes.
6. Se generan Timeline, Audit y evento de dominio.

#### Reactivación

1. Un usuario autorizado solicita reactivar el Lead.
2. El sistema valida que no exista otro Lead activo para la Organization.
3. Se registra el motivo, fecha y responsable de la reactivación.
4. El Lead vuelve al estado permitido por su historial de evaluación.
5. Se generan Timeline, Audit y evento de dominio.

### 10.7 Business Rules

#### BR-057

Archivar un Lead nunca elimina información ni historial.

#### BR-058

Todo archivo requiere motivo.

#### BR-059

Todo archivo registra fecha y usuario responsable.

#### BR-060

Un Lead archivado no puede iniciar procesos posteriores hasta ser reactivado.

#### BR-061

Todo Lead archivado puede reactivarse únicamente mediante una decisión explícita.

#### BR-062

No puede reactivarse un Lead si existe otro Lead activo para la misma Organization.

#### BR-063

Archivo y reactivación generan Timeline y Audit.

#### BR-064

El historial de archivo y reactivación nunca se elimina.

### 10.8 Domain Events

#### EV-018

LeadArchived

#### EV-019

LeadReactivated

### 10.9 Permissions

Puede archivar o reactivar:

- Super Admin
- Admin
- Strategist

Puede consultar el historial:

- Usuarios con acceso al contexto correspondiente.

### 10.10 Data Model

#### Archive Record

Campos:

- id
- leadId
- action
- reason
- performedBy
- performedAt
- previousStatus
- resultingStatus

### 10.11 State Machine

Lead activo

↓

Archived

↓

Reactivated

Archived es un estado final mientras no exista una reactivación explícita. Reactivation no elimina ni reemplaza el historial anterior.

### 10.12 Edge Cases

#### EC-025

Falta motivo de archivo o reactivación.

Resultado:

Bloquear la operación.

#### EC-026

Se intenta reactivar y existe otro Lead activo para la Organization.

Resultado:

Bloquear la reactivación.

#### EC-027

Dos usuarios archivan o reactivan simultáneamente.

Resultado:

Solo una operación podrá completarse.

### 10.13 Acceptance Criteria

#### AC-041

Archivar nunca elimina datos ni historial.

#### AC-042

Toda operación registra motivo, fecha y responsable.

#### AC-043

Un Lead archivado no avanza hasta reactivarse.

#### AC-044

No se reactiva un Lead cuando existe otro activo para la misma Organization.

#### AC-045

Archivo y reactivación generan Timeline, Audit y trazabilidad.

### 10.14 Definition of Done

EP-004.6 estará finalizada cuando:

- el archivo sea reversible sin pérdida de información;
- la reactivación preserve la unicidad de Lead activo;
- todas las operaciones sean auditables;
- Engineering pueda implementar el proceso sin interpretar el comportamiento esperado.

## 12. EP-004.7 — Validation

### 11.1 Objective

Validation & QA define los criterios necesarios para verificar que Lead Lifecycle™ conserva sus invariantes, permisos, transacciones, historial y trazabilidad en todas sus épicas.

El objetivo es garantizar que la validación del dominio se base en reglas verificables y no únicamente en recorridos de interfaz.

### 11.2 User Story

Como responsable de KYRUMA OS™,

quiero validar el ciclo completo de Lead Lifecycle™,

para asegurar que cada Organization recorra un proceso consistente, seguro y trazable antes de convertirse en Partner.

### 11.3 Scope

Incluye:

- Validación de Business Rules, State Machines y Acceptance Criteria.
- Pruebas de Context, Capabilities, Memberships y visibilidad.
- Pruebas de transacciones, concurrencia, rollback y duplicados.
- Validación de Audit, Timeline y Domain Events.
- Regresión de cada épica de PS-004.

No incluye:

- Implementación de UI no aprobada.
- Pruebas de dominios fuera de Lead Lifecycle™.
- Automatizaciones o análisis de Intelligence™.

### 11.4 Validation Matrix

| Área | Validación mínima |
| --- | --- |
| Lead Creation | Organization, Contact, Owner, Origin, estado Identified, unicidad y rollback. |
| Ownership | Owner único, historial permanente, motivo y concurrencia. |
| Discovery | Asociación al Lead, invitaciones, versiones, revocación y Discovery completada. |
| Qualification | Preconditions, decisión, historial y separación de Partner Creation. |
| Partner Creation | Lead cualificado, decisión humana, KYR-XXX, unicidad y Workspace independiente. |
| Archive & Reactivation | Retención, motivo, reactivación y unicidad. |
| Seguridad | Capability, Membership activa, scope, visibilidad y revocación. |
| Eventos | Confirmación, versión, idempotencia, Audit y Timeline separados. |

### 11.5 Business Rules

#### BR-065

Ninguna épica se considera terminada sin pruebas de sus Acceptance Criteria.

#### BR-066

Toda operación crítica debe validar autorización, contexto y visibilidad.

#### BR-067

Las operaciones transaccionales deben demostrar rollback ante fallo.

#### BR-068

Los casos de concurrencia y duplicados deben ser verificables.

#### BR-069

Las pruebas no utilizarán datos personales reales.

### 11.6 Acceptance Criteria

#### AC-046

Cada Business Rule de PS-004 tiene una prueba o una justificación documentada.

#### AC-047

Cada transición válida e inválida tiene cobertura.

#### AC-048

Las denegaciones por Capability, Membership, scope y visibilidad son verificables.

#### AC-049

Los eventos solo se declaran tras confirmar la operación.

#### AC-050

La regresión confirma que ningún Partner se crea fuera del proceso definido.

### 11.7 Definition of Done

EP-004.7 estará finalizada cuando:

- la matriz de validación esté cubierta;
- las excepciones de cobertura estén justificadas;
- QA confirme los criterios de aceptación;
- el Domain Implementation Report pueda preparar una Engineering Release.

## 13. State Machine

## 14. Permissions

## 15. Domain Events

## 16. Data Model

## 17. Acceptance Criteria

## 18. Edge Cases

## 19. Out of Scope

## 20. Future Evolution

## 21. Traceability Matrix
