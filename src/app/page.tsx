"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useLanguage } from "@/components/LanguageProvider";
import KyrumaBooker from "@/components/booking/KyrumaBooker";

type Language = "es" | "en";

const translations = {
  es: {
    nav: {
      services: "Servicios",
      process: "El Método",
      about: "Perspectiva",
      contact: "Contacto",
      cta: "Iniciar Consulta",
    },
    hero: {
      eyebrow: "ESTUDIO INDEPENDIENTE DE ESTRATEGIA Y NEGOCIO CREATIVO",
      h1: "Diseñamos empresas en las que la gente confía.",
      subtitle:
        "Articulamos la estrategia, la identidad visual y los ecosistemas digitales de las compañías que definen su industria. No competimos por atención; construimos legado.",
      explore: "Descubrir KYRUMA",
      pillars: ["Estrategia", "Identidad", "Digital", "Sistemas"],
    },
    perspective: {
      label: "PERSPECTIVA KYRUMA — 01",
      h2First: "La atención es fácil de conseguir.",
      h2Second: "La confianza es más difícil de ganar.",
      belief: "En qué creemos",
      body:
        "Una marca sólida no es simplemente cómo se ve un negocio. Es la claridad con la que se comunica, la coherencia con la que actúa y cómo la gente lo experimenta. Unimos estrategia, identidad y experiencia digital para ayudar a las empresas a crear claridad, construir relaciones significativas y ganarse la confianza a lo largo del tiempo.",
    },
    capabilities: {
      label: "CAPACIDADES — 02",
      h2First: "Diferentes disciplinas.",
      h2Second: "Una sola dirección.",
      explore: "Explorar",
      items: [
        {
          number: "01",
          title: "Estrategia",
          description:
            "Posicionamiento de mercado, arquitectura de marca y dirección estratégica corporativa.",
        },
        {
          number: "02",
          title: "Identidad",
          description:
            "Sistemas de identidad visual diseñados para comunicar claridad, consistencia y distinción.",
        },
        {
          number: "03",
          title: "Digital",
          description:
            "Sitios web premium y productos interactivos construidos bajo una ingeniería estética impecable.",
        },
        {
          number: "04",
          title: "Sistemas e IA",
          description:
            "Flujos de trabajo internos y sistemas impulsados por IA para mejorar la eficiencia y la escala.",
        },
      ],
    },
    method: {
      label: "EL MÉTODO — 03",
      h2: "Claridad antes de la creación.",
      principleLabel: "El principio KYRUMA",
      principle:
        "Cada decisión debe hacer que el negocio sea más claro, más fuerte y más fácil de confiar.",
      items: [
        {
          number: "I.",
          title: "Diagnóstico",
          description:
            "Analizamos la anatomía de su negocio y las ineficiencias del mercado antes de tomar decisiones.",
        },
        {
          number: "II.",
          title: "Fundamento",
          description:
            "Establecemos un núcleo estratégico definitivo que guiará cada paso corporativo futuro.",
        },
        {
          number: "III.",
          title: "Ejecución",
          description:
            "Damos forma a la identidad y la infraestructura digital en un sistema coherente y propietario.",
        },
        {
          number: "IV.",
          title: "Evolución",
          description:
            "Acompañamos la escala de la marca en el tiempo, asegurando su absoluta relevancia e impacto.",
        },
      ],
    },
    contact: {
      label: "INICIAR UNA CONVERSACIÓN",
      h2: "Creemos algo memorable.",
      body:
        "Cada gran compañía merece una marca que refleje la calidad de su propuesta. Las plazas para nuevos proyectos son limited cada trimestre.",
      cta: "Iniciar Consulta",
      footer: "Estrategia · Identidad · Digital · Sistemas",
    },
  },

  en: {
    nav: {
      services: "Services",
      process: "Method",
      about: "Perspective",
      contact: "Contact",
      cta: "Start Consultation",
    },
    hero: {
      eyebrow: "INDEPENDENT CREATIVE BUSINESS & STRATEGY STUDIO",
      h1: "We build businesses people trust.",
      subtitle:
        "Strategy, identity and digital experiences for ambitious businesses ready to become clear, relevant and unforgettable.",
      explore: "Explore KYRUMA",
      pillars: ["Strategy", "Identity", "Digital", "Systems"],
    },
    perspective: {
      label: "KYRUMA PERSPECTIVE — 01",
      h2First: "Attention is easy to get.",
      h2Second: "Trust is harder to earn.",
      belief: "What we believe",
      body:
        "A strong brand is not simply how a business looks. It is how clearly it communicates, how consistently it acts and how people experience it. We bring strategy, identity and digital experience together to help businesses create clarity, build meaningful relationships and earn trust over time.",
    },
    capabilities: {
      label: "CAPABILITIES — 02",
      h2First: "Different disciplines.",
      h2Second: "One direction.",
      explore: "Explore",
      items: [
        {
          number: "01",
          title: "Strategy",
          description:
            "Business positioning, brand architecture and strategic direction.",
        },
        {
          number: "02",
          title: "Identity",
          description:
            "Identity systems designed to communicate clarity, consistency and trust.",
        },
        {
          number: "03",
          title: "Digital",
          description:
            "Premium websites and digital products built around user experience.",
        },
        {
          number: "04",
          title: "Systems & AI",
          description:
            "Internal workflows and AI-powered systems that improve efficiency and scalability.",
        },
      ],
    },
    method: {
      label: "METHOD — 03",
      h2: "Clarity before creation.",
      principleLabel: "The KYRUMA principle",
      principle:
        "Every decision should make the business clearer, stronger and easier to trust.",
      items: [
        {
          number: "I.",
          title: "Understand",
          description:
            "We analyze the anatomy of your business and market inefficiencies before making decisions.",
        },
        {
          number: "II.",
          title: "Define",
          description:
            "We establish a definitive strategic foundation that guides every future corporate step.",
        },
        {
          number: "III.",
          title: "Create & Build",
          description:
            "We shape identity and digital infrastructure into a coherent, proprietary ecosystem.",
        },
        {
          number: "IV.",
          title: "Evolve",
          description:
            "We support the brand’s scale over time, ensuring absolute relevance and metric impact.",
        },
      ],
    },
    contact: {
      label: "START A CONVERSATION",
      h2: "Let's build something memorable.",
      body:
        "Every great company deserves a brand that reflects the quality of its value proposition. Openings for new projects are limited each quarter.",
      cta: "Start Consultation",
      footer: "Strategy · Identity · Digital · Systems",
    },
  },
} as const;

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language as Language] || translations.es;

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
        transition-colors
        duration-700
        ease-[cubic-bezier(0.16,1,0.3,1)]
      "
    >
      <section
        id="home"
        className="
          relative
          flex
          min-h-screen
          flex-col
          justify-between
          overflow-hidden
          bg-[var(--background)]
          py-32
          pt-44
          md:py-48
          md:pt-60
          lg:py-56
          lg:pt-64
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[25%]
            top-[5%]
            h-[700px]
            w-[700px]
            rounded-full
            bg-[#FF5A00]/[0.035]
            blur-[140px]
            md:h-[1000px]
            md:w-[1000px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[10%]
            top-[38%]
            hidden
            h-2
            w-2
            rounded-full
            bg-[#FF5A00]
            shadow-[0_0_40px_rgba(255,90,0,0.35)]
            lg:block
          "
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="max-w-5xl">
            <span
              className="
                mb-8
                block
                text-[10px]
                font-light
                uppercase
                tracking-[0.3em]
                text-neutral-600
                md:text-xs
              "
            >
              {t.hero.eyebrow}
            </span>

            <h1
              className="
                max-w-5xl
                text-5xl
                font-light
                leading-[1.05]
                tracking-tighter
                text-[var(--foreground)]
                md:text-7xl
                lg:text-8xl
              "
            >
              {t.hero.h1}
            </h1>

            <p
              className="
                mt-8
                max-w-xl
                text-base
                font-light
                leading-relaxed
                text-neutral-600
                md:text-lg
                md:leading-loose
              "
            >
              {t.hero.subtitle}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-8">
              <a
                href="#contact"
                onClick={() =>
                  sendGAEvent("event", "start_consultation", {
                    event_category: "conversion",
                    event_label: "hero_cta",
                  })
                }
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  bg-[#111111]
                  px-8
                  py-3.5
                  text-xs
                  font-light
                  uppercase
                  tracking-widest
                  !text-white
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:scale-[1.02]
                  hover:bg-[#FF5A00]
                  hover:shadow-[0_14px_40px_rgba(255,90,0,0.18)]
                "
              >
                <span
                  className="
                    inline-block
                    !text-white
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:-translate-y-[1px]
                  "
                >
                  {t.nav.cta}
                </span>

                <span
                  aria-hidden="true"
                  className="
                    inline-block
                    !text-white
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </a>

              <a
                href="#perspective"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  text-xs
                  font-light
                  uppercase
                  tracking-[0.16em]
                  text-neutral-600
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:text-[var(--foreground)]
                "
              >
                {t.hero.explore}

                <span
                  aria-hidden="true"
                  className="
                    text-[#FF5A00]
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:translate-x-2
                  "
                >
                  →
                </span>
              </a>
            </div>

            <div
              className="
                mt-24
                flex
                flex-wrap
                gap-x-8
                gap-y-4
                border-t
                border-[var(--border)]
                pt-8
                text-[10px]
                font-light
                uppercase
                tracking-[0.25em]
                text-neutral-600
              "
            >
              {t.hero.pillars.map((pillar, index) => (
                <div
                  key={pillar}
                  className="flex items-center gap-x-8"
                >
                  <span>{pillar}</span>

                  {index < t.hero.pillars.length - 1 && (
                    <span className="text-[#FF5A00]">·</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="perspective"
        className="bg-[var(--surface)] py-32 md:py-48 lg:py-56"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="flex items-center">
            <span
              className="
                text-[10px]
                font-light
                uppercase
                tracking-widest
                text-neutral-600
              "
            >
              {t.perspective.label}
            </span>

            <span className="ml-2 inline-block h-1 w-1 rounded-full bg-[#FF5A00]" />
          </div>

          <h2
            className="
              mt-4
              max-w-4xl
              text-4xl
              font-light
              leading-tight
              tracking-tight
              text-[var(--foreground)]
              md:text-6xl
            "
          >
            {t.perspective.h2First}
            <br />

            <span className="text-neutral-500">
              {t.perspective.h2Second}
            </span>
          </h2>

          <div
            className="
              mt-24
              grid
              gap-12
              border-t
              border-[var(--border)]
              pt-12
              md:mt-32
              lg:grid-cols-12
            "
          >
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#FF5A00]" />

                <span className="text-sm font-light text-neutral-600">
                  {t.perspective.belief}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p
                className="
                  max-w-2xl
                  text-base
                  font-light
                  leading-loose
                  text-neutral-600
                  md:text-lg
                "
              >
                {t.perspective.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="capabilities"
        className="bg-[var(--background)] py-32 md:py-48 lg:py-56"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="flex items-center gap-3">
            <span
              className="
                text-[10px]
                font-light
                uppercase
                tracking-[0.22em]
                text-neutral-600
              "
            >
              {t.capabilities.label}
            </span>

            <span className="h-1 w-1 rounded-full bg-[#FF5A00]" />
          </div>

          <h2
            className="
              mt-8
              max-w-4xl
              text-4xl
              font-light
              leading-relaxed
              tracking-tight
              text-[var(--foreground)]
              md:text-5xl
              lg:text-6xl
            "
          >
            {t.capabilities.h2First}
            <br />

            <span className="text-neutral-500">
              {t.capabilities.h2Second}
            </span>
          </h2>

          <div className="mt-20 grid grid-cols-1 gap-8 md:mt-28 md:grid-cols-2 md:gap-12">
            {t.capabilities.items.map((capability) => (
              <article
                key={capability.number}
                className="
                  group
                  relative
                  flex
                  min-h-[280px]
                  flex-col
                  justify-between
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-8
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:-translate-y-1
                  hover:border-[#FF5A00]/30
                  hover:shadow-[0_30px_60px_rgba(0,0,0,0.01),0_0_50px_rgba(255,90,0,0.03)]
                  md:p-12
                "
              >
                <div className="relative flex justify-end">
                  <span
                    className="
                      text-xs
                      font-light
                      tracking-[0.16em]
                      text-neutral-500
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:text-[#FF5A00]
                    "
                  >
                    {capability.number}
                  </span>
                </div>

                <div className="relative mt-20">
                  <h3
                    className="
                      text-3xl
                      font-light
                      leading-relaxed
                      tracking-[-0.035em]
                      text-[var(--foreground)]
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:-translate-y-1
                      md:text-4xl
                    "
                  >
                    {capability.title}
                  </h3>

                  <p
                    className="
                      mt-6
                      max-w-md
                      text-base
                      font-light
                      leading-loose
                      text-neutral-600
                    "
                  >
                    {capability.description}
                  </p>

                  <div
                    className="
                      mt-8
                      flex
                      items-center
                      gap-3
                      text-xs
                      font-light
                      uppercase
                      tracking-[0.16em]
                      text-neutral-500
                      opacity-0
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:translate-x-1
                      group-hover:text-[#FF5A00]
                      group-hover:opacity-100
                    "
                  >
                    <span>{t.capabilities.explore}</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-[#FF5A00]
                    transition-all
                    duration-700
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:w-full
                  "
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="method"
        className="bg-[var(--surface)] py-32 md:py-48 lg:py-56"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="flex items-center gap-3">
            <span
              className="
                text-[10px]
                font-light
                uppercase
                tracking-[0.22em]
                text-neutral-600
              "
            >
              {t.method.label}
            </span>

            <span className="h-1 w-1 rounded-full bg-[#FF5A00]" />
          </div>

          <h2
            className="
              mt-8
              text-4xl
              font-light
              leading-relaxed
              tracking-tight
              text-[var(--foreground)]
              md:text-5xl
              lg:text-6xl
            "
          >
            {t.method.h2}
          </h2>

          <div className="mt-20 grid grid-cols-1 gap-12 border-t border-[var(--border)] pt-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-light uppercase tracking-widest text-neutral-600">
                  {t.method.principleLabel}
                </span>
                <p className="text-lg font-light leading-relaxed text-[var(--foreground)]">
                  “{t.method.principle}”
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:col-start-5">
              {t.method.items.map((item) => (
                <div key={item.number} className="flex flex-col gap-3">
                  <span className="text-xs font-medium tracking-widest text-[#8F3300]">
                    {item.number}
                  </span>
                  <h3 className="text-xl font-light text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-neutral-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-[var(--background)] py-32 md:py-48 lg:py-56"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[20%] bottom-0 h-[600px] w-[600px] rounded-full bg-[#FF5A00]/[0.02] blur-[120px]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-light uppercase tracking-[0.22em] text-neutral-600">
                {t.contact.label}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#FF5A00]" />
            </div>

            <h2 className="mt-8 text-4xl font-light leading-tight tracking-tight text-[var(--foreground)] md:text-6xl">
              {t.contact.h2}
            </h2>

            <p className="mt-8 text-base font-light leading-loose text-neutral-600 md:text-lg">
              {t.contact.body}
            </p>

            <div className="mt-12">
              <a
                href="mailto:hello@kyruma.com"
                onClick={() =>
                  sendGAEvent("event", "start_consultation", {
                    event_category: "conversion",
                    event_label: "contact_card",
                  })
                }
                className="
                  group
                  relative
                  flex
                  w-full
                  items-center
                  justify-between
                  border-b
                  border-[var(--border-strong)]
                  pb-4
                  text-xl
                  font-light
                  text-[var(--foreground)]
                  transition-colors
                  duration-300
                  hover:border-[#FF5A00]
                  md:text-2xl
                "
              >
                <span>hello@kyruma.com</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2 text-[#FF5A00]">
                  →
                </span>
              </a>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
              <KyrumaBooker />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}