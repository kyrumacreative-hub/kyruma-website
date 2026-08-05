# KYRUMA OS™ — Engineering Conventions

## Alcance

Estas convenciones aplican a futuros dominios de KYRUMA OS™. La web pública y KYRUMA Discovery™ permanecen fuera de su alcance salvo aprobación expresa.

## Fronteras

- Un dominio es propietario de sus tipos, reglas y transiciones.
- La aplicación orquesta casos de uso; no duplica reglas puras.
- Los puertos definen contratos; los adaptadores contienen detalles de infraestructura.
- Ningún dominio accede a otro dominio internamente. La colaboración ocurre mediante contratos o eventos aprobados.
- La Foundation se consume mediante sus APIs públicas: Context, Capabilities y Membership. No se replica ni se modifica para acomodar un dominio.

## Contexto y autorización

- Toda lectura o mutación de ámbito Partner/Workspace recibe `ResolvedPartnerContext` de forma explícita.
- Cada caso de uso declara una Capability; los roles no se comprueban directamente.
- Se usa `requireContextAccess` en servidor antes de acceder a recursos.
- Los IDs internos no se exponen en rutas ni se usan como sustituto de autorización. La selección pública de Partner usa `KYR-XXX`.
- La visibilidad se trata como una condición adicional a la Capability.

## Nombres y tipos

- Carpetas: `kebab-case`; archivos TypeScript: `camelCase.ts`.
- Tipos, clases y errores: `PascalCase`; valores, funciones y propiedades: `camelCase`.
- Los tipos de entrada y salida se nombran por intención (`CreateLeadInput`, `LeadSummary`), no por capa técnica.
- Los eventos se nombran en pasado (`LeadCreated`); las capacidades, por recurso y acción (`lead.create`).
- No usar `any`, casts para ignorar el compilador ni objetos anónimos como contratos públicos.

## Estado y persistencia

- Las transiciones de estado se expresan como reglas explícitas y se prueban.
- Un Repository Port no expone consultas genéricas que filtren reglas de ámbito. Los métodos reciben el ámbito requerido o un contexto derivado y devuelven tipos del dominio.
- PostgreSQL es el motor lógico aprobado, pero ningún dominio depende de un proveedor de infraestructura concreto.
- Datos sensibles, retención, archivado, exportación y eliminación requieren definición en su Product Specification.

## Eventos, Audit y Timeline

- Un Domain Event describe un hecho confirmado, tiene versión y payload mínimo.
- Audit registra seguridad y trazabilidad; Timeline es una proyección de producto. Son canales distintos.
- Ningún consumidor crítico se presupone síncrono. Cuando exista un efecto externo, se definirá entrega fiable e idempotencia según TD-005.

## Dependencias y cambios

- No añadir dependencias sin una decisión técnica documentada y una alternativa evaluada.
- Un cambio en Foundation requiere evidencia de bug, vulnerabilidad o incompatibilidad demostrada por un dominio aprobado.
- No introducir rutas, UI ni automatizaciones como parte de un módulo de dominio si su especificación no las incluye.
- Cada cambio mantiene lint, TypeScript, build y las pruebas aplicables en verde.
