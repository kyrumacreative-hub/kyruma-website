# KYRUMA Product Backlog

Este documento es la fuente única de prioridades del producto. Las ideas se registran aquí antes de convertirse en desarrollo.

## NOW — Platform Experience Program

Solo puede haber un objetivo activo. La secuencia aprobada es PS-010 → PS-011 → PS-012; cada PS debe cerrar sus gates antes de activar el siguiente.

### Platform Experience activation gates — ACTIVE

- Blindar los claims del Event Bus con `FOR UPDATE SKIP LOCKED`, leases con fencing y regresión PostgreSQL antes de conectar nuevos flujos de Platform.
- Provisionar Clerk y sus variables seguras.
- Aplicar la migración en staging y ejecutar la regresión PostgreSQL.
- Completar smoke real de login, recuperación, invitación, aislamiento de Portal y logout.
- Reparar la entrada de administradores internos y habilitar el aprovisionamiento
  controlado del primer Partner/Workspace real desde Platform.
- Endurecer la validación de recursos externos contra dominios impostores y
  mostrar la identidad operativa del owner en la administración de Workspaces.
- Permitir que Operations añada o actualice los recursos oficiales de Figma y
  Google Drive en Workspaces existentes sin generar enlaces duplicados.

### Gates externos de release

- Aportar y ejecutar los artefactos comerciales externos de KYR-002 como `TEST ONLY — BANK TRANSFER`; no existe ni se autoriza una pasarela de pago.
- Obtener la revisión jurídica del contrato antes de activar el primer cliente comercial real.

No hay desarrollo de producto autorizado en este bloque. Solo configuración real, validación y cierre.

## NEXT — Congelado hasta cerrar v1.0

No iniciar nuevas capacidades.

## READY

### Lead Intake Flow

Unificar todos los canales de captación. El contacto recibe una confirmación con invitación a KYRUMA Discovery™; el lead pasa a **Pendiente de Discovery** y, al completar el Discovery, a **Discovery Completado**. Debe quedar preparado para recordatorios, CRM y seguimiento sin cambiar el flujo.

## IDEAS

### Lead Lifecycle

`Visitante → Lead → Discovery → Reunión → Propuesta → Partner → Proyecto → Mantenimiento`

### Client Portal

Transformar el Discovery en el portal del cliente al aceptar una propuesta, sin cambiar de plataforma.

### Automation Engine

Automatizar emails, recordatorios, seguimiento, estados, onboarding y entregas.

### Otras oportunidades

- Portal del Partner.
- Aplicación móvil.
- Panel de IA.
- Dashboard CEO.
- Benchmark automático.

## COMPLETED

### PS-010 — Identity / Access Experience

Engineering completo con Clerk, sesiones, recuperación, invitaciones hash-only y Foundation Membership.

### PS-011 — Client / Partner Portal

Engineering completo con Portal protegido, Workspace visible, información compartida, actividad y entregables versionados.

### PS-012 — Automations / Intelligence Layer

Engineering completo con triggers Event Bus, runs idempotentes, acciones allowlisted y frontera Intelligence con revisión humana.

### KYRUMA Website — Final Production Closure

Contacto oficial, metadata de Strategy, rutas públicas vacías, sitemap y dependencias cerrados en producción. Regresión técnica, visual ES/EN, consentimiento, Vercel y smoke real completados. El alcance Website queda congelado; los gates comercial TEST de KYR-002 y jurídico son externos y no constituyen trabajo técnico pendiente de Website.

### Operations Hub v1

Integrado en `main` con referencia canónica Project → Drive, aislamiento por Organization/Partner/Workspace, idempotencia y retry seguro. Smoke real KYR-002 y regresión PostgreSQL completados.

### Marketing Foundation — Google

GTM y GA4 activados con identificadores reales. Google Search Console verificado. Consentimiento rechazado y aceptado comprobado en producción; el usuario puede retirar o modificar su elección desde la Política de Cookies.

### Marketing Foundation — Meta

Dataset `KYRUMA Website` y Pixel real `1358716683085197` configurados en `KYRUMA Creative Studio`. Pixel y CAPI activos mediante variables cifradas de Vercel. Evento CAPI de prueba recibido y procesado por Meta; coincidencias avanzadas automáticas permanecen desactivadas.

### Marketing Foundation — Microsoft Clarity

Proyecto `KYRUMA Website` (`y2t8lszmb3`) creado para `www.kyruma.com`, activado en Vercel y validado en producción. Las comunicaciones promocionales opcionales permanecen desactivadas.

### PS-009 Event Bus™

Completado con especificación Product, RFC-018/019/020, PostgreSQL Transactional Outbox, dispatcher interno, entrega at-least-once, idempotencia, retries y recuperación de dead letters. Véase `ENGINEERING_FINAL_REPORT_PS-009.md`.

## Regla de trabajo

Ninguna idea se desarrolla directamente. Toda idea pasa primero al Product Backlog con prioridad **NOW**, **NEXT**, **READY** o **IDEAS**. Solo se implementa el trabajo situado en **NOW**.
