import type { Metadata } from "next";
import Link from "next/link";
import TrackedShopLink from "@/components/express/TrackedShopLink";
import { expressProduct } from "@/data/express";

export const metadata: Metadata = {
  title: "Auditoría de Instagram para negocios | 29 €",
  description: "Auditoría profesional de Instagram para negocios: bio, SEO, CTA, destacados, dirección visual y contenido. Precio cerrado de 29 € y entrega en hasta 48 h laborables.",
  keywords: [
    "auditoría Instagram",
    "auditoria Instagram negocio",
    "optimizar Instagram empresa",
    "mejorar bio Instagram negocio",
    "revisión Instagram empresa",
  ],
  alternates: { canonical: "/auditoria-instagram" },
  openGraph: {
    title: "Auditoría de Instagram para negocios — 29 € | KYRUMA",
    description: "Descubre qué está frenando tu perfil y recibe cambios concretos de bio, CTA, destacados, SEO y dirección visual.",
    url: "/auditoria-instagram",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auditoría de Instagram para negocios — 29 € | KYRUMA",
    description: "Bio, CTA, destacados, SEO y dirección visual con cambios concretos para tu negocio.",
    images: ["/og-image.jpg"],
  },
};

const points = [
  "Revisión completa del perfil y primera impresión",
  "Nombre visible y SEO interno",
  "Nueva bio orientada a claridad y conversión",
  "CTA principal recomendado",
  "Estructura de destacados",
  "Dirección visual prioritaria",
  "3 ideas de contenido adaptadas al negocio",
  "Lista de prioridades: qué cambiar primero",
];

const faqs = [
  ["¿Necesitáis acceso a mi cuenta?", "No. Analizamos el perfil públicamente y nunca necesitamos tu contraseña."],
  ["¿Es una plantilla?", "No. La revisión se prepara para tu negocio, tu oferta, tu público y el objetivo que indiques en el brief."],
  ["¿Cuándo recibo la auditoría?", "En hasta 48 horas laborables desde que recibimos correctamente tu brief."],
  ["¿Qué incluye el lanzamiento?", "Incluye una segunda revisión sin coste adicional durante los 7 días posteriores a la entrega."],
] as const;

export default function AuditoriaInstagramPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Auditoría de Instagram para negocios — Instagram Reset",
    serviceType: "Auditoría y optimización de perfil de Instagram para negocios",
    provider: { "@type": "Organization", name: "KYRUMA", url: "https://www.kyruma.com" },
    url: "https://www.kyruma.com/auditoria-instagram",
    areaServed: "ES",
    offers: {
      "@type": "Offer",
      price: "29",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: expressProduct.shopUrl,
    },
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <section className="flex min-h-[90svh] items-end border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">AUDITORÍA INSTAGRAM / KYRUMA EXPRESS™<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1120px] text-[clamp(3.2rem,8vw,7rem)] font-light leading-[.96] tracking-[-.055em]">
            Descubre por qué tu Instagram <span className="text-[var(--muted)]">no transmite el nivel real de tu negocio.</span>
          </h1>
          <div className="mt-12 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="max-w-2xl text-lg font-light leading-[1.75] text-[var(--muted)]">
                Revisamos bio, nombre/SEO, CTA, destacados, dirección visual y contenido para decirte exactamente qué cambiar primero. Sin reuniones, sin gestión mensual y sin pedir acceso a tu cuenta.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <TrackedShopLink href={expressProduct.shopUrl} placement="auditoria_instagram_hero" className="button-primary inline-flex">
                  Comprar auditoría — 29 € <span>→</span>
                </TrackedShopLink>
                <span className="text-xs uppercase tracking-[.14em] text-[var(--muted)]">Entrega ≤ 48 h laborables</span>
              </div>
            </div>
            <div className="md:col-span-5 md:text-right">
              <p className="text-5xl font-light">29 €</p>
              <p className="mt-3 text-xs uppercase tracking-[.16em] text-[var(--muted)]">Pago único · precio cerrado</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]">
        <div className="site-container grid gap-5 py-8 md:grid-cols-12 md:items-center">
          <p className="text-xs uppercase tracking-[.2em] text-[var(--primary)] md:col-span-3">BONUS DE LANZAMIENTO</p>
          <p className="text-lg font-light md:col-span-7">Segunda revisión incluida durante los 7 días posteriores a la entrega.</p>
          <p className="text-xs uppercase tracking-[.14em] opacity-60 md:col-span-2 md:text-right">Sin coste extra</p>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">QUÉ REVISAMOS<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.03] tracking-[-.045em]">No necesitas publicar más. Primero necesitas que el perfil se entienda.</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ul className="grid gap-4 border-t border-[var(--border)] pt-6">
              {points.map((point) => <li key={point} className="flex gap-4 text-base leading-7 text-[var(--muted)]"><span className="text-[var(--primary)]">→</span><span>{point}</span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-label">PARA QUIÉN ES<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">Para negocios buenos que online parecen menos claros de lo que son.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Especialmente útil para negocios locales, profesionales, marcas personales y pequeños equipos que usan Instagram como primer punto de contacto con clientes.</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <TrackedShopLink href={expressProduct.shopUrl} placement="auditoria_instagram_mid" className="button-primary inline-flex">
              Quiero mi auditoría — 29 € <span>→</span>
            </TrackedShopLink>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container">
          <p className="section-label">PREGUNTAS FRECUENTES<span className="accent-dot" /></p>
          <div className="mt-12 border-t border-[var(--border)]">
            {faqs.map(([question, answer]) => (
              <article key={question} className="grid gap-4 border-b border-[var(--border)] py-8 md:grid-cols-12">
                <h2 className="text-xl font-light md:col-span-5">{question}</h2>
                <p className="leading-7 text-[var(--muted)] md:col-span-6 md:col-start-7">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[var(--foreground)] text-[var(--background)]">
        <div className="site-container grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">NO ESTÁS SEGURO</p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">¿Y si tu problema no es Instagram?</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 opacity-70">Haz KYRUMA MATCH gratis. Te ayuda a decidir si deberías atacar primero Instagram, web, contenido o marca.</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <a href="https://t.me/kyrumabot?start=seo_auditoria_instagram" target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[var(--background)] px-6 py-4 text-sm font-medium text-[var(--foreground)]">Hacer MATCH gratis <span className="ml-2">↗</span></a>
            <div className="mt-5"><Link href="/express/instagram-reset" className="text-sm underline underline-offset-4 opacity-70">Ver todos los detalles de Instagram Reset</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
