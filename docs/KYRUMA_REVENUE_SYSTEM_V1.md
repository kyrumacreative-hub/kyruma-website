# KYRUMA Revenue System v1

## Arquitectura

Tráfico → KYRUMA EXPRESS → Shopify → transferencia bancaria → verificación del pago → brief → producción → entrega → siguiente paso opcional.

La web explica; Shopify gestiona catálogo y checkout; Resend entrega emails; la infraestructura de consentimiento controla GTM, GA4, Meta y Clarity; Operations conserva el ownership del pago, activación y entrega.

## Variables

- Existentes: `RESEND_API_KEY`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`, `FORM_RATE_LIMIT_SECRET`, `APP_URL`.
- Futuras para Match: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`.

## Rollback

- Web: revertir la release/commit de Revenue System.
- Shopify: cambiar KX-001 a borrador sin eliminarlo.
- Tracking: retirar identificadores públicos o desactivar el contenedor correspondiente.
- Telegram futuro: eliminar el webhook antes de retirar el endpoint.

## Limitaciones conocidas

- La compra requiere verificación manual de transferencia.
- Founding 20 permanece oculto hasta existir recuento fiable de pedidos pagados.
- La política contractual, fiscal, desistimiento y reembolso requiere aprobación jurídica antes de considerarse definitiva.
- KYRUMA MATCH no se declara live hasta disponer de secretos y QA real de Telegram.
