# KYRUMA Product Backlog

Este documento es la fuente única de prioridades del producto. Las ideas se registran aquí antes de convertirse en desarrollo.

## NOW — Cierre v1.0

Solo puede haber un objetivo activo.

### Gates externos de release

- Completar el alta de Microsoft Clarity aceptando sus Condiciones de Uso y publicar su identificador real.
- Iniciar sesión en Meta Business Manager, crear o seleccionar el dataset/pixel de KYRUMA y emitir una credencial CAPI real.
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

### PS-009 Event Bus™

Completado con especificación Product, RFC-018/019/020, PostgreSQL Transactional Outbox, dispatcher interno, entrega at-least-once, idempotencia, retries y recuperación de dead letters. Véase `ENGINEERING_FINAL_REPORT_PS-009.md`.

## Regla de trabajo

Ninguna idea se desarrolla directamente. Toda idea pasa primero al Product Backlog con prioridad **NOW**, **NEXT**, **READY** o **IDEAS**. Solo se implementa el trabajo situado en **NOW**.
