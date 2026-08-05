# Foundation Phase 1 — Identity & Permissions

**Estado:** Implementación inicial autorizada. No conecta un proveedor ni expone rutas de login.

## Alcance implementado

- Catálogo de capacidades y roles como agrupaciones de capacidades.
- `UserIdentity`, `Membership`, ámbito de Organization/Partner/Workspace y visibilidad de recurso.
- Evaluador puro de autorización y guard reutilizable para casos de uso de servidor.
- Puertos desacoplados de proveedor de identidad y repositorio de persistencia.

## Contratos y garantías

- Una Membership solo autoriza en estado `active` y dentro de su ámbito.
- La visibilidad `internal` se deniega a Partner y Viewer incluso si una UI la mostrase por error.
- `super_admin` requiere una Membership de plataforma explícita; no se infiere por correo, rol visual ni URL.
- `grants` y `revocations` permiten excepciones sin convertir los roles en la única fuente de permiso.
- El guard devuelve una decisión o lanza un error seguro; futuros route handlers deberán registrarlo mediante Audit Event.
- El catálogo incluye el namespace aditivo `lead.*`: `lead.create`, `lead.read`, `lead.update`, `lead.archive`, `lead.reactivate`, `lead.ownership.update`, `lead.discovery.start`, `lead.qualification.start`, `lead.qualification.approve` y `lead.partner.create`.
- La matriz de Lead Lifecycle asigna todas las capacidades a Super Admin y Admin; Strategist puede crear, leer, actualizar, iniciar Discovery e iniciar Qualification; Designer, Developer y Viewer solo pueden leer; Partner no recibe capacidades `lead.*`.

## Límites intencionados

- Sin proveedor de autenticación, sesiones reales, pantallas de login ni invitaciones enviadas.
- Sin PostgreSQL, migraciones, credenciales ni tablas persistidas.
- Sin rutas `/os`, API, UI, proveedor de identidad, Discovery persistence ni cambios a `/workspace`.
- Sin Audit Event persistente hasta que la fase de datos y proveedor estén aprobados.

## Próxima decisión necesaria

Elegir proveedor de identidad y detalles de PostgreSQL mediante RFC específico. Su implementación deberá adaptar los puertos existentes, no introducir SDKs directamente en dominios de KYRUMA.
