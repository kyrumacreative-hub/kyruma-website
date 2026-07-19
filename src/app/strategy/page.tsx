"use client";

import { useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useTheme } from "@/components/ThemeProvider";

type Language = "es" | "en";

const translations = {
  es: {
    nav: {
      home: "Inicio",
      perspective: "Perspectiva",
      capabilities: "Capacidades",
      approach: "Enfoque",
      cta: "Iniciar Consulta",
    },
    hero: {
      eyebrow: "KYRUMA — ESTRATEGIA",
      h1: "La claridad convierte la ambición en dirección.",
      subtitle:
        "Definimos el posicionamiento, la arquitectura y la dirección estratégica que permiten a las empresas tomar mejores decisiones, construir relevancia y crecer con coherencia.",
      explore: "Explorar estrategia",
      pillars: [
        "Posicionamiento",
        "Arquitectura",
        "Dirección",
        "Crecimiento",
      ],
    },
    perspective: {
      label: "PERSPECTIVA ESTRATÉGICA — 01",
      h2First: "Antes de construir una marca,",
      h2Second: "hay que saber qué negocio estamos construyendo.",
      belief: "Nuestra perspectiva",
      body:
        "La estrategia no es un documento que se archiva. Es un sistema de decisiones. Define dónde competir, qué representar, cómo diferenciarse y qué debe permanecer coherente mientras el negocio evoluciona. Trabajamos para convertir complejidad en claridad y claridad en una dirección que pueda sostenerse en el tiempo.",
    },
    problems: {
      label: "LO QUE RESOLVEMOS — 02",
      h2First: "Cuando todo parece importante,",
      h2Second: "nada tiene una dirección clara.",
      items: [
        {
          number: "01",
          title: "Posicionamiento difuso",
          description:
            "Negocios con una propuesta valiosa que no consiguen expresar con precisión por qué importan, para quién existen o qué los hace diferentes.",
        },
        {
          number: "02",
          title: "Crecimiento sin coherencia",
          description:
            "Empresas que han evolucionado más rápido que su estrategia y necesitan ordenar su oferta, su marca y su dirección.",
        },
        {
          number: "03",
          title: "Decisiones desconectadas",
          description:
            "Equipos que toman decisiones de negocio, marca y comunicación sin un principio estratégico compartido.",
        },
      ],
    },
    capabilities: {
      label: "CAPACIDADES ESTRATÉGICAS — 03",
      h2First: "Construimos el sistema",
      h2Second: "antes de diseñar la expresión.",
      items: [
        {
          number: "01",
          title: "Business Strategy",
          description:
            "Clarificamos la dirección del negocio, sus prioridades y las decisiones estratégicas que deben guiar su evolución.",
        },
        {
          number: "02",
          title: "Market Positioning",
          description:
            "Definimos un espacio relevante y defendible en el mercado, alineando percepción, propuesta de valor y diferenciación.",
        },
        {
          number: "03",
          title: "Brand Strategy",
          description:
            "Construimos la lógica estratégica de la marca para conectar propósito, posicionamiento, personalidad y experiencia.",
        },
        {
          number: "04",
          title: "Brand Architecture",
          description:
            "Organizamos marcas, services y líneas de negocio para crear estructuras claras, escalables y comprensibles.",
        },
        {
          number: "05",
          title: "Value Proposition",
          description:
            "Articulamos qué ofrece el negocio, por qué tiene valor y por qué las personas deberían elegirlo.",
        },
        {
          number: "06",
          title: "Strategic Direction",
          description:
            "Convertimos la estrategia en principios claros capaces de orientar identidad, digital, comunicación y decisiones futuras.",
        },
      ],
    },
    approach: {
      label: "EL ENFOQUE KYRUMA — 04",
      h2: "Claridad antes de creación.",
      principleLabel: "El principio",
      principle:
        "La estrategia debe hacer que las decisiones futuras sean más claras, no más complejas.",
      items: [
        {
          number: "I.",
          title: "Entender",
          description:
            "Analizamos el negocio, su contexto, su mercado y las tensiones que están limitando su claridad.",
        },
        {
          number: "II.",
          title: "Definir",
          description:
            "Identificamos la posición que el negocio puede ocupar y las decisiones que deben sostenerla.",
        },
        {
          number: "III.",
          title: "Articular",
          description:
            "Convertimos la dirección estratégica en un sistema comprensible, accionable y compartido.",
        },
        {
          number: "IV.",
          title: "Activar",
          description:
            "La estrategia se convierte en la base para construir identidad, experiencias digitales y sistemas coherentes.",
        },
      ],
    },
    contact: {
      label: "INICIAR UNA CONVERSACIÓN",
      h2: "Una mejor dirección empieza con una conversación clara.",
      body:
        "Si tu negocio está creciendo, evolucionando o necesita redefinir su posición, podemos ayudarte a construir la claridad estratégica que necesita para avanzar.",
      cta: "Iniciar Consulta",
    },
  },

  en: {
    nav: {
      home: "Home",
      perspective: "Perspective",
      capabilities: "Capabilities",
      approach: "Approach",
      cta: "Start Consultation",
    },
    hero: {
      eyebrow: "KYRUMA — STRATEGY",
      h1: "Clarity turns ambition into direction.",
      subtitle:
        "We define the positioning, architecture and strategic direction that help businesses make better decisions, build relevance and grow with coherence.",
      explore: "Explore strategy",
      pillars: ["Positioning", "Architecture", "Direction", "Growth"],
    },
    perspective: {
      label: "STRATEGIC PERSPECTIVE — 01",
      h2First: "Before building a brand,",
      h2Second: "you need to know what business you are building.",
      belief: "Our perspective",
      body:
        "Strategy is not a document to be archived. It is a system for making decisions. It defines where to compete, what to stand for, how to differentiate and what must remain coherent as the business evolves. We turn complexity into clarity and clarity into a direction that can endure over time.",
    },
    problems: {
      label: "WHAT WE SOLVE — 02",
      h2First: "When everything feels important,",
      h2Second: "nothing has a clear direction.",
      items: [
        {
          number: "01",
          title: "Unclear positioning",
          description:
            "Businesses with valuable propositions that struggle to articulate why they matter, who they are for or what makes them different.",
        },
        {
          number: "02",
          title: "Growth without coherence",
          description:
            "Companies that have evolved faster than their strategy and need to align their offer, brand and direction.",
        },
        {
          number: "03",
          title: "Disconnected decisions",
          description:
            "Teams making business, brand and communication decisions without a shared strategic principle.",
        },
      ],
    },
    capabilities: {
      label: "STRATEGIC CAPABILITIES — 03",
      h2First: "We build the system",
      h2Second: "before designing the expression.",
      items: [
        {
          number: "01",
          title: "Business Strategy",
          description:
            "We clarify business direction, priorities and the strategic decisions that should guide its evolution.",
        },
        {
          number: "02",
          title: "Market Positioning",
          description:
            "We define a relevant and defensible market position by aligning perception, value proposition and differentiation.",
        },
        {
          number: "03",
          title: "Brand Strategy",
          description:
            "We build the strategic logic of the brand, connecting purpose, positioning, personality and experience.",
        },
        {
          number: "04",
          title: "Brand Architecture",
          description:
            "We organize brands, services and business lines into clear, scalable and understandable structures.",
        },
        {
          number: "05",
          title: "Value Proposition",
          description:
            "We articulate what the business offers, why it matters and why people should choose it.",
        },
        {
          number: "06",
          title: "Strategic Direction",
          description:
            "We turn strategy into clear principles that guide identity, digital, communication and future decisions.",
        },
      ],
    },
    approach: {
      label: "THE KYRUMA APPROACH — 04",
      h2: "Clarity before creation.",
      principleLabel: "The principle",
      principle:
        "Strategy should make future decisions clearer, not more complicated.",
      items: [
        {
          number: "I.",
          title: "Understand",
          description:
            "We analyze the business, its context, market and the tensions limiting its clarity.",
        },
        {
          number: "II.",
          title: "Define",
          description:
            "We identify the position the business can own and the decisions required to sustain it.",
        },
        {
          number: "III.",
          title: "Articulate",
          description:
            "We turn strategic direction into a system that is understandable, actionable and shared.",
        },
        {
          number: "IV.",
          title: "Activate",
          description:
            "Strategy becomes the foundation for building coherent identity, digital experiences and systems.",
        },
      ],
    },
    contact: {
      label: "START A CONVERSATION",
      h2: "Better direction starts with a clear conversation.",
      body:
        "If your business is growing, evolving or needs to redefine its position, we can help build the strategic clarity it needs to move forward.",
      cta: "Start Consultation",
    },
  },
} as const;

