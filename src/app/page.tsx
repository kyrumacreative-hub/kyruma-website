"use client";

import { FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  es: {
    hero: {
      eyebrow: "CREATIVE PARTNER · ESTRATEGIA, IDENTIDAD Y DIGITAL",
      titleA: "Tu empresa puede haber evolucionado.",
      titleB: "La percepción de tu marca quizá no.",
      body: "Alineamos estrategia, identidad y experiencia digital para que la forma en la que tu empresa es percibida esté a la altura del negocio que has construido.",
      cta: "Iniciar una conversación",
      explore: "Descubrir el enfoque",
    },
    problem: {
      label: "LA BRECHA DE PERCEPCIÓN — 01",
      title: "Cuando el negocio evoluciona más rápido que su marca, aparece una distancia.",
      body: "Producto, equipo, ambición y capacidad pueden haber cambiado mientras identidad, mensaje y experiencia siguen representando una etapa anterior. Esa diferencia afecta a cómo una empresa es entendida, valorada y recordada.",
      close: "KYRUMA trabaja para cerrar esa distancia.",
    },
    offer: {
      label: "QUÉ HACEMOS — 02",
      title: "Una dirección. Tres capas que trabajan juntas.",
      items: [
        ["01", "Estrategia", "Definimos antes de diseñar.", "Posicionamiento, propuesta de valor, arquitectura de marca, narrativa y dirección para tomar mejores decisiones."],
        ["02", "Identidad", "Convertimos la estrategia en un sistema reconocible.", "Una identidad verbal y visual coherente, construida para representar correctamente el negocio."],
        ["03", "Experiencia Digital", "Llevamos la marca a los lugares donde las personas la experimentan.", "Experiencias digitales claras, útiles y preparadas para convertir percepción en relación."],
      ],
    },
    method: {
      label: "EL MÉTODO — 03",
      title: "Claridad antes de la creación.",
      items: [
        ["I", "Entender", "Analizamos negocio, contexto, audiencia y percepción antes de proponer soluciones."],
        ["II", "Definir", "Construimos una dirección estratégica compartida y criterios claros de decisión."],
        ["III", "Crear", "Traducimos esa dirección a identidad y experiencia con un único sistema coherente."],
        ["IV", "Evolucionar", "Acompañamos el sistema para mantener coherencia a medida que el negocio crece."],
      ],
    },
    work: {
      label: "CASE STUDIES — 04",
      title: "El trabajo debe demostrar lo que las palabras prometen.",
      body: "Nuestros casos se documentan como contexto → intervención → resultado. Solo publicamos resultados que podamos verificar. Los primeros case studies de KYRUMA se incorporarán aquí cuando su documentación esté cerrada.",
      note: "Sin métricas inventadas. Sin resultados inflados. La evidencia también construye confianza.",
    },
    systems: {
      label: "SYSTEMS & AI",
      title: "La estrategia define. La identidad expresa. Digital crea la experiencia. Los sistemas ayudan a escalarla.",
      body: "Cuando aporta valor real, conectamos procesos, automatización e IA con el ecosistema de marca. La tecnología permanece detrás de la experiencia: útil, integrada e invisible.",
    },
    closing: {
      label: "UNA CONVERSACIÓN PUEDE SER EL PRINCIPIO",
      title: "Si tu negocio ha cambiado, quizá sea el momento de que su percepción también lo haga.",
      body: "Cuéntanos dónde estás y qué quieres construir. Te responderemos con criterio, no con una propuesta genérica.",
    },
    form: {
      name: "Nombre",
      company: "Empresa",
      email: "Email profesional",
      help: "¿En qué podemos ayudarte?",
      helpOptions: ["Estrategia", "Identidad", "Experiencia Digital", "Systems & AI", "Necesito orientación"],
      collaboration: "¿Qué tipo de colaboración estás buscando?",
      collaborationOptions: ["Creative Partnership · colaboración continuada", "Proyecto específico", "Por definir juntos"],
      need: "Cuéntanos sobre tu empresa y qué quieres conseguir",
      submit: "Iniciar conversación",
      privacy: "Al continuar, aceptas que KYRUMA utilice estos datos únicamente para responder a tu consulta.",
    },
  },
  en: {
    hero: {
      eyebrow: "CREATIVE PARTNER · STRATEGY, IDENTITY & DIGITAL",
      titleA: "Your business may have evolved.",
      titleB: "The way people perceive it may not have.",
      body: "We align strategy, identity and digital experience so the way your company is perceived reflects the business you have built.",
      cta: "Start a conversation",
      explore: "Explore our approach",
    },
    problem: {
      label: "THE PERCEPTION GAP — 01",
      title: "When the business evolves faster than its brand, a gap appears.",
      body: "Product, team, ambition and capabilities may have changed while identity, message and experience still represent an earlier stage. That distance affects how a company is understood, valued and remembered.",
      close: "KYRUMA works to close that distance.",
    },
    offer: {
      label: "WHAT WE DO — 02",
      title: "One direction. Three layers working together.",
      items: [
        ["01", "Strategy", "We define before we design.", "Positioning, value proposition, brand architecture, narrative and direction for better decisions."],
        ["02", "Identity", "We turn strategy into a recognizable system.", "A coherent verbal and visual identity built to represent the business accurately."],
        ["03", "Digital Experience", "We take the brand where people experience it.", "Clear, useful digital experiences designed to turn perception into relationship."],
      ],
    },
    method: {
      label: "METHOD — 03",
      title: "Clarity before creation.",
      items: [
        ["I", "Understand", "We examine the business, context, audience and perception before proposing solutions."],
        ["II", "Define", "We build a shared strategic direction and clear criteria for decision-making."],
        ["III", "Create", "We translate that direction into identity and experience through one coherent system."],
        ["IV", "Evolve", "We support the system so it remains coherent as the business grows."],
      ],
    },
    work: {
      label: "CASE STUDIES — 04",
      title: "The work should prove what the words promise.",
      body: "Our cases are documented as context → intervention → result. We only publish results we can verify. KYRUMA's first case studies will appear here once their documentation is complete.",
      note: "No invented metrics. No inflated outcomes. Evidence builds trust too.",
    },
    systems: {
      label: "SYSTEMS & AI",
      title: "Strategy defines. Identity expresses. Digital creates the experience. Systems help it scale.",
      body: "When it creates real value, we connect processes, automation and AI to the brand ecosystem. Technology stays behind the experience: useful, integrated and invisible.",
    },
    closing: {
      label: "A CONVERSATION CAN BE THE BEGINNING",
      title: "If your business has changed, it may be time for its perception to change too.",
      body: "Tell us where you are and what you want to build. We will respond with perspective, not a generic proposal.",
    },
    form: {
      name: "Name",
      company: "Company",
      email: "Work email",
      help: "How can we help?",
      helpOptions: ["Strategy", "Identity", "Digital Experience", "Systems & AI", "I need guidance"],
      collaboration: "What kind of collaboration are you looking for?",
      collaborationOptions: ["Creative Partnership · ongoing collaboration", "Specific project", "To define together"],
      need: "Tell us about your company and what you want to achieve",
      submit: "Start conversation",
      privacy: "By continuing, you agree that KYRUMA may use this information only to respond to your enquiry.",
    },
  },
} as const;

