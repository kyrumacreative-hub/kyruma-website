# RFC-001 — Pre-Partner Context

**Estado:** Draft  
**Origen:** Technical Review PS-004 Phase 2  
**Decisión requerida antes de:** EP-004 Lead Lifecycle

## Problema

`ResolvedPartnerContext` exige Partner y Workspace. Lead Lifecycle comienza antes de que exista un Partner, por lo que no puede usar ese contexto sin falsear el ámbito o crear una ruta de autorización paralela.

## Objetivo

Definir un contexto explícito y autorizado para recursos pre-Partner, conservando el principio de Foundation: ninguna petición accede a un recurso sin User, Membership, Organization y ámbito explícitos.

## Opciones

1. Extender Foundation con un `ResolvedOrganizationContext` pre-Partner.
2. Definir un contexto de plataforma limitado a personal interno, con Organization explícita por recurso.
3. Resolver Lead sin contexto común.

La opción 3 contradice Foundation y se descarta.

## Decisiones pendientes

- Qué Organization representa la organización interna de KYRUMA.
- Qué campos y visibilidades componen el contexto pre-Partner.
- Cómo conviven el contexto pre-Partner y `ResolvedPartnerContext` tras crear Partner.
- Política de switching e invalidación para un Lead sin Partner.

## Criterios de aceptación

- No se reutiliza un Partner ficticio ni un Workspace ficticio.
- Las Memberships activas y el ámbito se verifican en servidor.
- La API pública del contexto permite evolucionar a Partner sin fuga de permisos.
- Existen pruebas de aislamiento, revocación y switching.

## Impacto y rollback

Requiere RFC aprobado antes de tocar Foundation. El cambio debe ser aditivo, sin alterar `/workspace`, web pública ni el contexto de Partners existentes. Rollback: retirar el nuevo provider sin cambiar los contratos actuales.
