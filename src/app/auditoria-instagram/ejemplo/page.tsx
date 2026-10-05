import type { Metadata } from "next";
import Link from "next/link";
import TrackedShopLink from "@/components/express/TrackedShopLink";
import { expressProduct } from "@/data/express";

export const metadata: Metadata = {
  title: "Ejemplo de Instagram Reset | KYRUMA",
  description: "Mira un ejemplo ilustrativo de la entrega de Instagram Reset: diagnóstico, bio, CTA, destacados, dirección visual, contenido y prioridades.",
  alternates: { canonical: "/auditoria-instagram/ejemplo" },
  openGraph: {
    title: "Ejemplo de entrega · Instagram Reset — 29 € | KYRUMA",
    description: "Un ejemplo transparente de lo que puedes recibir con Instagram Reset. Caso ficticio, estructura real del servicio.",
    url: "/auditoria-instagram/ejemplo",
    type: "website",
  },
};

const score = [
  ["Claridad", "11/20", "Se entiende el sector, pero no la especialización ni el beneficio principal."],
  ["Posicionamiento", "8/20", "El perfil enumera servicios, pero no explica por qué elegir este negocio."],
  ["Conversión", "10/20", "Existe una vía de reserva, aunque compite con demasiadas llamadas a la acción."],
  ["Visual", "13/20", "Hay material de calidad, pero la portada y los destacados no funcionan como sistema."],
  ["Contenido", "12/20", "Se muestran trabajos, pero falta una estructura que responda dudas y genere deseo."],
] as const;

const priorities = [
  ["AHORA", "Reescribir nombre visible, bio y CTA para que una persona entienda la propuesta en segundos."],
  ["DESPUÉS", "Reordenar destacados en cuatro bloques: Resultados, Servicios, Proceso y Reserva."],
  ["SIGUIENTE", "Construir tres formatos recurrentes de contenido para demostrar criterio, resultado y confianza."],
] as const;

