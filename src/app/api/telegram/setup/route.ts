import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TELEGRAM_API = "https://api.telegram.org";

function validSecret(received: string | null, expected: string) {
  const left = Buffer.from(received ?? "", "utf8");
  const right = Buffer.from(expected, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

async function telegram(token: string, method: string, body: Record<string, unknown> = {}) {
  const response = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  });
  const payload = await response.json() as { ok?: boolean; result?: Record<string, unknown>; description?: string };
  if (!response.ok || !payload.ok) throw new Error(payload.description ?? `TELEGRAM_${method.toUpperCase()}_FAILED`);
  return payload.result ?? {};
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const setupSecret = process.env.TELEGRAM_SETUP_SECRET;
  if (!token || !webhookSecret || !setupSecret) return NextResponse.json({ ok: false }, { status: 503 });
  if (!validSecret(request.headers.get("x-kyruma-setup-secret"), setupSecret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const bot = await telegram(token, "getMe");
    await telegram(token, "setMyName", { name: "KYRUMA" });
    await telegram(token, "setMyDescription", {
      description: "KYRUMA MATCH analiza lo que necesita tu marca y te recomienda la solución adecuada: KYRUMA EXPRESS o KYRUMA Discovery.",
    });
    await telegram(token, "setMyShortDescription", {
      short_description: "Diagnóstico y recomendación para marcas y negocios.",
    });
    await telegram(token, "setMyCommands", {
      commands: [
        { command: "start", description: "Abrir KYRUMA MATCH" },
        { command: "check", description: "Diagnosticar mi necesidad" },
        { command: "solutions", description: "Ver soluciones" },
        { command: "order", description: "Ayuda con un pedido" },
        { command: "support", description: "Contactar con soporte" },
        { command: "privacy", description: "Privacidad y uso de datos" },
      ],
    });
    await telegram(token, "setWebhook", {
      url: "https://www.kyruma.com/api/telegram/webhook",
      secret_token: webhookSecret,
      allowed_updates: ["message", "callback_query"],
    });
    const webhook = await telegram(token, "getWebhookInfo");
    return NextResponse.json({
      ok: true,
      bot: { id: bot.id, username: bot.username, name: bot.first_name },
      webhook: {
        url: webhook.url,
        pendingUpdateCount: webhook.pending_update_count,
        lastErrorMessage: webhook.last_error_message ?? null,
        allowedUpdates: webhook.allowed_updates,
      },
    });
  } catch (error) {
    console.error("TELEGRAM_SETUP_FAILED", error instanceof Error ? error.message : "UNKNOWN");
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
