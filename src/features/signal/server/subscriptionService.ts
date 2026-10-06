import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const CONSENT_VERSION = "signal-v1-2026-10-06";
const CONSENT_TEXT = "Quiero recibir KYRUMA / SIGNAL por email. Puedo darme de baja en cualquier momento.";

type Language = "es" | "en";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function secret(): string {
  const value = process.env.FORM_RATE_LIMIT_SECRET ?? "";
  if (value.length < 32) throw new Error("SIGNAL_SECURITY_CONFIGURATION_REQUIRED");
  return value;
}

function token(kind: "confirm" | "unsubscribe", id: string, email: string): string {
  return createHmac("sha256", secret())
    .update(`signal:${kind}:v1:${id}:${normalizeEmail(email)}`, "utf8")
    .digest("hex");
}

function safeTokenMatch(expected: string, received: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(received)) return false;
  const left = Buffer.from(expected, "hex");
  const right = Buffer.from(received, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

function publicOrigin(): string {
  const value = process.env.APP_URL?.trim();
  if (!value) throw new Error("SIGNAL_APP_URL_REQUIRED");
  return new URL(value).origin;
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend error ${response.status}`);
}

function confirmationHtml(language: Language, confirmUrl: string) {
  const es = language === "es";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f7f5;color:#111;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:28px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border:1px solid #e8e8e5"><tr><td style="padding:42px;font-size:18px;letter-spacing:.18em;font-weight:600">KYRUMA<span style="color:#ff5a00">.</span></td></tr><tr><td style="padding:20px 42px 52px"><p style="margin:0 0 16px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#ff5a00">KYRUMA / SIGNAL</p><h1 style="margin:0 0 24px;font-size:36px;line-height:1.08;font-weight:400">${es ? "Confirma tu suscripción." : "Confirm your subscription."}</h1><p style="font-size:16px;line-height:1.8;color:#3f3f3f">${es ? "Una señal útil cada semana. Estrategia, marca y experiencia digital sin ruido." : "One useful signal each week. Strategy, brand and digital experience without noise."}</p><p style="margin:30px 0"><a href="${confirmUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-size:13px">${es ? "Confirmar suscripción" : "Confirm subscription"}</a></p><p style="font-size:12px;line-height:1.7;color:#737373">${es ? "Si no has solicitado esta suscripción, puedes ignorar este correo." : "If you did not request this subscription, you can ignore this email."}</p></td></tr></table></td></tr></table></body></html>`;
}

export async function requestSignalSubscription(input: {
  email: string;
  language: Language;
  source: string;
  sendConfirmation?: boolean;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const now = new Date();
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { normalizedEmail } });

  const subscriber = existing
    ? await prisma.newsletterSubscriber.update({
        where: { normalizedEmail },
        data: {
          email: normalizedEmail,
          language: input.language,
          source: input.source,
          status: existing.status === "active" ? "active" : "pending",
          consentVersion: CONSENT_VERSION,
          consentText: CONSENT_TEXT,
          requestedAt: now,
          unsubscribedAt: existing.status === "active" ? existing.unsubscribedAt : null,
          updatedAt: now,
        },
      })
    : await prisma.newsletterSubscriber.create({
        data: {
          id: randomUUID(),
          email: normalizedEmail,
          normalizedEmail,
          language: input.language,
          source: input.source,
          status: "pending",
          consentVersion: CONSENT_VERSION,
          consentText: CONSENT_TEXT,
          requestedAt: now,
          confirmedAt: null,
          unsubscribedAt: null,
          createdAt: now,
          updatedAt: now,
        },
      });

  if (subscriber.status === "active" || input.sendConfirmation === false) {
    return { id: subscriber.id, status: subscriber.status };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("SIGNAL_RESEND_CONFIGURATION_REQUIRED");
  const confirmToken = token("confirm", subscriber.id, subscriber.normalizedEmail);
  const confirmUrl = `${publicOrigin()}/api/signal/confirm?id=${encodeURIComponent(subscriber.id)}&token=${confirmToken}`;
  await sendEmail(apiKey, {
    from: "KYRUMA / SIGNAL <hello@kyruma.com>",
    to: [subscriber.email],
    reply_to: "hello@kyruma.com",
    subject: input.language === "es" ? "Confirma KYRUMA / SIGNAL" : "Confirm KYRUMA / SIGNAL",
    html: confirmationHtml(input.language, confirmUrl),
  });

  return { id: subscriber.id, status: subscriber.status };
}

export async function confirmSignalSubscription(id: string, receivedToken: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } });
  if (!subscriber) return false;
  const expected = token("confirm", subscriber.id, subscriber.normalizedEmail);
  if (!safeTokenMatch(expected, receivedToken)) return false;
  const now = new Date();
  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: "active", confirmedAt: now, unsubscribedAt: null, updatedAt: now },
  });
  return true;
}

export async function unsubscribeSignal(id: string, receivedToken: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } });
  if (!subscriber) return false;
  const expected = token("unsubscribe", subscriber.id, subscriber.normalizedEmail);
  if (!safeTokenMatch(expected, receivedToken)) return false;
  const now = new Date();
  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: "unsubscribed", unsubscribedAt: now, updatedAt: now },
  });
  return true;
}

export function signalUnsubscribeUrl(input: { id: string; email: string }): string {
  return `${publicOrigin()}/api/signal/unsubscribe?id=${encodeURIComponent(input.id)}&token=${token("unsubscribe", input.id, input.email)}`;
}
