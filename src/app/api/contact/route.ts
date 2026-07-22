import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  help?: unknown;
  collaboration?: unknown;
  need?: unknown;
  language?: unknown;
  newsletter?: unknown;
  privacy?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function text(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[char] ?? char);
}

function emailShell(content: string, language: "es" | "en") {
  const footer = language === "es"
    ? "Estrategia · Identidad · Experiencia Digital"
    : "Strategy · Identity · Digital Experience";

  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f7f5;color:#111111;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f5"><tr><td align="center" style="padding:28px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid rgba(17,17,17,.08)"><tr><td style="padding:42px 42px 18px;font-size:18px;letter-spacing:.18em;font-weight:600">KYRUMA<span style="color:#ff5a00">.</span></td></tr><tr><td style="padding:44px 42px 52px">${content}</td></tr><tr><td style="padding:26px 42px;border-top:1px solid #e8e8e5;font-size:10px;line-height:1.7;letter-spacing:.14em;text-transform:uppercase;color:#737373">${footer}<br><span style="color:#ff5a00">kyruma.com</span></td></tr></table></td></tr></table></body></html>`;
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend error ${response.status}`);
  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false }, { status: 500 });

    const body = (await request.json()) as ContactPayload;
    const name = text(body.name, 100);
    const company = text(body.company, 140);
    const email = text(body.email, 180).toLowerCase();
    const help = text(body.help, 120);
    const collaboration = text(body.collaboration, 160);
    const need = text(body.need, 5000);
    const language: "es" | "en" = body.language === "en" ? "en" : "es";
    const newsletter = body.newsletter === true;
    const privacy = body.privacy === true;
    const honeypot = text(body.website, 200);
    const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;

    // Silent success for bots; do not send anything.
    if (honeypot || !startedAt || Date.now() - startedAt < 2500) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !company || !EMAIL_RE.test(email) || !help || !collaboration || need.length < 20 || !privacy) {
      return NextResponse.json({ ok: false, code: "INVALID" }, { status: 400 });
    }

    const safe = {
      name: escapeHtml(name), company: escapeHtml(company), email: escapeHtml(email),
      help: escapeHtml(help), collaboration: escapeHtml(collaboration), need: escapeHtml(need).replace(/\n/g, "<br>"),
    };

    const internalHtml = emailShell(`
      <p style="margin:0 0 18px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#737373">Nueva conversación</p>
      <h1 style="margin:0 0 34px;font-size:38px;line-height:1.08;font-weight:400;letter-spacing:-.035em">${safe.company}</h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.7">
        <tr><td style="padding:10px 0;color:#737373;width:145px">Nombre</td><td>${safe.name}</td></tr>
        <tr><td style="padding:10px 0;color:#737373">Email</td><td>${safe.email}</td></tr>
        <tr><td style="padding:10px 0;color:#737373">Necesidad</td><td>${safe.help}</td></tr>
        <tr><td style="padding:10px 0;color:#737373">Colaboración</td><td>${safe.collaboration}</td></tr>
        <tr><td style="padding:10px 0;color:#737373">Newsletter</td><td>${newsletter ? "Sí, consentimiento indicado" : "No"}</td></tr>
      </table>
      <div style="margin-top:34px;padding-top:28px;border-top:1px solid #e8e8e5;font-size:15px;line-height:1.8">${safe.need}</div>`, language);

    const clientContent = language === "es" ? `
      <p style="margin:0 0 18px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#ff5a00">Consulta recibida</p>
      <h1 style="margin:0 0 28px;font-size:40px;line-height:1.06;font-weight:400;letter-spacing:-.04em">Gracias por confiar<br>en KYRUMA.</h1>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#3f3f3f">Hola, ${safe.name}.</p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#3f3f3f">Hemos recibido correctamente tu mensaje. Revisaremos personalmente la información que nos has enviado y nos pondremos en contacto contigo lo antes posible.</p>
      <p style="margin:0 0 34px;font-size:16px;line-height:1.8;color:#3f3f3f">Creemos que una buena colaboración comienza entendiendo el negocio antes de proponer soluciones. Nuestro siguiente paso será comprender mejor vuestro contexto, qué necesitáis y qué queréis conseguir.</p>
      <p style="margin:0;font-size:16px;line-height:1.8">Hablamos pronto.<br><strong style="font-weight:600">KYRUMA<span style="color:#ff5a00">.</span></strong></p>
      <div style="margin-top:38px;width:32px;height:2px;background:#ff5a00"></div>` : `
      <p style="margin:0 0 18px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#ff5a00">Enquiry received</p>
      <h1 style="margin:0 0 28px;font-size:40px;line-height:1.06;font-weight:400;letter-spacing:-.04em">Thank you for trusting<br>KYRUMA.</h1>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#3f3f3f">Hello, ${safe.name}.</p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#3f3f3f">We have received your message. We will personally review the information you shared and get back to you as soon as possible.</p>
      <p style="margin:0 0 34px;font-size:16px;line-height:1.8;color:#3f3f3f">We believe a strong collaboration begins by understanding the business before proposing solutions. Our next step is to understand your context, what you need and what you want to achieve.</p>
      <p style="margin:0;font-size:16px;line-height:1.8">Speak soon.<br><strong style="font-weight:600">KYRUMA<span style="color:#ff5a00">.</span></strong></p>
      <div style="margin-top:38px;width:32px;height:2px;background:#ff5a00"></div>`;

    // Internal delivery is critical. Client acknowledgement follows only after it succeeds.
    await sendEmail(apiKey, {
      from: "KYRUMA Website <hello@kyruma.com>",
      to: ["hello@kyruma.com"],
      reply_to: email,
      subject: `Nueva conversación · ${company}`,
      html: internalHtml,
    });

    await sendEmail(apiKey, {
      from: "KYRUMA <hello@kyruma.com>",
      to: [email],
      reply_to: "hello@kyruma.com",
      subject: language === "es" ? "Hemos recibido tu consulta · KYRUMA" : "We received your enquiry · KYRUMA",
      html: emailShell(clientContent, language),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact submission failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
