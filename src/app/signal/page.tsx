import type { Metadata } from "next";
import SignalSignup from "@/components/signal/SignalSignup";

export const metadata: Metadata = {
  title: "KYRUMA / SIGNAL | Una señal útil cada semana",
  description: "Estrategia, marca y experiencia digital para empresas que quieren que su percepción esté a la altura de su negocio. Sin ruido. 5 minutos.",
  alternates: { canonical: "/signal" },
  openGraph: {
    title: "KYRUMA / SIGNAL",
    description: "Una señal útil cada semana. Estrategia, marca y experiencia digital sin ruido.",
    url: "/signal",
    type: "website",
  },
};

export default function SignalPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">KYRUMA / SIGNAL<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1000px] text-[clamp(3.4rem,8vw,7.4rem)] font-light leading-[.94] tracking-[-.06em]">
            Una señal útil. <span className="text-[var(--muted)]">Sin ruido.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg font-light leading-[1.8] text-[var(--muted)]">
            Una lectura breve sobre estrategia, marca y experiencia digital para empresas que quieren que su percepción esté al nivel del negocio que han construido.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[.14em] text-[var(--muted)]">Semanal · aproximadamente 5 minutos · sin secuencias comerciales automáticas</p>
        </div>
      </section>

      <section className="section">
        <div className="site-container grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">QUÉ RECIBES<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,4.8rem)] font-light leading-[1] tracking-[-.045em]">Una idea que merezca tu atención.</h2>
          </div>
          <div className="md:col-span-7">
            <div className="grid gap-8 border-t border-[var(--border)] pt-8">
              {[
                ["01", "SIGNAL", "Un cambio, problema o patrón que merece ser visto."],
                ["02", "BREAKDOWN", "Qué significa para una empresa y dónde suele estar la fricción real."],
                ["03", "ACTION", "Una decisión, pregunta o pequeña auditoría para actuar con más claridad."],
                ["04", "FROM KYRUMA", "Un framework, proceso o prueba solo cuando añade valor."],
              ].map(([n, title, body]) => (
                <div key={n} className="grid gap-3 border-b border-[var(--border)] pb-8 md:grid-cols-[72px_1fr]">
                  <span className="text-xs tracking-[.2em] text-[var(--primary)]">{n}</span>
                  <div><h3 className="text-xl font-medium">{title}</h3><p className="mt-2 leading-7 text-[var(--muted)]">{body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">SUSCRIPCIÓN<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.4rem,5vw,4.4rem)] font-light tracking-[-.045em]">Solo si quieres estar aquí.</h2>
            <p className="mt-5 max-w-lg leading-7 text-[var(--muted)]">Tu contacto con KYRUMA, ser cliente o trabajar con nosotros no te suscribe automáticamente. SIGNAL tiene un consentimiento independiente.</p>
          </div>
          <div className="md:col-span-7">
            <SignalSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
