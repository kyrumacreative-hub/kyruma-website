# KYRUMA OS™ — Domain Acceptance Checklist

Completar este checklist para cada dominio aprobado. La aprobación del checklist no fusiona, despliega ni activa el dominio de forma automática.

## Producto y límites

- [ ] Existe Product Specification/RFC aprobado con propósito y propietario.
- [ ] Estados, transiciones y criterios de aceptación están definidos.
- [ ] El dominio declara qué queda fuera de alcance.
- [ ] No modifica la web pública ni KYRUMA Discovery™ sin autorización explícita.

## Foundation

- [ ] Cada caso de uso scoped recibe `ResolvedPartnerContext`.
- [ ] No resuelve User, Membership, Partner ni Workspace por su cuenta.
- [ ] Cada acción protegida declara Capability y usa Context Guard en servidor.
- [ ] La visibilidad se verifica además de la Capability.
- [ ] El switching de Partner no reutiliza datos, caché ni permisos del contexto anterior.

## Dominio y datos

- [ ] Reglas, tipos, errores y eventos pertenecen al propio dominio.
- [ ] Persistence se accede únicamente mediante Repository Ports.
- [ ] La clasificación de datos, retención, archivado, exportación y eliminación están definidos o bloquean la activación.
- [ ] No se exponen identificadores internos ni datos de otro Partner.

## Eventos, Audit y Timeline

- [ ] Los Domain Events representan hechos confirmados, con versión y payload mínimo.
- [ ] Los efectos críticos consideran idempotencia y el patrón de entrega aprobado.
- [ ] Audit está definido como registro independiente de seguridad/trazabilidad.
- [ ] Timeline está definido solo para hechos útiles de producto y separado de Audit.

## Calidad

- [ ] Pruebas cubren reglas, transiciones y validación.
- [ ] Pruebas cubren permisos, Membership revocada, contexto equivocado y visibilidad.
- [ ] Pruebas cubren emisión de evento solo tras confirmación.
- [ ] Fixtures son sintéticos y no incluyen secretos ni datos personales reales.
- [ ] Las zonas sin pruebas están justificadas, con riesgo y prueba planificada.
- [ ] Los errores externos son seguros y no filtran detalles de infraestructura.

## Documentación y operación

- [ ] La documentación del dominio enlaza con los contratos de Context, Capability y eventos que usa.
- [ ] La estrategia de rollback está definida y es verificable.
- [ ] Dependencias nuevas, si existen, están justificadas y aprobadas.
- [ ] Se documentan métricas u observabilidad requeridas sin incorporar analítica no autorizada.

## Gates de entrega

- [ ] `npm run test:foundation` permanece en verde.
- [ ] Se ejecuta la suite propia del dominio cuando exista.
- [ ] Lint, TypeScript y build permanecen en verde.
- [ ] Se revisa que no se haya modificado Foundation sin una causa permitida.
- [ ] Un responsable de producto y uno técnico aprueban la activación.
