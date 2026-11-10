import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diseño, redes y webs a precios claros | KYRUMA Express",
  description: "Diseño para negocios, artistas y personas con ideas. Carteles desde 25 €, reels desde 35 €, packs de redes desde 59 € y webs desde 199 €. Escríbenos sin compromiso.",
  alternates: { canonical: "/express" },
};

const services = [
  { number: "01", title: "Cartel o diseño para redes", price: "25 €", description: "Una pieza digital personalizada, lista para publicar.", detail: "Incluye un formato y una ronda de ajustes.", slug: "Cartel o diseño para redes — 25 €" },
  { number: "02", title: "Edición de reel", price: "35 €", description: "Un vídeo vertical de hasta 30 segundos a partir de tu material.", detail: "Incluye montaje, subtítulos básicos y una ronda de ajustes.", slug: "Edición de reel — 35 €" },
  { number: "03", title: "Pack de redes", price: "59 €", description: "Cuatro publicaciones para presentar mejor tu negocio.", detail: "Diseño con textos e imágenes proporcionados por el cliente.", slug: "Pack de cuatro publicaciones — 59 €" },
  { number: "04", title: "Identidad básica", price: "89 €", description: "Una base visual sencilla y coherente para empezar.", detail: "Logotipo sencillo, paleta, tipografías y archivos finales.", slug: "Identidad básica — 89 €" },
  { number: "05", title: "Tu primera web", price: "Desde 199 €", description: "Una página responsive para explicar lo que haces y facilitar el contacto.", detail: "Alcance acordado antes de empezar. Dominio y servicios externos no incluidos.", slug: "Web esencial — desde 199 €" },
];

function emailLink(service: string) {
  const subject = encodeURIComponent("Quiero contratar KYRUMA — " + service);
  const body = encodeURIComponent(["Hola, me interesa " + service + ".", "", "Mi nombre:", "Mi proyecto:", "Cuándo lo necesitaría:", "", "¿Me podéis confirmar disponibilidad, alcance y plazo?"].join("\n"));
  return "mailto:hello@kyruma.com?subject=" + subject + "&body=" + body;
}

export default function ExpressPage() {
  return (
    <main className="overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <section className="site-container pt-36 pb-20 md:pt-48 md:pb-28">
        <p className="section-label">KYRUMA / EXPRESS <span className="accent-dot" /></p>
        <h1 className="mt-8 max-w-5xl text-[clamp(3.2rem,8vw,7rem)] font-light leading-[0.98] tracking-[-0.055em]">
          Tu idea merece <span className="text-[var(--muted)]">verse bien.</span>
        </h1>
        <p className="mt-9 max-w-2xl text-lg font-light leading-relaxed text-[var(--muted)]">
          Diseño, redes y webs para pequeños negocios, artistas y personas con buenas ideas.
          Precios claros, trato cercano y proyectos sin complicaciones.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <a className="button-primary" href="#cartel-express">Oferta de lanzamiento · Cartel por 25 € <span>↓</span></a>
          <a className="text-link" href={emailLink("Quiero contaros mi idea")}>Cuéntanos tu idea <span>→</span></a>
        </div>
      </section>

      <section id="precios" className="section surface-section">
        <div className="site-container">
          <p className="section-label">SERVICIOS Y PRECIOS <span className="accent-dot" /></p>
          <h2 className="section-title mt-8">Empieza por lo que necesitas.</h2>
          <p className="body-copy mt-6 max-w-2xl">No hace falta contratar un proyecto enorme para trabajar con nosotros. Elige una solución concreta y cuéntanos qué necesitas.</p>
          <div className="mt-14 grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
            {services.map((item) => (
              <article key={item.number} id={item.number === "01" ? "cartel-express" : undefined} className="flex scroll-mt-28 flex-col bg-[var(--surface)] p-7 md:p-10">
                <p className="micro">{item.number} / KYRUMA EXPRESS</p>
                <h3 className="mt-9 text-2xl font-light tracking-[-0.035em] md:text-3xl">{item.title}</h3>
                <p className="mt-5 text-4xl font-light tracking-[-0.04em]">{item.price}</p>
                <p className="mt-7 text-base leading-relaxed">{item.description}</p>
                <p className="body-copy mt-2 text-sm">{item.detail}</p>
                <div className="mt-auto pt-10">
                  <a className="button-primary" href={emailLink(item.slug)}>Me interesa <span>→</span></a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            Los precios indicados son finales para el alcance descrito e incluyen los impuestos que correspondan. La web esencial parte de 199 € y te confirmaremos el total antes de contratar según el alcance. Los extras se presupuestan por separado. Al pulsar «Me interesa» se abre un correo.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container grid gap-12 lg:grid-cols-2">
          <div>
            <p className="section-label">CÓMO FUNCIONA <span className="accent-dot" /></p>
            <h2 className="section-title mt-8">Fácil desde el primer mensaje.</h2>
          </div>
          <div className="space-y-9">
            <div><p className="micro">01 / ESCRÍBENOS</p><p className="mt-2 text-lg">Cuéntanos qué necesitas y para cuándo.</p></div>
            <div><p className="micro">02 / TE CONFIRMAMOS</p><p className="mt-2 text-lg">Confirmaremos el alcance, el plazo y la forma de pago antes de empezar.</p></div>
            <div><p className="micro">03 / LO HACEMOS REALIDAD</p><p className="mt-2 text-lg">Preparamos tu diseño y te lo entregamos con los ajustes incluidos.</p></div>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container">
          <p className="section-label">HABLEMOS <span className="accent-dot" /></p>
          <h2 className="section-title mt-8 max-w-3xl">¿Tienes algo en mente? Escríbenos.</h2>
          <p className="body-copy mt-7 max-w-xl">No necesitas saber de diseño ni tener un briefing perfecto. Cuéntanos la idea y te ayudamos a concretarla.</p>
          <div className="mt-9 flex flex-wrap gap-6">
            <a className="button-primary" href={emailLink("Quiero contaros mi proyecto")}>Contar mi idea <span>→</span></a>
            <Link className="text-link" href="/">Conocer KYRUMA <span>↗</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
