# KYRUMA Product Backlog

Este documento es la fuente única de prioridades del producto. Las ideas se registran aquí antes de convertirse en desarrollo.

## NOW — Platform Experience Program

Solo puede haber un objetivo activo. La secuencia aprobada es PS-010 → PS-011 → PS-012; cada PS debe cerrar sus gates antes de activar el siguiente.

### PS-010 — Identity / Access Experience — ACTIVE

- Login, sesiones y recuperación mediante proveedor de identidad real.
- Invitaciones, acceso de usuarios y enlace canónico con Foundation Membership.

### PS-011 — Client / Partner Portal — QUEUED

- Acceso Partner, Workspace visible, información compartida, actividad y entregables.

### PS-012 — Automations / Intelligence Layer — QUEUED

- Automatizaciones, triggers, acciones, Event Bus y frontera futura de KYRUMA Intelligence™.

### Gates externos de release

- Ejecutar el tramo comercial TEST de KYR-002 con contrato y cobro de prueba en los sistemas externos correspondientes.
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
