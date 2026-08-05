# Foundation Phase 2 — Partner Context

**Estado:** Implementación inicial autorizada. No crea rutas, pantallas ni datos persistidos.

## Objetivo alcanzado

La infraestructura entrega a futuros casos de uso un único `ResolvedPartnerContext` que contiene:

- User autenticado;
- Membership activa y seleccionada;
- Organization;
- Partner resuelto por `KYR-XXX`;
- Workspace resuelto;
- capacidades efectivas;
- visibilidades permitidas.

Ningún consumidor necesita conocer repositorio, resolución de Membership ni reglas de switching. La arquitectura no ofrece contexto global mutable: cada petición o consumidor conserva explícitamente su contexto, evitando fugas entre Partners.

## Componentes implementados

| Componente | Responsabilidad |
| --- | --- |
| `PartnerContextRepository` | Puerto de lectura futura desde PostgreSQL por Partner public ID. |
| `DefaultPartnerContextProvider` | Resuelve Partner, Workspace y Membership; calcula capacidades y emite eventos de resolución. |
| `WorkspaceContextProvider` | Expone el Workspace ya resuelto sin repetir la lógica de selección. |
| `requireContextAccess` | Guard de servidor que combina Context + Capabilities + Membership + visibilidad. |
| `switchPartnerContext` | Resuelve nuevo contexto, devuelve la clave anterior a invalidar y emite el cambio. |
| `ContextEventPublisher` | Puerto sin consumidores de negocio en esta fase. |
| `OrganizationContextProvider` | Resuelve el contexto pre-Partner por Organization sin requerir Partner ni Workspace. |
| `requireOrganizationContextAccess` | Guard de servidor para Capability, Membership, scope y visibilidad en recursos pre-Partner. |

## No incluido

- Base de datos, migraciones, proveedor de login, sesiones reales o selector visual.
- Rutas `/os`, APIs, Dashboard, Discovery persistence, Timeline o portal.
- Cambios a la web pública, `/workspace`, APIs existentes o Marketing Foundation.

## Próximas dependencias

Para conectar este núcleo se necesita un RFC de proveedor de identidad, PostgreSQL y definición de la primera ruta interna protegida. La selección pública de Workspace queda pendiente de aprobar un identificador de navegación que no exponga IDs internos.
