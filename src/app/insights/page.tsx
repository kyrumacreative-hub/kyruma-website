import type { Metadata } from "next";
import Link from "next/link";
import { primaryInsights } from "@/data/insights";

export const metadata: Metadata = {
  title: "KYRUMA Insights | Estrategia, marca y experiencia digital",
  description: "Ideas y análisis sobre estrategia, posicionamiento, identidad y experiencia digital para empresas que necesitan claridad antes de crear más.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "KYRUMA Insights | Estrategia, marca y experiencia digital",
    description: "Análisis para entender mejor cómo estrategia, identidad y experiencia digital afectan a la percepción de un negocio.",
    url: "/insights",
    type: "website",
  },
};

export default function InsightsPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">KYRUMA INSIGHTS<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1000px] text-[clamp(3.2rem,8vw,7rem)] font-light leading-[.96] tracking-[-.055em]">
            Pensar mejor antes de <span className="text-[var(--muted)]">diseñar más.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg font-light leading-[1.75] text-[var(--muted)]">
            Estrategia, posicionamiento, identidad y experiencia digital para empresas que necesitan claridad antes de crear más.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="grid gap-0 border-t border-[var(--border)]">
            {primaryInsights.map((insight, index) => (
              <article key={insight.slug} className="grid gap-6 border-b border-[var(--border)] py-10 md:grid-cols-12 md:items-start">
                <div className="md:col-span-2">
                  <p className="text-xs tracking-[.2em] text-[var(--primary)]">0{index + 1}</p>
                  <p className="mt-3 text-xs uppercase tracking-[.14em] text-[var(--muted)]">{insight.eyebrow}</p>
                </div>
                <div className="md:col-span-7">
                  <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-light leading-[1.05] tracking-[-.04em]">
                    <Link href={`/insights/${insight.slug}`} className="transition-colors hover:text-[var(--primary)]">{insight.title}</Link>
                  </h2>
                  <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">{insight.description}</p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <p className="text-xs uppercase tracking-[.14em] text-[var(--muted)]">{insight.readingTime}</p>
                  <Link href={`/insights/${insight.slug}`} className="text-link mt-6 inline-flex">Leer insight <span>→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-label">KYRUMA / SIGNAL<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">Una señal útil cada semana.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">Una lectura breve sobre estrategia, marca y experiencia digital. Sin ruido. Aproximadamente 5 minutos.</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <Link href="/signal" className="button-primary inline-flex">Conocer SIGNAL <span>→</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
