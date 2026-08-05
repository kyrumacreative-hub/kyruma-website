# Domain Module Template

Esta plantilla es una estructura vacía para un dominio funcional aprobado. No contiene lógica de negocio, rutas, UI, persistencia ni dependencias.

## Uso

1. Confirmar que existe una Product Specification aprobada.
2. Copiar esta carpeta a `src/features/<domain>/`.
3. Renombrar las carpetas vacías y crear solo los archivos exigidos por la especificación.
4. Completar `DOMAIN_ACCEPTANCE_CHECKLIST.md` antes de solicitar la aceptación del dominio.

## Estructura prevista

```text
<domain>/
  domain/          # tipos, reglas puras, estados, errores, eventos
  application/     # casos de uso y servicios
  ports/           # contratos de persistencia e integración
  tests/           # pruebas del dominio y de aplicación
  docs/            # decisiones y operación específicas del dominio
```

Un directorio `adapters/` solo se crea cuando un adaptador concreto ha sido aprobado. La carpeta no debe contener acceso directo a datos ni proveedores hasta ese momento.

## Requisitos al completarla

- Contexto recibido mediante `ResolvedPartnerContext` cuando el dominio sea scoped.
- Capability declarada y `requireContextAccess` en cada caso de uso protegido.
- Repository Port y contratos de eventos antes de elegir infraestructura.
- Audit y Timeline separados, según Product Specification.
- Errores tipados y pruebas de aislamiento de contexto.

La guía completa está en `DOMAIN_IMPLEMENTATION_GUIDE.md`.
