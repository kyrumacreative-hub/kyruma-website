# KYRUMA OS™ — Error Handling Standard

## Objetivo

Los errores deben ser seguros para la persona usuaria, útiles para operación y consistentes entre dominios. Ningún mensaje revela IDs internos, pertenencias, permisos, configuración ni datos de otro Partner.

## Taxonomía

| Categoría | Uso | Respuesta externa |
| --- | --- | --- |
| `ValidationError` | entrada inválida o incompleta | indicar qué debe corregirse, sin detalles internos |
| `AuthorizationError` | Capability, Membership, ámbito o visibilidad insuficiente | denegar de forma segura |
| `NotFoundError` | recurso inexistente o no visible | respuesta indistinguible cuando evita enumeración |
| `ConflictError` | versión, estado o transición incompatible | explicar el conflicto de negocio permitido |
| `UnavailableError` | dependencia aprobada temporalmente no disponible | mensaje recuperable y reintento controlado |
| `UnexpectedError` | fallo no previsto | mensaje genérico; registrar diagnóstico interno |

## Reglas

- Los errores del dominio son tipos explícitos con un código estable y metadatos internos mínimos.
- Los servicios lanzan o devuelven errores del dominio; las fronteras de servidor los traducen a la respuesta de transporte aprobada.
- No propagar errores crudos de base de datos, red, proveedor de identidad o token hacia clientes.
- Un intento de acceso denegado se registra mediante el futuro puerto de Audit; no se convierte automáticamente en Timeline.
- Los eventos de dominio no se publican si falla la transición o la persistencia.
- Los reintentos se permiten solo cuando la operación es idempotente y la especificación lo declara.

## Observabilidad y privacidad

Los registros incluyen código de error, correlación, actor pseudonimizado cuando corresponda y ámbito técnico mínimo. No incluyen respuestas completas del Discovery, secretos, credenciales ni información personal no necesaria. La retención exacta se decidirá con asesoramiento jurídico conforme a la política aprobada de archivar antes que eliminar.

## Ejemplo de frontera

```text
input -> validar -> autorizar -> caso de uso
                         |          |
                         v          v
                    Audit seguro  error tipado
                                      |
                                      v
                          respuesta externa sin detalle interno
```

La adaptación a HTTP, Server Actions o colas se decide cuando exista la interfaz concreta; este estándar no introduce una capa de transporte.