function Label({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}<span className="accent-dot" /></p>;
}

export default function Home() {
  const { language } = useLanguage();
  const t = copy[language];

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`KYRUMA — ${data.get("company") || data.get("name")}`);
    const body = encodeURIComponent(
      `${t.form.name}: ${data.get("name")}\n${t.form.company}: ${data.get("company")}\n${t.form.email}: ${data.get("email")}\n${t.form.help}: ${data.get("help")}\n${t.form.collaboration}: ${data.get("collaboration")}\n\n${t.form.need}:\n${data.get("need")}`
    );
    sendGAEvent("event", "contact_submit", { event_category: "conversion", collaboration: data.get("collaboration"), help: data.get("help") });
    window.location.href = `mailto:hello@kyruma.com?subject=${subject}&body=${body}`;
  }

  return (
    <main id="top" className="overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <section id="home" className="relative flex min-h-[100svh] items-end pt-36 md:pt-44">
        <div className="site-container w-full pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-[1100px]">
            <Label>{t.hero.eyebrow}</Label>
            <h1 className="mt-8 max-w-[1080px] text-[clamp(3.25rem,8.2vw,7.5rem)] font-light leading-[0.96] tracking-[-0.055em]">
              {t.hero.titleA}<br /><span className="text-[var(--muted)]">{t.hero.titleB}</span>
            </h1>
            <div className="mt-10 grid gap-8 border-t border-[var(--border)] pt-8 md:mt-14 md:grid-cols-12 md:items-end">
              <p className="max-w-[620px] text-base font-light leading-[1.75] text-[var(--muted)] md:col-span-7 md:text-lg">{t.hero.body}</p>
              <div className="flex flex-wrap gap-6 md:col-span-5 md:justify-end">
                <a className="button-primary" href="#contact" onClick={() => sendGAEvent("event", "start_consultation", { event_category: "conversion", event_label: "hero" })}>{t.hero.cta}<span>→</span></a>
                <a className="text-link" href="#perspective">{t.hero.explore}<span>↓</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="perspective" className="section surface-section">
        <div className="site-container">
          <Label>{t.problem.label}</Label>
          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <h2 className="section-title lg:col-span-8">{t.problem.title}</h2>
            <div className="lg:col-span-4 lg:pt-3">
              <p className="body-copy">{t.problem.body}</p>
              <p className="mt-8 text-base font-normal leading-relaxed text-[var(--foreground)]">{t.problem.close}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="section">
        <div className="site-container">
          <Label>{t.offer.label}</Label>
          <h2 className="section-title mt-8 max-w-4xl">{t.offer.title}</h2>
          <div className="mt-16 border-t border-[var(--border)] md:mt-24">
            {t.offer.items.map(([number, title, lead, body]) => (
              <article key={number} className="group grid gap-6 border-b border-[var(--border)] py-10 md:grid-cols-12 md:py-14">
                <p className="micro md:col-span-1">{number}</p>
                <h3 className="text-3xl font-light tracking-[-0.035em] md:col-span-3 md:text-4xl">{title}</h3>
                <p className="text-base font-normal leading-relaxed md:col-span-3">{lead}</p>
                <p className="body-copy md:col-span-4 md:col-start-9">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="section surface-section">
        <div className="site-container">
          <Label>{t.method.label}</Label>
          <h2 className="section-title mt-8">{t.method.title}</h2>
          <div className="mt-16 grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] md:mt-24 md:grid-cols-2 lg:grid-cols-4">
            {t.method.items.map(([number, title, body]) => (
              <article key={number} className="min-h-[280px] bg-[var(--surface)] p-7 md:p-9">
                <p className="micro">{number}</p>
                <h3 className="mt-16 text-2xl font-light tracking-[-0.03em]">{title}</h3>
                <p className="body-copy mt-5 text-sm">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="section">
        <div className="site-container">
          <Label>{t.work.label}</Label>
          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <h2 className="section-title lg:col-span-7">{t.work.title}</h2>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="body-copy">{t.work.body}</p>
              <p className="mt-8 border-l border-[var(--primary)] pl-5 text-sm font-light leading-relaxed text-[var(--muted)]">{t.work.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="systems" className="section border-y border-[var(--border)]">
        <div className="site-container grid gap-10 lg:grid-cols-12">
          <Label>{t.systems.label}</Label>
          <h2 className="text-3xl font-light leading-[1.08] tracking-[-0.04em] md:text-5xl lg:col-span-7 lg:col-start-4">{t.systems.title}</h2>
          <p className="body-copy lg:col-span-3 lg:col-start-10">{t.systems.body}</p>
        </div>
      </section>

      <section id="contact" className="section surface-section">
        <div className="site-container">
          <Label>{t.closing.label}</Label>
          <div className="mt-8 grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 className="section-title">{t.closing.title}</h2>
              <p className="body-copy mt-8 max-w-xl">{t.closing.body}</p>
            </div>
            <form onSubmit={submitContact} className="grid gap-7 lg:col-span-5 lg:col-start-8">
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="field"><span>{t.form.name}</span><input name="name" required autoComplete="name" /></label>
                <label className="field"><span>{t.form.company}</span><input name="company" required autoComplete="organization" /></label>
              </div>
              <label className="field"><span>{t.form.email}</span><input name="email" required type="email" autoComplete="email" /></label>
              <label className="field">
                <span>{t.form.help}</span>
                <select name="help" required defaultValue="">
                  <option value="" disabled>—</option>
                  {t.form.helpOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="field">
                <span>{t.form.collaboration}</span>
                <select name="collaboration" required defaultValue="">
                  <option value="" disabled>—</option>
                  {t.form.collaborationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="field"><span>{t.form.need}</span><textarea name="need" required rows={5} /></label>
              <div className="flex flex-col items-start gap-4">
                <button className="button-primary" type="submit">{t.form.submit}<span>→</span></button>
                <p className="max-w-md text-[11px] font-light leading-relaxed text-[var(--muted)]">{t.form.privacy}</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
