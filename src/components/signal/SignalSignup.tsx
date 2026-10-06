"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "confirmed" | "unsubscribed" | "invalid" | "error";

export default function SignalSignup() {
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("status");
    if (value === "confirmed" || value === "unsubscribed" || value === "invalid" || value === "error") {
      setStatus(value);
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/signal/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          language: "es",
          privacy,
          website: "",
          startedAt: startedAt.current,
          source: "signal_page",
        }),
      });
      if (!response.ok) throw new Error("SIGNAL_SUBSCRIBE_FAILED");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "confirmed") {
    return <div className="border-t border-[var(--border)] pt-8"><p className="section-label">SUSCRIPCIÓN CONFIRMADA<span className="accent-dot" /></p><p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">Ya formas parte de KYRUMA / SIGNAL. Recibirás únicamente las ediciones que publiquemos; no te hemos añadido a ninguna otra comunicación.</p></div>;
  }

  if (status === "unsubscribed") {
    return <div className="border-t border-[var(--border)] pt-8"><p className="section-label">BAJA CONFIRMADA<span className="accent-dot" /></p><p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">Tu suscripción está desactivada. No recibirás nuevas ediciones de KYRUMA / SIGNAL.</p></div>;
  }

  return (
    <form onSubmit={submit} className="border-t border-[var(--border)] pt-8">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block">
          <span className="mb-3 block text-xs uppercase tracking-[.14em] text-[var(--muted)]">Email profesional</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@empresa.com"
            className="w-full border-b border-[var(--border-strong)] bg-transparent px-0 py-4 text-lg outline-none transition-colors focus:border-[var(--foreground)]"
          />
        </label>
        <button className="button-primary justify-center md:min-w-[180px]" disabled={status === "sending" || !privacy}>
          {status === "sending" ? "Enviando…" : "Unirme a SIGNAL"} <span>→</span>
        </button>
      </div>

      <label className="mt-6 flex max-w-2xl items-start gap-3 text-sm leading-6 text-[var(--muted)]">
        <input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} className="mt-1" />
        <span>Quiero recibir KYRUMA / SIGNAL por email. Confirmaré la suscripción desde mi bandeja de entrada y podré darme de baja en cualquier momento. He leído la <a href="/privacy" className="underline underline-offset-4">política de privacidad</a>.</span>
      </label>

      {status === "sent" && <p className="mt-6 text-sm leading-6 text-[var(--muted)]">Te hemos enviado un correo de confirmación. La suscripción no estará activa hasta que la confirmes.</p>}
      {status === "invalid" && <p className="mt-6 text-sm leading-6 text-[var(--muted)]">Ese enlace no es válido. Puedes solicitar una nueva confirmación desde este formulario.</p>}
      {status === "error" && <p className="mt-6 text-sm leading-6 text-[var(--muted)]">No hemos podido completar la operación. Inténtalo de nuevo más tarde o escribe a hello@kyruma.com.</p>}
    </form>
  );
}
