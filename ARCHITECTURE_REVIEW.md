# KYRUMA OS™ — Architecture Review

**Rama revisada:** `architecture/kyruma-os-foundation`
**Estado:** Revisión ejecutiva histórica previa a Foundation Phase 1 y 2; la arquitectura de dominio permanece congelada.
**Conclusión recomendada:** **APPROVE WITH CONDITIONS**

## 1. Resumen ejecutivo

La arquitectura recomienda evolucionar KYRUMA OS dentro del repositorio Next.js actual, manteniendo separadas la web pública, el Discovery público y la futura superficie autenticada. La web conserva sus rutas, providers y APIs actuales. KYRUMA Discovery™ permanece en `/workspace` como flujo público compatible; la plataforma no reutiliza esa ruta para un portal privado.

La futura plataforma se organiza por dominios de negocio —Acquisition, Identity, Partner Context, Discovery, Delivery, Knowledge, Intelligence y Platform— con autorización de servidor, persistencia relacional propuesta y eventos de dominio diferenciados de Timeline, Audit y analítica. Esta base es coherente con Business Decision Pack v1.0 y evita convertir KYRUMA en un CRM genérico.

**Valoración:** los límites de dominio, ciclos de vida y controles de seguridad son suficientes para aprobar el diseño condicionalmente. No es seguro iniciar una fase funcional hasta resolver las decisiones bloqueantes de identidad, persistencia, permisos operativos y retención.

## 2. Decisiones listas para aprobar

| Decisión | Documento / sección | Alternativas consideradas | Recomendación técnica | Impacto / riesgo | Decisión empresarial necesaria |
| --- | --- | --- | --- | --- | --- |
| Límites por dominio | `KYRUMA_OS_TECHNICAL_ARCHITECTURE.md` — Límites | Organización por páginas, módulos técnicos o dominios | Dominios de negocio con `features` y puertos de plataforma | Reduce acoplamiento; requiere disciplina de imports | Aprobar el modelo de dominios. |
| Protección Discovery | `TECHNICAL_DECISIONS.md` TD-006 | Reescritura o adaptador futuro | Mantener UI/API y adaptar persistencia después | Bajo riesgo de regresión; añade traducción futura | Confirmar como contrato protegido. |
| Roles y capacidades | `AUTHORIZATION_MODEL.md` | Roles rígidos o capacidades scoped | Roles como perfiles + capacidades con Organization/Partner/Workspace/recurso | Mayor modelado inicial; mínimo privilegio | Aprobar catálogo inicial y dueños de permisos. |
| Versionado de Discovery | `DOMAIN_MODEL.md`, `DATA_ARCHITECTURE.md` | Sobrescribir respuestas o snapshots | Submission inmutable vinculada a versión | Más datos; protege historial y evidencia | Aprobar no sobrescritura de envíos. |
| Separación Timeline/Audit/Analytics | `EVENT_ARCHITECTURE.md` | Un único feed | Tres sistemas con propósitos distintos | Evita filtraciones y automatizaciones indebidas | Aprobar la separación. |
| Visibilidad explícita | `DOMAIN_MODEL.md` | Compartición implícita por Partner | `internal`, `shared`, `partner_private`, `public_link` | Reduce riesgo de fuga; exige publicación explícita | Aprobar matriz base de visibilidad. |
| Evolución incremental | `IMPLEMENTATION_ROADMAP.md` | Construir portal/CRM completo | Fases autorizadas con RFC, pruebas y rollback | Menor velocidad aparente; menor riesgo real | Aprobar gates de fase. |

## 3. Decisiones pendientes de negocio

| Decisión | Documento / sección | Alternativas | Recomendación técnica actual | Impacto / riesgo | Aprobación requerida |
| --- | --- | --- | --- | --- | --- |
| Proveedor y modelo de identidad | `AUTHORIZATION_MODEL.md` — Alternativas; TD-007 | Proveedor gestionado, Auth.js, SSO temprano | Evaluar proveedor gestionado con sesiones, invitaciones, organizaciones y exportación | Bloquea usuarios, sesiones y revocación | CEO + responsable técnico: coste, residencia, SSO y cuenta propietaria. |
| Proveedor y estrategia de persistencia | `DATA_ARCHITECTURE.md`; TD-008 | Relacional gestionada, otros modelos | Relacional gestionada detrás de repositorios | Bloquea datos operativos, backup y migraciones | CEO: presupuesto, región, RPO/RTO y ownership. |
| Activación operativa de Partner | `DOMAIN_MODEL.md` — Partner; Business alignment | Acción humana, condición futura aprobada | Acción interna autorizada; inicia `ONBOARDING` | Riesgo de partners creados prematuramente | CEO: quién aprueba, evidencia y motivo. |
| Creación/activación de Workspace | `DOMAIN_MODEL.md`, `ROUTING_ARCHITECTURE.md` | Workspace interno principal, múltiples, activación externa automática | Uno interno principal opcional; portal externo solo por activación/invitación expresa | Riesgo de acceso externo prematuro | CEO: criterio y propietario de activación. |
| Permisos y capacidades efectivas | `AUTHORIZATION_MODEL.md` | Roles amplios, capacidad por recurso, excepciones | Capacidades scoped y denegar por defecto | Fuga o fricción si la matriz es incompleta | CEO/operación: matriz por rol, visibilidad y publicación. |
| Retención, eliminación y exportación | `SECURITY_ARCHITECTURE.md`; `DATA_ARCHITECTURE.md` | Borrado inmediato, soft delete, archivo | Archivo por defecto y política por categoría | Riesgo legal y coste de almacenamiento | CEO + asesoría jurídica: plazos, excepciones y DSR. |
| Tratamiento futuro de Intelligence | TD-009, `DOMAIN_MODEL.md` | IA automática, asistida, solo manual | Insights en borrador, con fuentes y revisión humana | Privacidad, calidad y responsabilidad | CEO: uso permitido, proveedor y revisión. |
| Convivencia definitiva en repo | TD-001 | Mismo repo, monorepo, separación | Convivencia temporal con límites por feature | Build/acoplamiento futuro | CEO + técnico: umbrales de separación y presupuesto operativo. |
| Namespace de plataforma | TD-002, `ROUTING_ARCHITECTURE.md` | `/os`, `/workspace/*`, otro namespace | `/os` es propuesta; `/workspace` público no se altera | Enlaces y migración futura | CEO: aprobar nomenclatura tras RFC. |

