# KYRUMA OS™ — Security and Privacy Architecture

**Estado:** Propuesta técnica, no declaración de cumplimiento legal.

## Controles de diseño

| Área | Control propuesto | Dependencia / límite |
| --- | --- | --- |
| Aislamiento | `organizationId` y `workspaceId` obligatorios, autorización servidor y filtros en repositorio | Revisar con pruebas de aislamiento. |
| Identidad | Proveedor gestionado, cookies seguras, MFA/SSO según necesidad | Proveedor y política pendientes. |
| Autorización | Capacidades con ámbito, mínimo privilegio, denegar por defecto | Matriz real de negocio pendiente. |
| Secretos | Gestor de variables por entorno; nunca repositorio, cliente o logs | Rotación y responsables pendientes. |
| PII | Minimización, clasificación, redacción en logs y exportación controlada | Base legal y retención requieren asesoría jurídica. |
| Archivos | Validar tipo/tamaño, cuarentena y URLs firmadas temporales | Escaneo antimalware por definir. |
| Enlaces | Tokens aleatorios, expiración, audiencia, revocación y audit log | No usar slugs como secretos. |
| Auditoría | Eventos inmutables de accesos/cambios sensibles | Retención y acceso de emergencia pendientes. |
| Cifrado | TLS y cifrado en reposo del proveedor; evaluar campo a campo | Gestión de claves por decidir. |
| Consentimiento | Marketing separado de operación; consentimientos con finalidad | Política legal y UI detallada futuras. |

## Amenazas principales

1. **Acceso cruzado entre clientes:** mitigar con autorización de servidor, tests de tenant isolation y 404 seguro.
2. **Enlace compartido indebidamente:** token revocable, expiración, audiencia y sin datos sensibles en URL.
3. **Exfiltración por archivos:** ACL previa a descarga, URL firmada, validación y auditoría.
4. **Prompt/IA con información confidencial:** Intelligence futura opera con fuente, clasificación, revisión humana y proveedor aprobado; no usar datos sin acuerdo.
5. **Fuga en logs/analítica:** contratos de redacción, revisión de logs y consentimiento separado.
6. **Acciones administrativas abusivas:** mínimo privilegio, MFA si proveedor permite, doble revisión para exportaciones y Audit Event.

## Retención, eliminación y portabilidad

Definir por categoría antes de almacenar datos operativos: plazo, base de retención, responsable, proceso de borrado/anonimización, backup y exportación. Un soft delete no equivale a eliminación; la propagación a archivos, búsqueda, caché y backups debe documentarse. KYRUMA debe obtener revisión jurídica aplicable antes de afirmar RGPD u otro cumplimiento.
