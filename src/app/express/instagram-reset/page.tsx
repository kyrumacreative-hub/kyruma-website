import type { Metadata } from "next";
import TrackedShopLink from "@/components/express/TrackedShopLink";
import { expressProduct, instagramResetIncludes } from "@/data/express";

export const metadata: Metadata = {
  title: "Instagram Reset | Optimiza tu perfil por 29 €",
  description: "Mejora tu Instagram con una revisión profesional de bio, CTA, SEO, destacados, dirección visual y contenido. Entrega en 48 h.",
  alternates: { canonical: "/express/instagram-reset" },
  openGraph: { title: "Instagram Reset — 29 € | KYRUMA EXPRESS™", description: "Una revisión profesional y personalizada de tu perfil. Entrega en 48 h laborables.", url: "/express/instagram-reset", type: "website" },
};

const receive = ["Diagnóstico del perfil", "Nueva bio", "Nombre optimizado", "CTA recomendado", "Estructura de destacados", "Dirección visual", "Prioridades", "3 ideas de contenido"];
const excluded = ["Gestión mensual de redes", "Publicación de contenido", "Acceso o gestión directa de la cuenta", "Diseño completo de publicaciones", "Rediseño integral de identidad", "Campañas de publicidad"];

function BuyButton({ placement }: { placement: string }) {
  return <TrackedShopLink href={expressProduct.shopUrl} placement={placement} className="button-primary inline-flex">Quiero mi Instagram Reset — 29 € <span>→</span></TrackedShopLink>;
}

export default function InstagramResetPage() {
  return <main className="bg-[var(--background)] text-[var(--foreground)]">
    <section className="flex min-h-[92svh] items-end border-b border-[var(--border)] pt-36"><div className="site-container pb-20 md:pb-28"><p className="section-label">KYRUMA EXPRESS™ / KX-001<span className="accent-dot" /></p><h1 className="mt-8 max-w-[1100px] text-[clamp(3.2rem,8vw,7.2rem)] font-light leading-[.95] tracking-[-.055em]">Tu negocio merece algo mejor que <span className="text-[var(--muted)]">una bio improvisada.</span></h1><div className="mt-12 grid gap-10 border-t border-[var(--border)] pt-8 md:grid-cols-12 md:items-end"><p className="max-w-2xl text-lg leading-[1.75] text-[var(--muted)] md:col-span-7">Analizamos tu perfil y reorganizamos los elementos que determinan si alguien entiende quién eres, qué ofreces y qué debería hacer después.</p><div className="md:col-span-5 md:text-right"><p className="text-5xl font-light">29 €</p><p className="mt-3 text-xs uppercase tracking-[.16em] text-[var(--muted)]">Entrega ≤ 48 h laborables</p></div></div><div className="mt-10"><BuyButton placement="hero" /></div></div></section>

    <section className="border-b border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]"><div className="site-container grid gap-6 py-8 md:grid-cols-12 md:items-center"><div className="md:col-span-3"><p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">BONUS DE LANZAMIENTO</p></div><div className="md:col-span-6"><p className="text-lg font-light">Incluye una segunda revisión sin coste adicional durante los 7 días posteriores a la entrega.</p></div><div className="text-xs uppercase tracking-[.14em] opacity-65 md:col-span-3 md:text-right">Sin subir el precio · 29 €</div></div></section>

    <section className="section surface-section"><div className="site-container grid gap-12 md:grid-cols-12"><div className="md:col-span-5"><p className="section-label">EL PROBLEMA<span className="accent-dot" /></p><h2 className="mt-8 text-[clamp(2.6rem,5vw,5rem)] font-light leading-[1.02] tracking-[-.045em]">Tu negocio puede ser mucho mejor que lo que transmite su Instagram.</h2></div><div className="space-y-5 text-lg leading-[1.75] text-[var(--muted)] md:col-span-6 md:col-start-7"><p>Una bio que no explica nada. Un CTA inexistente. Destacados sin estructura. Una identidad diferente en cada publicación.</p><p>Una persona entra en tu perfil, mira durante unos segundos y decide si entiende tu negocio, confía en él y quiere saber más.</p><p className="text-[var(--foreground)]">Instagram Reset ordena esas piezas.</p></div></div></section>

    <section className="section"><div className="site-container"><p className="section-label">QUÉ INCLUYE<span className="accent-dot" /></p><div className="mt-12 grid border-t border-[var(--border)] md:grid-cols-2">{instagramResetIncludes.map(([number, title, body]) => <article key={number} className="border-b border-[var(--border)] py-9 md:px-8"><p className="text-xs text-[var(--primary)]">{number}</p><h3 className="mt-5 text-2xl font-light capitalize">{title}</h3><p className="mt-3 max-w-xl leading-[1.7] text-[var(--muted)]">{body}</p></article>)}</div></div></section>

    <section className="section bg-[var(--foreground)] text-[var(--background)]"><div className="site-container grid gap-12 md:grid-cols-12"><div className="md:col-span-5"><p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">QUÉ RECIBES</p><h2 className="mt-8 text-5xl font-light tracking-[-.045em]">Nada genérico.</h2><p className="mt-5 text-lg opacity-65">Lo hacemos específicamente para tu cuenta y tu negocio.</p></div><ul className="grid gap-px bg-white/15 md:col-span-6 md:col-start-7 md:grid-cols-2">{receive.map(item => <li key={item} className="bg-[var(--foreground)] p-5 text-sm uppercase tracking-[.12em]">{item}</li>)}</ul></div></section>

    <section className="section surface-section"><div className="site-container"><p className="section-label">EL PROCESO<span className="accent-dot" /></p><div className="mt-12 grid gap-px bg-[var(--border)] md:grid-cols-4">{["Compra Instagram Reset", "Completa un brief de pocos minutos", "KYRUMA analiza tu perfil", "Recibe tu reset por email"].map((item, index) => <div key={item} className="bg-[var(--surface)] p-8"><span className="text-xs text-[var(--primary)]">0{index + 1}</span><p className="mt-16 text-lg">{item}</p></div>)}</div></div></section>

    <section className="section"><div className="site-container grid gap-12 md:grid-cols-12"><div className="md:col-span-5"><p className="section-label">ENTREGA<span className="accent-dot" /></p><h2 className="mt-8 text-[clamp(4rem,8vw,8rem)] font-light tracking-[-.06em]">48 horas.</h2></div><div className="md:col-span-5 md:col-start-8"><p className="text-lg leading-[1.75] text-[var(--muted)]">El plazo comienza cuando recibimos correctamente tu brief. La entrega máxima es de 48 horas laborables.</p><h3 className="mt-12 text-xs uppercase tracking-[.18em]">No incluye</h3><ul className="mt-5 space-y-3 text-sm text-[var(--muted)]">{excluded.map(item => <li key={item}>— {item}</li>)}</ul><p className="mt-6 text-sm font-medium">Nunca te pediremos la contraseña de Instagram.</p></div></div></section>

    <section className="section surface-section"><div className="site-container text-center"><p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">KX-001</p><h2 className="mt-5 text-[clamp(3rem,6vw,6rem)] font-light tracking-[-.055em]">Instagram Reset</h2><p className="mt-5 text-4xl font-light">29 €</p><p className="mt-5 text-sm uppercase leading-7 tracking-[.14em] text-[var(--muted)]">Precio cerrado · Bonus de lanzamiento · Sin reuniones innecesarias</p><div className="mt-10"><BuyButton placement="final" /></div></div></section>
  </main>;
}