export default function InstagramResetSamplePage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="flex min-h-[88svh] items-end border-b border-[var(--border)] pt-36">
        <div className="site-container pb-20 md:pb-28">
          <p className="section-label">INSTAGRAM RESET / EJEMPLO DE ENTREGA<span className="accent-dot" /></p>
          <h1 className="mt-8 max-w-[1120px] text-[clamp(3.2rem,8vw,7rem)] font-light leading-[.96] tracking-[-.055em]">
            Antes de pagar, <span className="text-[var(--muted)]">mira qué tipo de trabajo recibes.</span>
          </h1>
          <div className="mt-12 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="max-w-2xl text-lg font-light leading-[1.75] text-[var(--muted)]">Este caso es completamente ficticio. No es un cliente ni pretende mostrar resultados obtenidos. Lo usamos para enseñar de forma transparente la profundidad y estructura de una entrega de Instagram Reset.</p>
              <p className="mt-5 text-xs uppercase tracking-[.16em] text-[var(--primary)]">EJEMPLO FICTICIO · SIN TESTIMONIOS NI MÉTRICAS INVENTADAS</p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <TrackedShopLink href={expressProduct.shopUrl} placement="sample_page_hero" className="button-primary inline-flex">Quiero mi Instagram Reset — 29 € <span>→</span></TrackedShopLink>
                <Link href="/auditoria-instagram" className="text-sm underline underline-offset-4">Ver todos los detalles</Link>
              </div>
            </div>
            <div className="md:col-span-5 md:text-right">
              <p className="text-5xl font-light">29 €</p>
              <p className="mt-3 text-xs uppercase tracking-[.16em] text-[var(--muted)]">Tu revisión sí será personalizada</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="section-label">CASO FICTICIO<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.6rem,5vw,4.8rem)] font-light leading-[1.03] tracking-[-.045em]">Estudio Aura.</h2>
            <p className="mt-5 leading-7 text-[var(--muted)]">Salón de color y cuidado capilar en Granada. Buen trabajo offline, perfil correcto pero genérico y poca diferenciación al llegar por primera vez.</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="border border-[var(--border)] p-8 md:p-10">
              <p className="text-xs uppercase tracking-[.16em] text-[var(--muted)]">PERFIL DE PARTIDA</p>
              <p className="mt-8 text-2xl font-light leading-9">Estudio Aura ✨<br />Peluquería · Color · Corte<br />Granada<br />📞 Reserva tu cita</p>
              <p className="mt-8 leading-7 text-[var(--muted)]">Correcto, pero intercambiable con muchos negocios del mismo sector. No explica especialización, resultado esperado ni una razón clara para elegirlo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="section-label">01 / DIAGNÓSTICO<span className="accent-dot" /></p>
              <h2 className="mt-8 text-[clamp(2.7rem,5vw,5rem)] font-light tracking-[-.045em]">Profile Score ilustrativo.</h2>
            </div>
            <div className="md:col-span-5 md:text-right"><p className="text-7xl font-light tracking-[-.06em]">54<span className="text-2xl text-[var(--muted)]">/100</span></p></div>
          </div>
          <div className="mt-12 border-t border-[var(--border)]">
            {score.map(([title, value, body]) => (
              <article key={title} className="grid gap-4 border-b border-[var(--border)] py-7 md:grid-cols-12 md:items-center">
                <p className="text-xl font-light md:col-span-3">{title}</p>
                <p className="text-sm font-medium text-[var(--primary)] md:col-span-2">{value}</p>
                <p className="leading-7 text-[var(--muted)] md:col-span-6 md:col-start-7">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-5 border-t border-[var(--border)] pt-7 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">¿Te basta con ver cómo diagnosticamos el perfil? Tu revisión se construye sobre tu negocio real, no sobre este ejemplo.</p>
            <TrackedShopLink href={expressProduct.shopUrl} placement="sample_page_after_score" className="button-primary inline-flex shrink-0">Empezar mi auditoría — 29 € <span>→</span></TrackedShopLink>
          </div>
          <p className="mt-5 text-xs leading-6 text-[var(--muted)]">La puntuación de este ejemplo es inventada únicamente para enseñar cómo estructuramos el diagnóstico. En una compra real, cada puntuación debe estar razonada a partir del perfil analizado.</p>
        </div>
      </section>

      <section className="section bg-[var(--foreground)] text-[var(--background)]">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">02 / RESET DEL PERFIL</p>
            <h2 className="mt-8 text-[clamp(2.7rem,5vw,5rem)] font-light tracking-[-.045em]">De genérico a específico.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-xs uppercase tracking-[.16em] opacity-55">NOMBRE VISIBLE PROPUESTO</p>
            <p className="mt-4 text-2xl font-light">Estudio Aura · Color & Balayage Granada</p>
            <div className="mt-10 border-t border-white/15 pt-8">
              <p className="text-xs uppercase tracking-[.16em] opacity-55">BIO PROPUESTA</p>
              <p className="mt-5 text-2xl font-light leading-9">Color y balayage diseñados para verse naturales.<br />Especialistas en cabellos que necesitan recuperar luz y dimensión.<br />Granada · ↓ Reserva tu diagnóstico</p>
            </div>
            <div className="mt-10 border-t border-white/15 pt-8">
              <p className="text-xs uppercase tracking-[.16em] opacity-55">CTA PRINCIPAL</p>
              <p className="mt-5 text-xl font-light">Reserva tu diagnóstico de color →</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="section-label">03 / DESTACADOS<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,4.7rem)] font-light tracking-[-.045em]">Que el perfil responda antes de que pregunten.</h2>
          </div>
          <div className="grid gap-px bg-[var(--border)] md:col-span-7 md:col-start-6 md:grid-cols-2">
            {[
              ["01", "RESULTADOS", "Antes/después y casos explicados, no solo fotografías."],
              ["02", "SERVICIOS", "Qué hacemos, para quién y qué problema resuelve cada servicio."],
              ["03", "PROCESO", "Qué ocurre desde la primera consulta hasta el resultado final."],
              ["04", "RESERVA", "Precio orientativo si procede, preguntas frecuentes y una única vía de acción."],
            ].map(([number, title, body]) => <article key={title} className="bg-[var(--background)] p-8"><p className="text-xs text-[var(--primary)]">{number}</p><h3 className="mt-10 text-2xl font-light">{title}</h3><p className="mt-4 leading-7 text-[var(--muted)]">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">04 / CONTENIDO<span className="accent-dot" /></p>
            <h2 className="mt-8 text-[clamp(2.5rem,5vw,4.8rem)] font-light tracking-[-.045em]">Tres ideas para empezar con dirección.</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {[
              ["01", "Por qué tu balayage se ve plano a las pocas semanas", "Educación + criterio + problema reconocible."],
              ["02", "Este resultado no empezó el día de la cita", "Proceso, diagnóstico y decisiones detrás del antes/después."],
              ["03", "3 señales de que necesitas corregir color y no volver a teñir encima", "Utilidad inmediata que demuestra especialización."],
            ].map(([n, title, body]) => <article key={n} className="border-t border-[var(--border)] py-7"><p className="text-xs text-[var(--primary)]">{n}</p><h3 className="mt-4 text-xl font-light">{title}</h3><p className="mt-3 leading-7 text-[var(--muted)]">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section surface-section">
        <div className="site-container">
          <p className="section-label">05 / PRIORIDADES<span className="accent-dot" /></p>
          <div className="mt-12 border-t border-[var(--border)]">
            {priorities.map(([when, body]) => <article key={when} className="grid gap-5 border-b border-[var(--border)] py-8 md:grid-cols-12"><p className="text-xs font-medium tracking-[.16em] text-[var(--primary)] md:col-span-3">{when}</p><p className="text-lg font-light leading-8 md:col-span-7 md:col-start-5">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section bg-[var(--foreground)] text-[var(--background)]">
        <div className="site-container grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[.2em] text-[var(--primary)]">ESTO ES SOLO EL EJEMPLO</p>
            <h2 className="mt-8 text-[clamp(3rem,6vw,5.8rem)] font-light leading-[.98] tracking-[-.055em]">Tu entrega se construye sobre tu negocio.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 opacity-70">Analizamos tu perfil real, tu oferta, tu público y el objetivo que nos indiques. No copiamos esta solución ni usamos una plantilla cerrada.</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-5xl font-light">29 €</p>
            <TrackedShopLink href={expressProduct.shopUrl} placement="sample_page_final" className="button-primary mt-7 inline-flex">Quiero mi Instagram Reset <span>→</span></TrackedShopLink>
            <div className="mt-5"><Link href="/auditoria-instagram" className="text-sm underline underline-offset-4 opacity-70">Volver a la auditoría</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
