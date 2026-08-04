# Deployment guide — Marketing Foundation v1

## 1. Configurar producción

Copiar `.env.example` a la configuración de variables del proveedor de despliegue y completar:

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_META_PIXEL_ID` y `META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN` y `META_CAPI_API_VERSION`
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `GOOGLE_SITE_VERIFICATION`
- Las URLs públicas de redes sociales, incluida `NEXT_PUBLIC_TIKTOK_URL` cuando esté disponible.

No exponer `META_CAPI_ACCESS_TOKEN` en variables `NEXT_PUBLIC_*`.

## 2. Configurar GTM y GA4

1. Crear el contenedor web de GTM y publicar su identificador como `NEXT_PUBLIC_GTM_ID`.
2. Añadir dentro de GTM la etiqueta de configuración de GA4 con el ID de medición de KYRUMA.
3. Crear triggers para los nombres indicados en `ANALYTICS_EVENTS.md`.
4. Usar Preview y GA4 DebugView para verificar los eventos antes de publicar el contenedor.

## 3. Configurar Meta

1. Añadir el Pixel ID y crear un token de Conversion API con permisos mínimos.
2. Verificar en Events Manager `PageView`, `ViewContent`, `Contact`, `Lead`, `ScheduleMeeting`, `StartDiscovery` y `CompleteDiscovery`.
3. Activar deduplicación mediante `event_id` si se añade una capa de servidor que envíe los mismos eventos que el navegador.

## 4. Configurar Search Console y Clarity

1. Añadir la verificación de Google Search Console como `GOOGLE_SITE_VERIFICATION` y solicitar la indexación de `https://kyruma.com/sitemap.xml`.
2. Crear un proyecto de Clarity, añadir su Project ID y validar una sesión después de aceptar cookies.

## 5. Validación de lanzamiento

- Confirmar que rechazar cookies no carga GTM, Meta ni Clarity.
- Confirmar que aceptar cookies habilita las etiquetas y mantiene la navegación sin errores.
- Revisar GTM Preview, GA4 DebugView, Meta Pixel Helper, Events Manager y Clarity con datos reales de prueba.
- Ejecutar Lighthouse sobre las rutas pública, estrategia y Discovery.

Las últimas comprobaciones dependen de identificadores, cuentas y herramientas externas de KYRUMA; no se pueden certificar sin esas credenciales.
