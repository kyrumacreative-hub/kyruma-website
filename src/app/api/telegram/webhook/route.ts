import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { handleTelegramUpdate, type TelegramUpdate } from "@/features/telegram/handler";
import { readLimitedJson, PublicRequestError } from "@/features/security/server/publicRequestPolicy";

export const runtime = "nodejs";
const TELEGRAM_API = "https://api.telegram.org";

function validSecret(received: string | null, expected: string) {
  const left = Buffer.from(received ?? "", "utf8");
  const right = Buffer.from(expected, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

async function telegram(token: string, method: string, body: Record<string, unknown>) {
  const response = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`TELEGRAM_${method.toUpperCase()}_FAILED`);
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret || secret.length < 32) return NextResponse.json({ ok: false }, { status: 503 });
  if (!validSecret(request.headers.get("x-telegram-bot-api-secret-token"), secret)) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const update = await readLimitedJson(request, 128 * 1024) as TelegramUpdate;
    const action = handleTelegramUpdate(update);
    if (!action) return NextResponse.json({ ok: true });
    const replyMarkup = action.reply.keyboard ? { inline_keyboard: action.reply.keyboard } : undefined;
    const tasks: Promise<void>[] = [telegram(token, "sendMessage", { chat_id: action.chatId, text: action.reply.text, parse_mode: "HTML", disable_web_page_preview: true, ...(replyMarkup ? { reply_markup: replyMarkup } : {}) })];
    if (action.callbackQueryId) tasks.push(telegram(token, "answerCallbackQuery", { callback_query_id: action.callbackQueryId }));
    await Promise.all(tasks);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof PublicRequestError) return NextResponse.json({ ok: false }, { status: error.status });
    console.error("TELEGRAM_WEBHOOK_FAILED", error instanceof Error ? error.message : "UNKNOWN");
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
