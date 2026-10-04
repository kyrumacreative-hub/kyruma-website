import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diseño web y branding en Granada | KYRUMA",
  description: "Estudio de estrategia, branding, identidad visual y diseño web en Granada para empresas y negocios que necesitan una presencia más clara, coherente y eficaz.",
  keywords: ["diseño web Granada", "branding Granada", "agencia creativa Granada", "identidad visual Granada", "estrategia de marca Granada", "estudio diseño Granada"],
  alternates: { canonical: "/granada" },
  openGraph: {
    title: "Diseño web y branding en Granada | KYRUMA",
    description: "Estrategia, identidad y experiencia digital para empresas y negocios en Granada.",
    url: "/granada",
    type: "website",
    images: ["/og-image.jpg"],
  },
};

const capabilities = [
  ["01", "Estrategia de marca", "Posicionamiento, propuesta, arquitectura de marca y dirección antes de diseñar."],
  ["02", "Identidad visual", "Sistemas visuales claros y consistentes para que la percepción esté al nivel del negocio."],
  ["03", "Diseño web", "Experiencias digitales pensadas para explicar mejor, generar confianza y facilitar la siguiente acción."],
  ["04", "Contenido y sistemas", "Dirección de contenido y sistemas digitales que ayudan a mantener coherencia cuando el negocio crece."],
];

export default function GranadaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "KYRUMA",
    url: "https://www.kyruma.com/granada",
    description: "Estudio de estrategia, branding, identidad visual y diseño web para empresas y negocios en Granada.",
    areaServed: { "@type": "City", name: "Granada" },
    knowsAbout: ["Brand Strategy", "Visual Identity", "Web Design", "Digital Experience", "Content Strategy"],
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <section className="flex min-h-[88svh] items-end border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">KYRUMA / GRANADA<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1120px] text-[clamp(3.2rem,8vw,7rem)] font-light leading-[.96] tracking-[-.055em]">
            Diseño web y branding en Granada para negocios que necesitan <span className="text-[var(--muted)]">ser entendidos mejor.</span>
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
            <p className="section-label">DISEÑO WEB EN GRANADA<span className="accent-dot" /></p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-[clamp(2.4rem,5vw,4.6rem)] font-light tracking-[-.045em]">Una web profesional no empieza por el número de páginas.</h2>
            <p className="mt-6 text-lg font-light leading-[1.8] text-[var(--muted)]">Empieza por entender qué necesita conseguir el negocio: captar contactos, vender, generar reservas, explicar un servicio o elevar percepción. A partir de ahí definimos arquitectura, mensaje, jerarquía, interacción y tecnología.</p>
            <ul className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 text-[var(--muted)]">
              {["Mensaje y propuesta claros", "Arquitectura orientada a negocio", "Diseño responsive", "SEO técnico esencial", "Analítica y medición", "Experiencia coherente con la marca"].map((item) => <li key={item} className="flex gap-4"><span className="text-[var(--primary)]">→</span>{item}</li>)}
            </ul>
            <Link href="/insights/diseno-web-granada-que-debe-incluir" className="text-link mt-8 inline-flex">Qué debería incluir una web profesional <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="section-label">EMPEZAR<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">¿No sabes si el problema es tu web, tu marca o tu contenido?</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Haz KYRUMA MATCH. Es un diagnóstico breve y gratuito que te ayuda a identificar qué arreglar primero antes de invertir en algo más grande.</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <a href="https://t.me/kyrumabot?start=granada_page" target="_blank" rel="noreferrer" className="button-primary inline-flex">Hacer KYRUMA MATCH <span>↗</span></a>
            <div className="mt-5"><Link href="/express" className="text-link">Ver KYRUMA EXPRESS <span>→</span></Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
