# KYRUMA OS™ — Context Model

## Flujo de resolución

```mermaid
flowchart LR
  A[Authenticated Actor] --> B[Partner public ID KYR-XXX]
  B --> C[PartnerContextRepository]
  C --> D[Organization + Partner + Workspaces]
  D --> E[Workspace Resolver]
  E --> F[Membership Resolver]
  F --> G[Capabilities + visibility]
  G --> H[ResolvedPartnerContext]
  H --> I[Context Guard / future domain module]
```

`PartnerContextProvider.resolve(actor, selection)` es la frontera única de resolución. El puerto recibe un `KYR-XXX` validado; la clave técnica permanece dentro del contexto del servidor. `contextKey` es un detalle interno de invalidación y no se serializa ni se usa como autorización.

## Ciclo de vida

1. El actor autenticado solicita un Partner por `KYR-XXX`.
2. El repositorio obtiene el registro de contexto sin exponer su clave interna.
3. El Workspace Resolver usa una selección interna explícita, un Workspace principal configurado o un único Workspace; si hay ambigüedad falla de forma segura.
4. El Membership Resolver exige una Membership activa con `partner.read` y `workspace.read` en el mismo ámbito.
5. Se construye un contexto inmutable para el consumidor.
6. El Context Guard vuelve a verificar capacidad, ámbito y visibilidad al ejecutar una acción.

## Reglas de seguridad

- Sin `organizationId` scoped no existe acceso de contexto, salvo Membership de plataforma explícita.
- Partner y Viewer no obtienen recursos `internal`, incluso cuando poseen una capacidad de lectura compartida.
- Partner Context no activa acceso externo: un Workspace `internal` o `external_disabled` solo puede resolverse para personal interno autorizado.
- `contextKey` identifica un contexto para invalidación, no es una credencial ni se expone como autorización.
- Un futuro módulo recibe el contexto ya resuelto; no puede consultar Partner/Workspace/Membership por su cuenta.

## Decisiones pendientes

- Proveedor y modelo de PostgreSQL.
- Identificador público o UX de selección para múltiples Workspaces.
- Fuente de sesión y adaptación de `IdentityProvider`.
- Persistencia y retención de Audit Events de resolución/denegación.
