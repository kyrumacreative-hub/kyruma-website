import type { Metadata } from "next";
import Link from "next/link";
import { insights } from "@/data/insights";

export const metadata: Metadata = {
  title: "KYRUMA Insights | Marca, web y crecimiento digital",
  description: "Ideas prácticas sobre estrategia de marca, diseño web, Instagram y experiencia digital para empresas, creadores y pequeños negocios.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "KYRUMA Insights | Marca, web y crecimiento digital",
    description: "Análisis y guías prácticas para mejorar cómo se presenta y convierte un negocio online.",
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
            Estrategia, marca, web y contenido explicados de forma práctica para negocios que necesitan claridad antes de invertir en más piezas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="grid gap-0 border-t border-[var(--border)]">
            {insights.map((insight, index) => (
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
            <p className="section-label">KYRUMA MATCH<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">¿No sabes qué está fallando?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">Responde unas preguntas y te diremos qué arreglaría KYRUMA primero. Gratis y sin llamada.</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <a href="https://t.me/kyrumabot?start=insights_hub" target="_blank" rel="noreferrer" className="button-primary inline-flex">Encontrar mi solución <span>↗</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}
