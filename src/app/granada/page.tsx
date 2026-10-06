import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Creative Partner en Granada | Estrategia, identidad y experiencia digital",
  description: "Creative Partner B2B con base en Granada. Estrategia, identidad y experiencia digital para empresas cuyo negocio ha evolucionado más rápido que su percepción.",
  keywords: ["diseño web Granada", "branding Granada", "agencia creativa Granada", "identidad visual Granada", "estrategia de marca Granada", "estudio diseño Granada"],
  alternates: { canonical: "/granada" },
  openGraph: {
    title: "Creative Partner en Granada | KYRUMA",
    description: "Estrategia, identidad y experiencia digital para empresas cuyo negocio ha evolucionado más rápido que su percepción.",
    url: "/granada",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Partner en Granada | KYRUMA",
    description: "Estrategia, identidad y experiencia digital para empresas cuyo negocio ha evolucionado más rápido que su percepción.",
    images: ["/og-image.jpg"],
  },
};

const capabilities = [
  ["01", "Estrategia de marca", "Posicionamiento, propuesta, arquitectura de marca y dirección antes de diseñar."],
  ["02", "Identidad visual", "Sistemas visuales claros y consistentes para que la percepción esté al nivel del negocio."],
  ["03", "Experiencia digital", "Arquitectura, UX, dirección de interfaz y experiencias digitales pensadas para explicar mejor, generar confianza y facilitar la siguiente acción."],
];

export default function GranadaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "KYRUMA",
    url: "https://www.kyruma.com/granada",
    description: "Creative Partner B2B de estrategia, identidad y experiencia digital con base en Granada.",
    areaServed: { "@type": "City", name: "Granada" },
    knowsAbout: ["Brand Strategy", "Positioning", "Visual Identity", "Digital Experience", "UX"],
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <section className="flex min-h-[88svh] items-end border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">KYRUMA / GRANADA<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1120px] text-[clamp(3.2rem,8vw,7rem)] font-light leading-[.96] tracking-[-.055em]">
            Creative Partner en Granada para empresas cuyo negocio ha evolucionado <span className="text-[var(--muted)]">más rápido que su percepción.</span>
          </h1>
          <div className="mt-12 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-12">
            <p className="max-w-2xl text-lg font-light leading-[1.75] text-[var(--muted)] md:col-span-7">
              KYRUMA es un Creative Partner con base en Granada. Trabajamos estrategia, identidad y experiencia digital como un único sistema para empresas que han evolucionado más rápido que su percepción.
            </p>
            <div className="md:col-span-5 md:text-right">
              <Link href="/#contact" className="button-primary inline-flex">Hablar con KYRUMA <span>→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">EL PROBLEMA<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.03] tracking-[-.045em]">Tu negocio puede haber cambiado sin que su imagen lo haya hecho.</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg font-light leading-[1.8] text-[var(--muted)]">Una web antigua, una identidad inconsistente o un mensaje poco claro pueden hacer que una empresa sólida parezca menos madura de lo que realmente es. Nuestro trabajo empieza identificando esa distancia y decidiendo qué merece cambiar primero.</p>
            <p className="mt-6 text-lg font-light leading-[1.8] text-[var(--muted)]">No diseñamos piezas aisladas por defecto. Conectamos decisiones de negocio, marca y digital para que cada punto de contacto cuente la misma historia.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <p className="section-label">CAPACIDADES<span className="accent-dot" /></p>
          <div className="mt-12 grid border-t border-[var(--border)] md:grid-cols-2">
            {capabilities.map(([number, title, description]) => (
              <article key={number} className="border-b border-[var(--border)] py-10 md:min-h-[260px] md:border-r md:p-10">
                <p className="text-xs tracking-[.2em] text-[var(--primary)]">{number}</p>
                <h2 className="mt-8 text-3xl font-light tracking-[-.035em]">{title}</h2>
                <p className="mt-5 max-w-lg leading-7 text-[var(--muted)]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <Link href="/services/brand-strategy" className="text-link">Estrategia de marca <span>→</span></Link>
            <Link href="/services/visual-identity" className="text-link">Identidad visual <span>→</span></Link>
            <Link href="/services/web-experience" className="text-link">Experiencia web <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <p className="section-label">EXPERIENCIA DIGITAL<span className="accent-dot" /></p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-[clamp(2.4rem,5vw,4.6rem)] font-light tracking-[-.045em]">La experiencia digital empieza por el negocio, no por el número de páginas.</h2>
            <p className="mt-6 text-lg font-light leading-[1.8] text-[var(--muted)]">Primero entendemos qué debe conseguir y comunicar el negocio. A partir de ahí definimos arquitectura, mensaje, jerarquía, interacción y tecnología como una misma experiencia.</p>
            <ul className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 text-[var(--muted)]">
              {["Mensaje y propuesta claros", "Arquitectura orientada a negocio", "Diseño responsive", "SEO técnico esencial", "Analítica y medición", "Experiencia coherente con la marca"].map((item) => <li key={item} className="flex gap-4"><span className="text-[var(--primary)]">→</span>{item}</li>)}
            </ul>
            <Link href="/insights/diseno-web-granada-que-debe-incluir" className="text-link mt-8 inline-flex">Qué debería incluir una web profesional <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-label">EMPEZAR<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">Si algo ha cambiado en el negocio, empecemos por entender qué debería cambiar fuera.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">No partimos de la suposición de que necesitas una nueva marca o una nueva web. Primero identificamos la brecha y decidimos qué merece cambiar.</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <Link href="/#contact" className="button-primary inline-flex">Iniciar una conversación <span>→</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
