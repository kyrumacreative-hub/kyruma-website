# KYRUMA MATCH v1

KYRUMA MATCH es el recomendador conversacional previsto para diagnosticar una necesidad y dirigirla a KYRUMA EXPRESS o KYRUMA Discovery.

## Estado

No activado. Faltan `TELEGRAM_BOT_TOKEN` y `TELEGRAM_WEBHOOK_SECRET` configurados como secretos cifrados en Vercel. No deben compartirse en chat, documentación ni repositorio.

## Activación segura

1. Añadir ambos secretos en Vercel para Production y Preview según corresponda.
2. Desplegar y verificar `POST /api/telegram/webhook` con validación del encabezado secreto.
3. Registrar `https://www.kyruma.com/api/telegram/webhook` en Telegram.
4. Probar el bot real y comprobar errores/pending updates antes de anunciarlo.

No se cobra dentro de Telegram en v1.