## 4. Riesgos bloqueantes

1. **No hay proveedor de identidad ni política de sesión aprobados.** No se puede exponer ninguna ruta interna o Partner de forma segura.
2. **No existe decisión de persistencia, región ni backup.** No se deben guardar Leads, Discoveries o documentos operativos.
3. **La matriz de permisos y visibilidad no está operativizada por rol y recurso.** Implementar sin ella puede provocar exposición de notas, documentos o datos estratégicos.
4. **Retención y derechos sobre datos sin validar jurídicamente.** No se deben almacenar nuevas categorías sensibles sin política aplicable.
5. **Criterio de creación de Partner/Workspace sin dueño operativo definido.** Automatizar o implementar este paso ahora inventaría una regla comercial.

## 5. Riesgos no bloqueantes

- Convivencia temporal de web y OS en el mismo repositorio: controlable con límites de dominio, previews y umbrales de separación.
- Coste/selección de almacenamiento de archivos: se gestiona antes de Document/Asset, no bloquea Identity.
- Outbox y reintentos: se diseña cuando haya primer efecto secundario aprobado; no requiere bus distribuido inicial.
- Scalabilidad de búsqueda, IA, automatizaciones y SSO: diferidos hasta que haya demanda y RFC aprobados.
- Deuda menor del repositorio actual: archivos `.DS_Store` y restos de componentes eliminados se limpian en tarea independiente, no afectan Foundation.

## 6. Dependencias

| Tipo | Dependencias |
| --- | --- |
| Técnica | Proveedor de identidad, DB relacional, almacenamiento de objetos, entorno preview, secretos por entorno, estrategia de migraciones. |
| Empresarial | Dueño de Lead Lifecycle, creación de Partner, activación de Workspace, matriz de roles, visibilidad y publicación. |
| Legal / privacidad | Retención, eliminación, exportación, regiones, contratos de tratamiento y categorías de datos restringidos. |
| Seguridad | MFA/sesiones del proveedor, auditoría, clasificación de archivos, enlaces revocables y pruebas de aislamiento. |

## 7. Recomendación

### APPROVE WITH CONDITIONS

La arquitectura debe aprobarse como referencia de diseño porque protege la producción, conserva `/workspace`, evita código especulativo y establece límites reversibles. La aprobación **no autoriza implementación funcional**.

Condiciones para autorizar la primera implementación:

1. Aprobar proveedor de identidad y modelo de sesión.
2. Aprobar persistencia relacional, región, backup y ownership.
3. Aprobar matriz inicial de capacidades/visibilidad.
4. Definir y asignar dueño al alta de Partner y activación de Workspace.
5. Confirmar política jurídica mínima para PII, Discovery y auditoría.
6. Aprobar un RFC específico de Foundation — Identity and Permissions.

## 8. Primera fase propuesta — Foundation: Identity and Permissions

### Objetivo

Crear la mínima base segura para que un User autenticado tenga una Membership scoped y el servidor pueda permitir o denegar una acción sin introducir Partner portal, CRM ni persistencia de negocio completa.

### Entregables

- Adaptador del proveedor de identidad aprobado y sesiones seguras.
- Modelo mínimo de User, Organization, Membership, roles y capacidades.
- Guards de autorización de servidor, Audit Events de invitación/rol/revocación y tests negativos de aislamiento.
- Ruta interna mínima protegida, sin datos de Partner, para verificar sesión y permisos.
- Runbook de revocación, variables de entorno y rollback.

### Dependencias

Proveedores aprobados, matriz de roles/capacidades inicial, política de sesión, región/retención mínima de identidad y RFC firmado.

### Criterios de aceptación

- Una identidad sin Membership no accede a recursos internos.
- Una Membership revocada pierde acceso y deja Audit Event.
- Las capacidades se verifican en servidor y las pruebas cubren denegación entre organizaciones.
- `/workspace`, web pública y APIs actuales no cambian de comportamiento.
- Lint, TypeScript, build, pruebas de autorización y plan de rollback en verde.

### Fuera de alcance

Partner Context, Lead Lifecycle, persistencia de Discovery, documentos, portal, IA, CRM, automatizaciones, SSO empresarial y facturación.

### Rollback

Feature flag/route privada no enlazada públicamente; revocar variables/sesiones del proveedor, desactivar la ruta y revertir migración únicamente mediante procedimiento probado. Nunca borrar cuentas o auditoría como rollback automático.

## Verificación de congelación

- En el momento de esta revisión, el diff respecto a `main` contenía solo documentación de arquitectura y revisión.
- En el momento de esta revisión, no se habían añadido dependencias a `package.json` ni código en `src/`.
- No se alteraron APIs, providers, web pública, Discovery ni la ruta `/workspace`.
- No se fusionó ni desplegó la rama.
