# KYRUMA OS™ — Domain Model

**Estado:** Propuesta. Los identificadores son UUID/ULID internos no adivinables; las URLs públicas usan un slug independiente y revocable.

```mermaid
erDiagram
  ORGANIZATION ||--o{ MEMBERSHIP : has
  USER ||--o{ MEMBERSHIP : holds
  ORGANIZATION ||--o{ PARTNER : serves
  PARTNER ||--o{ WORKSPACE : owns
  LEAD }o--|| ORGANIZATION : may_convert_to
  WORKSPACE ||--o{ DISCOVERY : contains
  DISCOVERY ||--o{ DISCOVERY_SUBMISSION : versions
  WORKSPACE ||--o{ PROJECT : contains
  PROJECT ||--o{ DELIVERABLE : produces
  WORKSPACE ||--o{ TIMELINE_EVENT : records
```

| Entidad | Propósito y ciclo de vida | Propiedad / visibilidad | Sensibilidad y retención |
| --- | --- | --- | --- |
| Lead | Entrada comercial previa a relación. `new → qualified → converted / lost / archived`. | Interna, asociable a Organization. | PII y atribución; retención pendiente de política. |
| Organization | Empresa o entidad legal/comercial. Puede tener varios Leads, Partners y Users. `active / archived`. | Interna; Partners ven solo su propio contexto autorizado. | Datos comerciales; soft delete y exportación. |
| User | Persona autenticable. `invited → active → suspended / revoked`. | Propia; acceso por Membership. | PII, credenciales gestionadas por proveedor; minimización. |
| Membership | Unión User–Organization con rol y capacidades. `invited / active / revoked`. | Visible a administradores autorizados. | Evidencia de acceso y auditoría. |
| Partner | Contexto de relación estratégica, no sinónimo de User. Puede representar una línea, cliente o unidad dentro de Organization. `prospect / active / paused / closed`. | Interno; personas Partner solo por Membership y Workspace. | Datos de relación y decisiones. |
| Workspace | Contenedor operativo con alcance y participantes. `active / archived`. Un Partner puede requerir varios workspaces a lo largo del tiempo. | Aislado por autorización de recurso. | Límite principal de aislamiento y auditoría. |
| Discovery | Instancia basada en una plantilla/versionada. `draft / open / submitted / reviewed / superseded`. | Partner e interno según etapa. | Respuestas posiblemente sensibles. |
| Discovery Submission | Captura inmutable de respuestas por intento/versión. No se sobrescribe; una corrección crea versión nueva. | Internal by default; partner ve sus envíos autorizados. | PII y estrategia; retención explícita. |
| Timeline Event | Hecho visible en la línea temporal, derivado de dominio o creado manualmente. | Filtrado por actor y audience. | No incluir secretos ni payloads completos. |
| Meeting | Reunión ligada opcionalmente a Lead, Partner, Workspace o Proposal. `scheduled / completed / cancelled / no_show`. | Participantes autorizados. | Agenda y notas; datos personales. |
| Proposal | Propuesta versionada. `draft / sent / accepted / declined / expired / superseded`. | Interna hasta compartir; partner solo versión publicada. | Comercial y contractual; historial inmutable. |
| Project | Ejecución tras propuesta o acuerdo. `planned / active / on_hold / completed / cancelled`. | Workspace autorizado. | Datos de entrega y seguimiento. |
| Strategy Decision | Decisión con contexto, alternativas, dueño y fecha de revisión. `proposed / decided / superseded`. | Workspace; exposición externa explícita. | Conocimiento estratégico. |
| Task | Trabajo atómico con responsable, estado y fecha. `open / in_progress / blocked / done / cancelled`. | Workspace y miembros autorizados. | Datos operativos. |
| Deliverable | Resultado publicable de un proyecto. `draft / review / published / withdrawn`. | Partner solo cuando publicado. | Propiedad intelectual y versiones. |
| Document | Registro de contenido/archivo con clasificación. `active / archived / deleted`. | ACL de Workspace/recurso. | Puede contener PII, contrato o IP. |
| Asset | Archivo binario y metadatos de almacenamiento. `pending / available / quarantined / deleted`. | Nunca público por defecto; URL firmada y temporal. | Alto riesgo; antivirus/validación futura. |
| Internal Note | Nota interna, no compartible por defecto. `active / archived`. | Solo personal KYRUMA autorizado. | Confidencial; excluida de portal. |
| Notification | Intención y registro de aviso. `queued / sent / failed / read`. | Destinatario y personal autorizado. | Minimizar contenido; reintentos idempotentes. |
| Insight | Resultado derivado, incluido futuro análisis IA. `draft / reviewed / published / obsolete`. | Interno hasta publicación explícita. | Trazabilidad a fuentes; no sustituye evidencia. |
| Audit Event | Registro inmutable de acción sensible. | Administradores/seguridad. | Actor, fecha, recurso y metadatos mínimos; retención legal pendiente. |

## Relaciones y reglas no negociables

- Un User puede pertenecer a varias Organizations; un Organization puede tener múltiples Memberships.
- Partner y Workspace no se fuerzan a uno-a-uno: el negocio puede requerir workspaces por iniciativa, periodo o proyecto.
- Toda entidad de negocio operativa debe tener `organizationId`; las de workspace además `workspaceId` cuando aplique.
- `createdAt`, `updatedAt`, `createdBy` y `version` son metadatos base. Las entidades auditables añaden `deletedAt` y razón de cambio cuando proceda.
- Las respuestas originales y los outputs de Intelligence permanecen separados: un Insight referencia las Submission versionadas que lo sustentan.
