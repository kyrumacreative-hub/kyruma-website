import type { Metadata } from "next";
import Link from "next/link";
import TrackedShopLink from "@/components/express/TrackedShopLink";
import { expressProduct } from "@/data/express";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
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

const trustSignals = [
  ["29 €", "Precio cerrado"],
  ["≤ 48 h", "Entrega laborable"],
  ["0 accesos", "Nunca pedimos contraseña"],
  ["1 compra", "Sin suscripción"],
] as const;

const process = [
  ["01", "Compras", "Pagas una sola vez y accedes al siguiente paso sin reuniones ni llamadas obligatorias."],
  ["02", "Nos das contexto", "Completas un brief breve con tu perfil, negocio, público y objetivo principal."],
  ["03", "Recibes el reset", "Te enviamos por email una entrega digital con diagnóstico, cambios concretos y prioridades."],
] as const;

const whatsappOrderUrl = "https://wa.me/34614189346?text=Hola%2C%20quiero%20contratar%20Instagram%20Reset%20de%20KYRUMA%20por%2029%20%E2%82%AC%20y%20necesito%20ayuda%20con%20la%20compra.";

const faqs = [
  ["¿Necesitáis acceso a mi cuenta?", "No. Analizamos el perfil públicamente y nunca necesitamos tu contraseña."],
  ["¿Es una plantilla?", "No. La revisión se prepara para tu negocio, tu oferta, tu público y el objetivo que indiques en el brief."],
  ["¿Qué recibo exactamente?", "Una entrega digital personalizada con diagnóstico del perfil, nueva bio, nombre optimizado, CTA, estructura de destacados, dirección visual, prioridades y 3 ideas de contenido."],
  ["¿Cuándo recibo la auditoría?", "En hasta 48 horas laborables desde que recibimos correctamente tu brief."],
  ["¿Tengo que hacer una reunión?", "No. Está diseñado para resolverse de forma asíncrona. Compras, completas el brief y recibes la revisión por email."],
  ["¿Qué incluye el lanzamiento?", "Incluye una segunda revisión sin coste adicional durante los 7 días posteriores a la entrega."],
  ["¿Y si tengo algún problema al comprar?", "Puedes escribirnos por WhatsApp o a hello@kyruma.com. Te ayudamos a completar el pedido sin hacerte repetir todo el proceso."],
] as const;

