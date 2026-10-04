import { NextRequest, NextResponse } from "next/server";
import { enforcePublicRequestGuard, PublicRateLimitError } from "@/features/security/server/publicRequestGuard";
import { PublicRequestError, assertPublicMutationEnvironment, readLimitedJson } from "@/features/security/server/publicRequestPolicy";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GOALS = new Set(["Comprar", "Contactarme", "Reservar", "Visitar mi web", "Seguirme", "Conocer mi trabajo", "Otro"]);

type Payload = Record<string, unknown>;
const text = (value: unknown, max = 2000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch(RESEND_ENDPOINT, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error(`Resend error ${response.status}`);
}

function shell(content: string) {
  return `<!doctype html><html><body style="margin:0;background:#f7f7f5;color:#111;font-family:Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:28px 16px"><table role="presentation" width="100%" style="max-width:640px;background:#fff;border:1px solid #e8e8e5"><tr><td style="padding:36px 42px 16px;font-size:18px;letter-spacing:.18em;font-weight:600">KYRUMA<span style="color:#ff5a00">.</span></td></tr><tr><td style="padding:36px 42px 48px">${content}</td></tr></table></td></tr></table></body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    assertPublicMutationEnvironment(process.env);
    await enforcePublicRequestGuard(request, { route: "express-brief", limit: 4, windowMs: 60 * 60 * 1000 });
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false }, { status: 500 });
    const body = await readLimitedJson(request, 32 * 1024) as Payload;
    if (text(body.website)) return NextResponse.json({ ok: true });

    const values = {
      name: text(body.name, 120), email: text(body.email, 180).toLowerCase(), instagram: text(body.instagram, 120),
      business: text(body.business), offer: text(body.offer), audience: text(body.audience), goal: text(body.goal, 80),
      problem: text(body.problem), reference: text(body.reference, 180), orderId: text(body.orderId, 80),
      newsletter: body.newsletter === "on", submissionId: text(body.submissionId, 80),
    };
    if (!values.name || !EMAIL_RE.test(values.email) || !values.instagram || !values.business || !values.offer || !values.audience || !values.problem || !values.orderId || !values.submissionId || !GOALS.has(values.goal)) {
      return NextResponse.json({ ok: false, error: "INVALID_BRIEF" }, { status: 400 });
    }
    const safe = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === "string" ? escapeHtml(value) : value]));
    const rows = [["Pedido", safe.orderId], ["Cliente", safe.name], ["Email", safe.email], ["Instagram", safe.instagram], ["Actividad", safe.business], ["Oferta principal", safe.offer], ["Audiencia", safe.audience], ["Objetivo", safe.goal], ["Problema actual", safe.problem], ["Referencia", safe.reference || "—"], ["Marketing", safe.newsletter ? "Sí" : "No"]].map(([label, value]) => `<tr><td style="padding:10px;border-bottom:1px solid #eee;color:#737373;vertical-align:top">${label}</td><td style="padding:10px;border-bottom:1px solid #eee;white-space:pre-wrap">${value}</td></tr>`).join("");

    await sendEmail(apiKey, { from: "KYRUMA <hello@kyruma.com>", to: ["hello@kyruma.com"], reply_to: values.email, subject: `KX-001 · Brief recibido · ${values.orderId}`, html: shell(`<p style="font-size:12px;letter-spacing:.14em;color:#ff5a00">KYRUMA EXPRESS · KX-001</p><h1 style="font-weight:400">Nuevo brief listo para producción</h1><table width="100%" style="border-collapse:collapse">${rows}</table>`) });
    await sendEmail(apiKey, { from: "KYRUMA <hello@kyruma.com>", to: [values.email], subject: "Ya tenemos todo — KYRUMA EXPRESS", html: shell(`<p style="font-size:12px;letter-spacing:.14em;color:#ff5a00">KYRUMA EXPRESS · KX-001</p><h1 style="font-weight:400">Ya tenemos todo.</h1><p>Hola, ${safe.name}.</p><p style="line-height:1.7;color:#555">Hemos recibido correctamente tu información. Tu Instagram Reset ha entrado en producción. No necesitamos nada más por tu parte de momento.</p><p style="line-height:1.7;color:#555">Te enviaremos el resultado en un máximo de 48 horas laborables.</p><p style="margin-top:32px">KYRUMA®</p>`) });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof PublicRateLimitError) return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    if (error instanceof PublicRequestError) return NextResponse.json({ ok: false, code: error.code }, { status: error.status });
    console.error("EXPRESS_BRIEF_FAILED", error instanceof Error ? error.name : "UNKNOWN");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
