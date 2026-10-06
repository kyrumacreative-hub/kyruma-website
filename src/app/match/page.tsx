import type { Metadata } from "next";
import Link from "next/link";
import TrackedShopLink from "@/components/express/TrackedShopLink";
import { expressProduct } from "@/data/express";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "KYRUMA MATCH | Descubre qué mejorar primero en tu negocio",
  description: "Un diagnóstico gratuito y rápido para saber si deberías empezar por tu Instagram, web, contenido o marca.",
  alternates: { canonical: "/match" },
  openGraph: {
    title: "KYRUMA MATCH | Descubre qué mejorar primero",
    description: "Instagram, web, contenido o marca. Responde unas preguntas y encuentra tu siguiente paso.",
    url: "/match",
    type: "website",
  },
};

const areas = ["Instagram", "Web", "Contenido", "Marca"];
const whatsappOrderUrl = "https://wa.me/34614189346?text=Hola%2C%20he%20hecho%20o%20estoy%20viendo%20KYRUMA%20MATCH%20y%20quiero%20saber%20si%20Instagram%20Reset%20por%2029%20%E2%82%AC%20encaja%20con%20mi%20negocio.";

export default function MatchPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="flex min-h-[92svh] items-end border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">KYRUMA MATCH™<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1100px] text-[clamp(3.4rem,8vw,7.2rem)] font-light leading-[.95] tracking-[-.055em]">
            No sabes qué está fallando. <span className="text-[var(--muted)]">Empieza por descubrirlo.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg font-light leading-[1.8] text-[var(--muted)]">Responde unas preguntas sobre tu negocio y KYRUMA te dirá qué arreglaría primero. Sin llamada, sin presupuesto y sin obligación de comprar nada.</p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a href="https://t.me/kyrumabot?start=kyruma_match_web" target="_blank" rel="noreferrer" className="button-primary inline-flex">Hacer KYRUMA MATCH <span>↗</span></a>
            <span className="text-xs uppercase tracking-[.16em] text-[var(--muted)]">Gratis · ~2 minutos</span>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container">
          <p className="section-label">QUÉ REVISA<span className="accent-dot" /></p>
          <div className="mt-12 grid border-t border-[var(--border)] md:grid-cols-4">
            {areas.map((area, index) => <div key={area} className="border-b border-[var(--border)] py-10 md:border-r md:px-8"><span className="text-xs text-[var(--primary)]">0{index + 1}</span><p className="mt-12 text-2xl font-light">{area}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">CÓMO FUNCIONA<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.6rem,5vw,5rem)] font-light leading-[1.03] tracking-[-.045em]">No te recomendamos lo más caro. Te recomendamos por dónde empezar.</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ol className="grid gap-0 border-t border-[var(--border)]">
              {["Nos cuentas qué tienes y qué te preocupa", "Identificamos la categoría principal del problema", "Te mostramos la solución que encaja mejor", "Si el problema es mayor, te enviamos directamente a KYRUMA"].map((step, index) => <li key={step} className="grid grid-cols-[44px_1fr] gap-4 border-b border-[var(--border)] py-6"><span className="text-xs text-[var(--primary)]">0{index + 1}</span><span className="leading-7 text-[var(--muted)]">{step}</span></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-label">¿YA SABES QUÉ FALLA?<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.6rem,5vw,5rem)] font-light leading-[1.03] tracking-[-.045em]">Si el problema es Instagram, no necesitas hacer el diagnóstico.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Instagram Reset revisa bio, CTA, nombre y búsqueda, destacados, dirección visual y el arranque de contenido. Precio cerrado y entrega en hasta 48 horas laborables.</p>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-xs uppercase tracking-[.13em] text-[var(--muted)]">
              <span>Pago único</span><span>Sin contraseña</span><span>Sin reunión</span><span>Segunda revisión incluida</span>
            </div>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-4xl font-light">29 €</p>
            <TrackedShopLink href={expressProduct.shopUrl} placement="match_paid_recommendation" className="button-primary mt-6 inline-flex">Comprar Instagram Reset <span>→</span></TrackedShopLink>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">¿Quieres confirmar antes de pagar? <a href={whatsappOrderUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">Pregúntanos por WhatsApp</a>.</p>
            <div className="mt-4"><Link href="/auditoria-instagram" className="text-link">Ver qué incluye <span>→</span></Link></div>
          </div>
        </div>
      </section>

      <section className="section bg-[var(--foreground)] text-[var(--background)]">
        <div className="site-container text-center">
          <p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">TU SIGUIENTE PASO</p>
          <h2 className="mx-auto mt-7 max-w-4xl text-[clamp(3rem,6vw,6rem)] font-light leading-[.98] tracking-[-.055em]">Dos minutos pueden ahorrarte meses arreglando lo equivocado.</h2>
          <a href="https://t.me/kyrumabot?start=kyruma_match_web_final" target="_blank" rel="noreferrer" className="mt-10 inline-flex border border-white/30 px-6 py-4 text-sm uppercase tracking-[.14em] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]">Empezar en Telegram ↗</a>
        </div>
      </section>
    </main>
  );
}
