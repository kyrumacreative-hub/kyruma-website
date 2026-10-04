"use client";

import { FormEvent, useRef, useState } from "react";
import { getAttribution, hasMarketingConsent, trackMarketingEvent } from "@/features/marketing/MarketingScripts";

const fields = [
  ["name", "Nombre y apellidos", "text"], ["email", "Email del pedido", "email"], ["instagram", "Usuario de Instagram", "text"],
  ["business", "¿A qué te dedicas?", "textarea"], ["offer", "¿Qué producto o servicio quieres vender principalmente?", "textarea"],
  ["audience", "¿A quién quieres llegar?", "textarea"], ["problem", "¿Qué es lo que menos te gusta actualmente de tu Instagram?", "textarea"],
] as const;

export default function InstagramResetBrief() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const submissionId = useRef(crypto.randomUUID());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/express/brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, submissionId: submissionId.current, marketingConsent: hasMarketingConsent(), attribution: getAttribution() }) });
    if (!response.ok) { setState("error"); return; }
    trackMarketingEvent("express_brief_completed", { product: "KX-001" });
    setState("success");
  }

  if (state === "success") return <section className="mt-14 border-y border-[var(--border)] py-12"><p className="section-label">TODO LISTO<span className="accent-dot" /></p><h2 className="mt-6 text-4xl font-light">Ya tenemos lo que necesitamos para empezar.</h2><p className="mt-5 leading-[1.7] text-[var(--muted)]">Tu plazo de entrega comienza ahora. Recibirás tu Instagram Reset por email en un máximo de 48 horas laborables.</p><p className="mt-8 text-xs uppercase tracking-[.2em]">KYRUMA®</p></section>;

  return <form onSubmit={submit} className="mt-14 space-y-8" noValidate>{fields.map(([name, label, type]) => <label key={name} className="block border-b border-[var(--border)] pb-5"><span className="text-xs uppercase tracking-[.14em]">{label} *</span>{type === "textarea" ? <textarea name={name} required maxLength={2000} rows={3} className="mt-4 w-full resize-y bg-transparent text-lg outline-none" /> : <input name={name} type={type} required maxLength={180} className="mt-4 w-full bg-transparent text-lg outline-none" />}</label>)}
    <label className="block border-b border-[var(--border)] pb-5"><span className="text-xs uppercase tracking-[.14em]">¿Qué quieres que haga una persona después de entrar en tu perfil? *</span><select name="goal" required defaultValue="" className="mt-4 w-full bg-transparent py-2 text-lg"><option value="" disabled>Selecciona una opción</option>{["Comprar", "Contactarme", "Reservar", "Visitar mi web", "Seguirme", "Conocer mi trabajo", "Otro"].map(item => <option key={item}>{item}</option>)}</select></label>
    <label className="block border-b border-[var(--border)] pb-5"><span className="text-xs uppercase tracking-[.14em]">Cuenta de referencia (opcional)</span><input name="reference" maxLength={180} className="mt-4 w-full bg-transparent text-lg outline-none" /></label>
    <label className="block border-b border-[var(--border)] pb-5"><span className="text-xs uppercase tracking-[.14em]">Número de pedido Shopify *</span><input name="orderId" required maxLength={80} placeholder="#1234" className="mt-4 w-full bg-transparent text-lg outline-none" /></label>
    <label className="flex items-start gap-3 text-sm leading-6 text-[var(--muted)]"><input type="checkbox" name="newsletter" className="mt-1" />Quiero recibir ocasionalmente ideas, recursos y novedades de KYRUMA. Esta opción es independiente del servicio.</label>
    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    <button disabled={state === "sending"} className="button-primary disabled:opacity-50">{state === "sending" ? "Enviando…" : "Enviar a KYRUMA"} <span>→</span></button>
    {state === "error" && <p role="alert" className="text-sm text-red-600">No hemos podido enviar el brief. Revisa los campos o escribe a hello@kyruma.com.</p>}
  </form>;
}
