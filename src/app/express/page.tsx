import type { Metadata } from "next";
import Link from "next/link";
import TrackedShopLink from "@/components/express/TrackedShopLink";
import { expressProduct } from "@/data/express";

export const metadata: Metadata = {
  title: "KYRUMA EXPRESS | Soluciones para marcas y negocios",
  description: "Soluciones concretas de branding, contenido y presencia digital para marcas, creadores y pequeños negocios. Precio cerrado y entrega rápida.",
  alternates: { canonical: "/express" },
  openGraph: { title: "KYRUMA EXPRESS™ | Soluciones concretas para avanzar", description: "Precio cerrado. Sin reuniones innecesarias. Entrega rápida.", url: "/express", type: "website" },
};

const steps = ["Elige", "Compra", "Cuéntanos tu caso", "KYRUMA trabaja", "Recibe tu entrega"];

export default function ExpressPage() {
  return <main className="bg-[var(--background)] text-[var(--foreground)]">
    <section className="flex min-h-[88svh] items-end border-b border-[var(--border)] pt-36">
      <div className="site-container pb-20 md:pb-28">
        <p className="section-label">KYRUMA EXPRESS™ / SMALL BUSINESS SOLUTIONS<span className="accent-dot" /></p>
        <h1 className="mt-8 max-w-[1080px] text-[clamp(3.2rem,8vw,7rem)] font-light leading-[.96] tracking-[-.055em]">A veces no necesitas un proyecto entero.<br /><span className="text-[var(--muted)]">Necesitas arreglar una cosa.</span></h1>
        <div className="mt-12 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-12">
          <p className="max-w-2xl text-lg font-light leading-[1.75] text-[var(--muted)] md:col-span-7">Soluciones concretas para marcas, creadores y pequeños negocios que necesitan avanzar sin entrar todavía en un gran proyecto.</p>
          <div className="text-sm uppercase leading-7 tracking-[.16em] md:col-span-5 md:text-right"><p>Precio cerrado.</p><p>Sin reuniones innecesarias.</p><p>Entrega rápida.</p></div>
        </div>
        <a href="#solutions" className="button-primary mt-10 inline-flex">Explorar soluciones <span>↓</span></a>
      </div>
    </section>

    <section id="solutions" className="section surface-section">
      <div className="site-container">
        <p className="section-label">DISPONIBLE AHORA<span className="accent-dot" /></p>
        <article className="mt-10 grid gap-10 border-y border-[var(--border)] py-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-2"><p className="text-xs tracking-[.22em] text-[var(--primary)]">{expressProduct.code}</p></div>
          <div className="md:col-span-6"><h2 className="text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">{expressProduct.name}</h2><p className="mt-4 max-w-xl text-lg text-[var(--muted)]">Haz que tu Instagram esté a la altura de tu negocio. Bio, CTA, SEO, destacados, dirección visual e ideas de contenido.</p></div>
          <div className="md:col-span-2"><p className="text-3xl font-light">29 €</p><p className="mt-2 text-xs uppercase tracking-[.14em] text-[var(--muted)]">{expressProduct.delivery}</p></div>
          <div className="md:col-span-2 md:text-right"><Link href="/express/instagram-reset" className="text-link">Quiero mi reset <span>→</span></Link></div>
        </article>
      </div>
    </section>

    <section className="section"><div className="site-container grid gap-12 md:grid-cols-12"><div className="md:col-span-5"><p className="section-label">EL PRINCIPIO<span className="accent-dot" /></p><h2 className="mt-8 text-5xl font-light tracking-[-.045em]">Simple por fuera.<br />KYRUMA por dentro.</h2></div><p className="text-lg leading-[1.8] text-[var(--muted)] md:col-span-6 md:col-start-7">No todos los problemas necesitan meses de consultoría. KYRUMA EXPRESS convierte necesidades concretas en intervenciones concretas: alcance definido, precio definido y una entrega clara.<br /><br />Sin presupuestos. Sin procesos innecesarios. Sin rebajar el estándar.</p></div></section>

    <section className="section surface-section"><div className="site-container"><p className="section-label">CÓMO FUNCIONA<span className="accent-dot" /></p><ol className="mt-12 grid border-t border-[var(--border)] md:grid-cols-5">{steps.map((step, index) => <li key={step} className="border-b border-[var(--border)] py-8 md:border-r md:px-6"><span className="text-xs text-[var(--primary)]">0{index + 1}</span><p className="mt-8 text-sm uppercase tracking-[.14em]">{step}</p></li>)}</ol></div></section>

    <section className="section"><div className="site-container max-w-4xl text-center"><p className="section-label justify-center">ALGO MÁS GRANDE<span className="accent-dot" /></p><h2 className="mt-8 text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-.045em]">¿Tu negocio necesita algo más que un arreglo puntual?</h2><p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">Trabajamos también en estrategia, identidad, experiencia digital y sistemas para compañías que necesitan una transformación más profunda.</p><Link href="/#contact" className="button-primary mt-10 inline-flex">Trabajar con KYRUMA <span>→</span></Link></div></section>
    <span className="sr-only"><TrackedShopLink href={expressProduct.shopUrl} placement="express_hidden">Comprar</TrackedShopLink></span>
  </main>;
}
