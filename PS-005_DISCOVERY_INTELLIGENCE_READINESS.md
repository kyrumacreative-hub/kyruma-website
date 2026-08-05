# PS-005 Discovery Intelligence™ — Product Readiness

## Estado

**NOT READY FOR ENGINEERING**

## Completado

- Objetivo, alcance y límites del dominio.
- Aggregate, entidades, estados, Value Objects y eventos.
- Casos de uso, contratos, modelo de datos y criterios de aceptación.
- Prohibición explícita de acciones autónomas y de mutación de datos fuente.

## Bloqueos para Technical Approval

1. Definir contexto y autorización para Discovery pre‑Partner y post‑Partner.
2. Aprobar catálogo y matriz de capacidades `intelligence.*`.
3. Aprobar proveedor/modelo, región, tratamiento de PII, retención y uso de datos.
4. Aprobar contrato de snapshot, salida estructurada, idempotencia y reconciliación de llamadas al modelo.
5. Resolver cómo se aplican Audit, Timeline y Transactional Outbox a una llamada de modelo potencialmente no transaccional.

## Recomendación

Abrir Technical Review y RFCs. No iniciar Engineering hasta que los RFCs estén aprobados y este documento cambie a **READY FOR ENGINEERING**.
