# Marketing Foundation v1

KYRUMA centraliza las etiquetas de medición en Google Tag Manager (GTM). La aplicación no carga GTM, Meta Pixel ni Microsoft Clarity hasta que la persona acepta las cookies analíticas.

## Componentes

- **GTM:** punto único de gestión para Google Analytics 4 y futuras etiquetas.
- **Meta Pixel:** eventos de navegador para PageView, ViewContent, Contact, Lead, Schedule, StartDiscovery y CompleteRegistration.
- **Meta Conversion API:** eventos de servidor de Lead y CompleteDiscovery, con el email cifrado mediante SHA-256 y solo tras consentimiento.
- **Microsoft Clarity:** se carga de forma diferida tras consentimiento.
- **Atribución:** conserva el origen, UTM, referencia y primera página visitada en el navegador después del consentimiento.
- **SEO técnico:** `robots.txt` y `sitemap.xml` se sirven desde rutas de Next.js; la verificación de Search Console se declara mediante variable de entorno.

## Límites intencionados

- Las credenciales de GTM, Meta, Clarity y Search Console no se incluyen en el repositorio.
- La activación y validación de las plataformas externas requiere sus identificadores reales y acceso a sus paneles.
- TikTok se muestra en el footer cuando se configure `NEXT_PUBLIC_TIKTOK_URL`; no se ha inventado una cuenta pública.

## Privacidad

No se ejecuta ningún script de marketing antes de aceptar las cookies analíticas. Si no hay consentimiento, tampoco se persiste la atribución ni se remiten eventos a Meta Conversion API.