interface HeaderProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

function Header({ language, setLanguage }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const t = translations[language];
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > 80
      ) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { label: t.nav.perspective, href: "#perspective" },
    { label: t.nav.capabilities, href: "#capabilities" },
    { label: t.nav.approach, href: "#approach" },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full border-b transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      } ${
        isScrolled
          ? "border-[var(--border)] bg-[var(--surface)]/70 shadow-[0_8px_40px_rgba(17,17,17,0.025)] backdrop-blur-xl"
          : "border-transparent bg-[var(--background)]/60 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 md:px-12">
        <a
          href="/"
          aria-label="KYRUMA — Home"
          className="text-sm font-light uppercase tracking-[0.25em] text-[var(--foreground)] transition-all duration-500 hover:opacity-60"
        >
          KYRUMA
        </a>

        <nav
          aria-label="Strategy navigation"
          className="hidden items-center gap-10 md:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-2 text-[10px] font-light uppercase tracking-[0.18em] text-neutral-600 transition-colors duration-300 hover:text-[var(--foreground)]"
            >
              {item.label}
              <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 scale-0 rounded-full bg-[#FF5A00] opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 text-[10px] font-light uppercase tracking-[0.15em]">
            <button
              type="button"
              onClick={() => setLanguage("es")}
              className={
                language === "es"
                  ? "text-[var(--foreground)]"
                  : "text-neutral-600 hover:text-[#FF5A00]"
              }
            >
              ES
            </button>

            <span className="text-neutral-400">/</span>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={
                language === "en"
                  ? "text-[var(--foreground)]"
                  : "text-neutral-600 hover:text-[#FF5A00]"
              }
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-2" aria-label="Theme selector">
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-label="Light mode"
              aria-pressed={theme === "light"}
              title="Light"
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                theme === "light"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[#FF5A00]"
              }`}
            >
              ☀
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              aria-label="Automatic system theme"
              aria-pressed={theme === "system"}
              title="Automatic"
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                theme === "system"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[#FF5A00]"
              }`}
            >
              ◐
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              aria-label="Dark mode"
              aria-pressed={theme === "dark"}
              title="Dark"
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[#FF5A00]"
              }`}
            >
              ☾
            </button>
          </div>

          <a
            href="#contact"
            onClick={() =>
              sendGAEvent("event", "start_consultation", {
                event_category: "conversion",
                event_label: "strategy_navbar_cta",
              })
            }
            className="hidden rounded-full bg-[#111111] px-6 py-2.5 text-[10px] font-light uppercase tracking-[0.16em] !text-white transition-all duration-500 hover:bg-[#FF5A00] sm:inline-flex"
          >
            {t.nav.cta} →
          </a>
        </div>
      </div>
    </header>
  );
}

export default function StrategyPage() {
  const [language, setLanguage] = useState<Language>("es");
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    setLanguage(
      navigator.language.toLowerCase().startsWith("en") ? "en" : "es"
    );
    setLanguageReady(true);
  }, []);

  const t = translations[language];

  useEffect(() => {
    if (languageReady) {
      document.documentElement.lang = language;
    }
  }, [language, languageReady]);

  return (
    <>
      <Header language={language} setLanguage={setLanguage} />

      <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        <section
          id="home"
          className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[var(--background)] py-32 pt-44 md:py-48 md:pt-60 lg:py-56 lg:pt-64"
        >
          <div className="pointer-events-none absolute -right-[25%] top-[5%] h-[700px] w-[700px] rounded-full bg-[#FF5A00]/[0.035] blur-[140px] md:h-[1000px] md:w-[1000px]" />

          <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
            <div className="max-w-5xl">
              <span className="mb-8 block text-[10px] font-light uppercase tracking-[0.3em] text-neutral-600 md:text-xs">
                {t.hero.eyebrow}
              </span>

              <h1 className="max-w-5xl text-5xl font-light leading-[1.05] tracking-tighter text-[var(--foreground)] md:text-7xl lg:text-8xl">
                {t.hero.h1}
              </h1>

              <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-neutral-600 md:text-lg md:leading-loose">
                {t.hero.subtitle}
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-8">
                <a
                  href="#contact"
                  onClick={() =>
                    sendGAEvent("event", "start_consultation", {
                      event_category: "conversion",
                      event_label: "strategy_hero_cta",
                    })
                  }
                  className="group inline-flex items-center gap-3 rounded-full bg-[#111111] px-8 py-3.5 text-xs font-light uppercase tracking-widest !text-white transition-all duration-500 hover:bg-[#FF5A00]"
                >
                  {t.nav.cta}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </a>

                <a
                  href="#perspective"
                  className="group inline-flex items-center gap-3 text-xs font-light uppercase tracking-[0.16em] text-neutral-600 hover:text-[var(--foreground)]"
                >
                  {t.hero.explore}
                  <span className="text-[#FF5A00] transition-transform duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </a>
              </div>

              <div className="mt-24 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--border)] pt-8 text-[10px] font-light uppercase tracking-[0.25em] text-neutral-600">
                {t.hero.pillars.map((pillar, index) => (
                  <div key={pillar} className="flex items-center gap-x-8">
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
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-light uppercase tracking-[0.22em] text-neutral-600">
                {t.perspective.label}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#FF5A00]" />
            </div>

            <h2 className="mt-8 max-w-5xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
              {t.perspective.h2First}
              <br />
              <span className="text-neutral-500">
                {t.perspective.h2Second}
              </span>
            </h2>

            <div className="mt-24 grid gap-12 border-t border-[var(--border)] pt-12 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[#FF5A00]" />
                  <span className="text-sm font-light text-neutral-600">
                    {t.perspective.belief}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <p className="max-w-2xl text-base font-light leading-loose text-neutral-600 md:text-lg">
                  {t.perspective.body}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] py-32 text-white md:py-48 lg:py-56">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
            <span className="text-[10px] font-light uppercase tracking-[0.22em] text-neutral-400">
              {t.problems.label}
            </span>

            <h2 className="mt-8 max-w-5xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
              {t.problems.h2First}
              <br />
              <span className="text-neutral-500">{t.problems.h2Second}</span>
            </h2>

            <div className="mt-24 grid gap-12 border-t border-white/[0.1] pt-12 md:grid-cols-3">
              {t.problems.items.map((item) => (
                <article key={item.number}>
                  <span className="text-xs font-medium tracking-widest text-[#FF7A33]">
                    {item.number}
                  </span>
                  <h3 className="mt-8 text-2xl font-light">{item.title}</h3>
                  <p className="mt-5 text-sm font-light leading-loose text-neutral-400">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className="bg-[var(--background)] py-32 md:py-48 lg:py-56"
        >
          <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
            <span className="text-[10px] font-light uppercase tracking-[0.22em] text-neutral-600">
              {t.capabilities.label}
            </span>

            <h2 className="mt-8 max-w-5xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
              {t.capabilities.h2First}
              <br />
              <span className="text-neutral-500">
                {t.capabilities.h2Second}
              </span>
            </h2>

            <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {t.capabilities.items.map((item) => (
                <article
                  key={item.number}
                  className="group flex min-h-[320px] flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-700 hover:-translate-y-1 hover:border-[#FF5A00]/30 md:p-10"
                >
                  <span className="text-xs font-medium tracking-widest text-[#8F3300]">
                    {item.number}
                  </span>

                  <div className="mt-20">
                    <h3 className="text-2xl font-light tracking-tight md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-5 text-sm font-light leading-loose text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="approach"
          className="bg-[var(--surface)] py-32 md:py-48 lg:py-56"
        >
          <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
            <span className="text-[10px] font-light uppercase tracking-[0.22em] text-neutral-600">
              {t.approach.label}
            </span>

            <h2 className="mt-8 text-4xl font-light tracking-tight md:text-6xl">
              {t.approach.h2}
            </h2>

            <div className="mt-20 grid gap-12 border-t border-[var(--border)] pt-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-light uppercase tracking-widest text-neutral-600">
                  {t.approach.principleLabel}
                </span>
                <p className="mt-3 text-lg font-light leading-relaxed">
                  “{t.approach.principle}”
                </p>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
                {t.approach.items.map((item) => (
                  <div key={item.number}>
                    <span className="text-xs font-medium tracking-widest text-[#8F3300]">
                      {item.number}
                    </span>
                    <h3 className="mt-3 text-xl font-light">{item.title}</h3>
                    <p className="mt-3 text-sm font-light leading-relaxed text-neutral-600">
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
          <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
            <div className="max-w-3xl">
              <span className="text-[10px] font-light uppercase tracking-[0.22em] text-neutral-600">
                {t.contact.label}
              </span>

              <h2 className="mt-8 text-4xl font-light leading-tight tracking-tight md:text-6xl">
                {t.contact.h2}
              </h2>

              <p className="mt-8 text-base font-light leading-loose text-neutral-600 md:text-lg">
                {t.contact.body}
              </p>

              <a
                href="mailto:hello@kyruma.com"
                onClick={() =>
                  sendGAEvent("event", "start_consultation", {
                    event_category: "conversion",
                    event_label: "strategy_contact",
                  })
                }
                className="group mt-12 flex w-full items-center justify-between border-b border-[var(--border-strong)] pb-4 text-xl font-light transition-colors hover:border-[#FF5A00] md:text-2xl"
              >
                <span>hello@kyruma.com</span>
                <span className="text-[#FF5A00] transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}