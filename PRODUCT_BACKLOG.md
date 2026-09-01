# KYRUMA Product Backlog

Este documento es la fuente única de prioridades del producto. Las ideas se registran aquí antes de convertirse en desarrollo.

## NOW — Platform Experience Program

### KYRUMA RADAR / OS / AI — INTERNAL VALIDATION

- Consolidar RADAR como registro operativo con estados e historial de decisiones.
- Añadir Brain global, Client Brain y Project Context con Strategy, Brand y Content DNA aislados por Workspace/Project.
- Exponer una sola interfaz KYRUMA AI que prepare contexto y workflows con revisión humana obligatoria.
- Preparar Hook Library, performance sin datos inventados, siete Content Workflows y Opportunity Calendar.
- Registrar seis Visual Recipes sin exponer ni inventar prompts maestros.
- Medir fricciones operativas antes de construir nuevas features.
- Mantener solo integraciones verificadas; no simular Gmail, Calendar, Metricool, WhatsApp o n8n.

Productized Services permanece como experimento WATCH. Video Agent, SEO Engine, Omnichannel Messaging, orchestration avanzada, Parallel Agents, Async Jobs, AI Control Center, creator campaigns, social commerce, SaaS comercial y portal complejo permanecen en BACKLOG.

### Cierre integral técnico — ACTIVE

- Conectar el formulario público con el ciclo operativo Lead → Discovery → Qualification.
- Materializar tareas idempotentes desde Event Bus y operar el pilotaje de KYR-001 desde una vista interna.
- Exponer la cola de KYRUMA AI con revisión humana obligatoria; ningún output de IA se activa automáticamente.
- Mantener Legal y Commercial Dry Run como gates externos explícitos, nunca inferidos desde evidencia técnica.
- Operar KYR-002 — Magic By Whyso como cliente real activo con Partner, Workspace y proyecto principal; los datos de validación técnica permanecen aislados en TEST y sin PII inventada.
- Mostrar salud del Event Bus y clientes KYR-001/KYR-002 desde Operations Hub.
- Operar KYR-003 — Raúl Marqués de la Torre como cliente real activo para web, marca y RRSS, con representación técnica segura en TEST y caso público basado solo en evidencia verificable.

El cierre integral es el único objetivo activo y reutiliza los gates de Platform ya aprobados.

### KYR-002 · Magic By Whyso — ACTIVE

- Registrar a Magic By Whyso como cliente real activo en el flujo Lead → Discovery → Qualification → Partner `KYR-002` → Workspace → Project.
- Ejecutar el aprovisionamiento únicamente contra la base TEST protegida hasta que exista una ventana de producción autorizada.
- Mostrar KYR-002 en el Centro de Operación y mantener separados los estados técnicos, Commercial y Legal.
- Publicar un caso ligero y bilingüe basado solo en hechos disponibles: Discovery recibido, materiales de identidad y referencias, dirección creativa y experiencia web en curso.
- Mantener una fuente de datos escalable para futuros casos `KYR-003+` y no publicar métricas ni resultados todavía no verificados.

Este bloque queda autorizado explícitamente como parte del objetivo activo de cierre operativo de KYR-002.

### KYR-003 · Raúl Marqués de la Torre — ACTIVE

- Registrar el flujo Lead → Discovery → Qualification → Partner `KYR-003` → Workspace → Project principal para web, marca y redes sociales.
- Ejecutar el aprovisionamiento únicamente contra la base TEST protegida y sin persistir PII en la representación técnica.
- Mostrar KYR-003 en el Centro de Operación y conectar el Workspace con el slug público `raul-marques-de-la-torre`.
- Publicar un caso bilingüe basado en hechos verificables: identidad RMT activa, web editorial publicada y canales sociales conectados.
- Mantener separados los gates Commercial y Legal y no publicar métricas, testimonios o impacto todavía no verificados.

Este bloque queda autorizado explícitamente como cliente activo y parte del objetivo operativo actual.

### Platform Experience activation gates — SUBGATE

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

- Validar por separado los artefactos comerciales de KYR-002; no existe ni se autoriza una pasarela de pago.
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