function BuyButton({ placement, label = "Comprar auditoría — 29 €" }: { placement: string; label?: string }) {
  return (
    <TrackedShopLink href={expressProduct.shopUrl} placement={placement} className="button-primary inline-flex">
      {label} <span>→</span>
    </TrackedShopLink>
  );
}

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
    <main className="bg-[var(--background)] pb-24 text-[var(--foreground)] md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <section className="flex min-h-[90svh] items-end border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">AUDITORÍA INSTAGRAM / KYRUMA EXPRESS™<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1120px] text-[clamp(3.2rem,8vw,7rem)] font-light leading-[.96] tracking-[-.055em]">
            Tu negocio puede ser bueno y aun así <span className="text-[var(--muted)]">perder confianza en 5 segundos.</span>
          </h1>
          <div className="mt-12 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="max-w-2xl text-lg font-light leading-[1.75] text-[var(--muted)]">
                Revisamos cómo se entiende tu Instagram cuando alguien llega por primera vez y te damos cambios concretos de bio, nombre/SEO, CTA, destacados, dirección visual y contenido.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                No es gestión mensual. No es una plantilla. No necesitamos acceso a tu cuenta.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <BuyButton placement="auditoria_instagram_hero" />
                <Link href="/auditoria-instagram/ejemplo" className="text-sm underline underline-offset-4">Ver una entrega de ejemplo</Link>
                <span className="text-xs uppercase tracking-[.14em] text-[var(--muted)]">Entrega ≤ 48 h laborables</span>
              </div>
              <p className="mt-4 text-xs leading-6 text-[var(--muted)]">Después de comprar completas un brief breve. El plazo empieza cuando lo recibimos correctamente.</p>
              <p className="mt-3 text-xs leading-6 text-[var(--muted)]">¿Tienes una duda antes de pagar o algo falla en la compra? <a href={whatsappOrderUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">Escríbenos por WhatsApp</a>.</p>
            </div>
            <div className="md:col-span-5 md:text-right">
              <p className="text-5xl font-light">29 €</p>
              <p className="mt-3 text-xs uppercase tracking-[.16em] text-[var(--muted)]">Pago único · precio cerrado</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)]">
        <div className="site-container grid divide-y divide-[var(--border)] md:grid-cols-4 md:divide-x md:divide-y-0">
          {trustSignals.map(([value, label]) => (
            <div key={label} className="py-7 md:px-6 first:md:pl-0 last:md:pr-0">
              <p className="text-2xl font-light">{value}</p>
              <p className="mt-2 text-xs uppercase tracking-[.14em] text-[var(--muted)]">{label}</p>
            </div>
          ))}
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
            <div className="mt-9"><BuyButton placement="auditoria_instagram_after_scope" label="Quiero saber qué cambiar — 29 €" /></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <p className="section-label">CÓMO FUNCIONA<span className="accent-dot" /></p>
          <div className="mt-12 grid gap-px bg-[var(--border)] md:grid-cols-3">
            {process.map(([number, title, body]) => (
              <article key={number} className="bg-[var(--surface)] p-8 md:min-h-[300px]">
                <p className="text-xs text-[var(--primary)]">{number}</p>
                <h2 className="mt-16 text-3xl font-light tracking-[-.03em]">{title}</h2>
                <p className="mt-5 leading-7 text-[var(--muted)]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <p className="section-label">EJEMPLO ILUSTRATIVO<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,4.8rem)] font-light leading-[1.03] tracking-[-.045em]">De enumerar servicios a explicar por qué elegirte.</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">Este ejemplo no corresponde a un cliente real. Sirve para mostrar el tipo de cambio que proponemos.</p>
            <Link href="/auditoria-instagram/ejemplo" className="mt-6 inline-flex text-sm underline underline-offset-4">Ver la entrega completa de ejemplo →</Link>
          </div>
          <div className="grid gap-px border border-[var(--border)] bg-[var(--border)] md:col-span-7 md:col-start-6 md:grid-cols-2">
            <div className="bg-[var(--background)] p-8">
              <p className="text-xs uppercase tracking-[.16em] text-[var(--muted)]">ANTES</p>
              <p className="mt-10 text-xl font-light leading-8">Peluquería ✨<br />Color · Mechas · Corte<br />Granada<br />📞 Reserva aquí</p>
              <p className="mt-10 text-sm leading-6 text-[var(--muted)]">Dice qué hace, pero no ayuda a entender por qué escoger el negocio.</p>
            </div>
            <div className="bg-[var(--background)] p-8">
              <p className="text-xs uppercase tracking-[.16em] text-[var(--primary)]">DIRECCIÓN PROPUESTA</p>
              <p className="mt-10 text-xl font-light leading-8">Especialistas en color y balayage en Granada.<br />Resultados naturales diseñados para ti.<br />↓ Reserva tu cita</p>
              <p className="mt-10 text-sm leading-6 text-[var(--muted)]">Más específica, más fácil de recordar y con una acción principal clara.</p>
            </div>
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
            <BuyButton placement="auditoria_instagram_mid" label="Quiero mi Instagram Reset — 29 €" />
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
            <p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">INSTAGRAM RESET / KX-001</p>
            <h2 className="mt-8 text-[clamp(2.7rem,5.5vw,5.4rem)] font-light tracking-[-.05em]">Deja de adivinar qué cambiar en tu perfil.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 opacity-70">Recibe una revisión personalizada, una nueva dirección y una lista clara de prioridades por 29 €.</p>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs uppercase tracking-[.13em] opacity-65">
              <span>Pago único</span><span>Sin contraseña</span><span>Sin reunión</span><span>≤ 48 h laborables</span>
            </div>
          </div>
          <div className="md:col-span-5 md:text-right">
            <BuyButton placement="auditoria_instagram_final" label="Comprar ahora — 29 €" />
            <div className="mt-4"><Link href="/auditoria-instagram/ejemplo" className="text-sm underline underline-offset-4 opacity-70">Ver una entrega de ejemplo antes de comprar</Link></div>
            <p className="mt-5 text-sm leading-6 opacity-65">¿Alguna duda o problema al completar la compra? <a href={whatsappOrderUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">Habla con KYRUMA por WhatsApp</a>.</p>
            <p className="mt-3 text-sm leading-6 opacity-65">¿No tienes claro si Instagram es realmente el problema? <a href="https://t.me/kyrumabot?start=seo_auditoria_instagram" target="_blank" rel="noreferrer" className="underline underline-offset-4">Haz KYRUMA MATCH gratis</a>.</p>
            <div className="mt-4"><Link href="/express/instagram-reset" className="text-sm underline underline-offset-4 opacity-65">Ver todos los detalles del servicio</Link></div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div><p className="text-lg font-medium">29 €</p><p className="text-[10px] uppercase tracking-[.12em] text-[var(--muted)]">Pago único · ≤ 48 h</p></div>
          <BuyButton placement="auditoria_instagram_mobile_sticky" label="Comprar" />
        </div>
      </div>
    </main>
  );
}