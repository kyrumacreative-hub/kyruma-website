import CinematicReveal from "@/components/ui/CinematicReveal";

const capabilities = [
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
];

const method = [
  {
    number: "I.",
    title: "Understand",
    description:
      "Analizamos la anatomía de tu negocio, su contexto y el mercado antes de tomar decisiones.",
  },
  {
    number: "II.",
    title: "Define",
    description:
      "Establecemos un fundamento estratégico que aporta claridad y dirección a cada paso futuro.",
  },
  {
    number: "III.",
    title: "Create & Build",
    description:
      "Damos forma a la identidad y a la infraestructura digital como partes de un único sistema coherente.",
  },
  {
    number: "IV.",
    title: "Evolve",
    description:
      "Construimos bases preparadas para evolucionar con el negocio, manteniendo consistencia, claridad e impacto.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F7F5] text-[#111111]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="
          relative
          flex
          min-h-screen
          flex-col
          justify-between
          overflow-hidden
          bg-[#F7F7F5]
          pt-44
          pb-12
          md:pt-60
          md:pb-16
        "
      >
        {/* Ambient orange glow */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[20%]
            top-[5%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#FF5A00]/[0.035]
            blur-[120px]
            md:h-[900px]
            md:w-[900px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[12%]
            top-[32%]
            h-2
            w-2
            rounded-full
            bg-[#FF5A00]
            shadow-[0_0_35px_rgba(255,90,0,0.35)]
          "
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="max-w-5xl">
            {/* Eyebrow */}

            <div className="mb-8 flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-[#FF5A00]" />

              <span
                className="
                  text-[10px]
                  font-light
                  uppercase
                  tracking-[0.3em]
                  text-neutral-400
                  md:text-xs
                "
              >
                Independent Creative Business Studio
              </span>
            </div>

            {/* Hero heading */}

            <h1
              className="
                max-w-5xl
                text-5xl
                font-light
                leading-[1.05]
                tracking-[-0.055em]
                text-[#111111]
                md:text-7xl
                lg:text-8xl
              "
            >
              We build businesses
              <br className="hidden sm:block" /> people trust.
            </h1>

            {/* Hero copy */}

            <p
              className="
                mt-8
                max-w-xl
                text-base
                font-light
                leading-relaxed
                text-neutral-500
                md:text-lg
                md:leading-loose
              "
            >
              Strategy, identity and digital experiences for ambitious
              businesses ready to become clear, relevant and unforgettable.
            </p>

            {/* Hero CTAs */}

            <div className="mt-12 flex flex-wrap items-center gap-8">
              <a
                href="#contact"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  border
                  border-transparent
                  bg-[#111111]
                  px-7
                  py-4
                  text-xs
                  font-light
                  uppercase
                  tracking-[0.16em]
                  text-white
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:scale-[1.02]
                  hover:bg-[#FF5A00]
                  hover:shadow-[0_14px_40px_rgba(255,90,0,0.18)]
                "
              >
                <span
                  className="
                    inline-block
                    transition-transform
                    duration-700
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:-translate-y-[2px]
                  "
                >
                  Iniciar Consulta
                </span>

                <span
                  className="
                    inline-block
                    transition-transform
                    duration-700
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
                  text-neutral-500
                  transition-colors
                  duration-700
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:text-[#111111]
                "
              >
                Explore KYRUMA

                <span
                  className="
                    text-[#FF5A00]
                    transition-transform
                    duration-700
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:translate-x-2
                  "
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Hero pillars */}

        <div className="relative mx-auto mt-24 w-full max-w-6xl px-6 md:px-12">
          <div
            className="
              flex
              flex-wrap
              gap-x-8
              gap-y-3
              border-t
              border-black/5
              pt-8
              text-[10px]
              font-light
              uppercase
              tracking-[0.25em]
              text-neutral-400
            "
          >
            <span>Strategy</span>
            <span className="text-[#FF5A00]">·</span>
            <span>Identity</span>
            <span className="text-[#FF5A00]">·</span>
            <span>Digital</span>
            <span className="text-[#FF5A00]">·</span>
            <span>Systems</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          PERSPECTIVE
      ====================================================== */}

      <section
        id="perspective"
        className="relative bg-white py-32 md:py-48 lg:py-56"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <CinematicReveal>
            <div className="flex items-center gap-3">
              <span
                className="
                  text-[10px]
                  font-light
                  uppercase
                  tracking-[0.22em]
                  text-neutral-400
                "
              >
                KYRUMA Perspective — 01
              </span>

              <span
                className="
                  h-1
                  w-1
                  rounded-full
                  bg-[#FF5A00]
                  shadow-[0_0_18px_rgba(255,90,0,0.3)]
                "
              />
            </div>

            <h2
              className="
                mt-8
                max-w-4xl
                text-4xl
                font-light
                leading-[1.12]
                tracking-[-0.04em]
                text-[#111111]
                md:text-6xl
                lg:text-7xl
              "
            >
              Attention is easy to get.
              <br />
              <span className="text-neutral-300">
                Trust is harder to earn.
              </span>
            </h2>
          </CinematicReveal>

          <div
            className="
              mt-24
              grid
              gap-12
              border-t
              border-black/5
              pt-12
              md:mt-32
              lg:grid-cols-12
            "
          >
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#FF5A00]" />

                <p className="text-sm font-light text-neutral-400">
                  What we believe
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p
                className="
                  text-xl
                  font-light
                  leading-relaxed
                  tracking-[-0.015em]
                  text-[#111111]
                  md:text-2xl
                  md:leading-relaxed
                "
              >
                A strong brand is not simply how a business looks. It is how
                clearly it communicates, how consistently it acts and how
                people experience it.
              </p>

              <p
                className="
                  mt-10
                  max-w-2xl
                  text-base
                  font-light
                  leading-loose
                  text-neutral-500
                  md:text-lg
                "
              >
                We bring strategy, identity and digital experience together
                to help businesses create clarity, build meaningful
                relationships and earn trust over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CAPABILITIES
      ====================================================== */}

      <section
        id="services"
        className="bg-[#F7F7F5] py-32 md:py-48 lg:py-56"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <CinematicReveal>
            <div className="flex items-center gap-3">
              <span
                className="
                  text-[10px]
                  font-light
                  uppercase
                  tracking-[0.22em]
                  text-neutral-400
                "
              >
                Capabilities — 02
              </span>

              <span className="h-1 w-1 rounded-full bg-[#FF5A00]" />
            </div>

            <h2
              className="
                mt-8
                max-w-3xl
                text-4xl
                font-light
                leading-[1.12]
                tracking-[-0.04em]
                text-[#111111]
                md:text-5xl
                lg:text-6xl
              "
            >
              Different disciplines.
              <br />
              <span className="text-neutral-300">
                One direction.
              </span>
            </h2>
          </CinematicReveal>

          <div className="mt-20 grid grid-cols-1 gap-8 md:mt-28 md:grid-cols-2 md:gap-12">
            {capabilities.map((capability) => (
              <article
                key={capability.number}
                className="
                  group
                  relative
                  flex
                  min-h-[320px]
                  flex-col
                  justify-between
                  overflow-hidden
                  rounded-3xl
                  border
                  border-black/5
                  bg-white
                  p-8
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:-translate-y-1
                  hover:border-[#FF5A00]/20
                  hover:shadow-[0_24px_60px_rgba(0,0,0,0.025),0_0_50px_rgba(255,90,0,0.035)]
                  md:p-12
                "
              >
                {/* Orange ambient card glow */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-48
                    w-48
                    rounded-full
                    bg-[#FF5A00]/0
                    blur-[70px]
                    transition-all
                    duration-1000
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:bg-[#FF5A00]/[0.06]
                  "
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      translate-x-2
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F7F7F5]
                      text-sm
                      text-neutral-300
                      opacity-0
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:translate-x-0
                      group-hover:bg-[#FF5A00]
                      group-hover:text-white
                      group-hover:opacity-100
                    "
                  >
                    ↗
                  </span>

                  <span
                    className="
                      text-xs
                      font-light
                      tracking-[0.16em]
                      text-neutral-300
                      transition-colors
                      duration-500
                      ease-[cubic-bezier(0.25,1,0.5,1)]
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
                      tracking-[-0.035em]
                      text-[#111111]
                      transition-transform
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
                      text-neutral-500
                    "
                  >
                    {capability.description}
                  </p>
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
                    duration-1000
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:w-full
                  "
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          METHOD
      ====================================================== */}

      <section
        id="process"
        className="bg-white py-32 md:py-48 lg:py-56"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <CinematicReveal>
            <div className="flex items-center gap-3">
              <span
                className="
                  text-[10px]
                  font-light
                  uppercase
                  tracking-[0.22em]
                  text-neutral-400
                "
              >
                Method — 03
              </span>

              <span className="h-1 w-1 rounded-full bg-[#FF5A00]" />
            </div>

            <h2
              className="
                mt-8
                text-4xl
                font-light
                leading-[1.12]
                tracking-[-0.04em]
                text-[#111111]
                md:text-5xl
                lg:text-6xl
              "
            >
              Clarity before creation.
            </h2>
          </CinematicReveal>

          <div className="mt-20 md:mt-28">
            {method.map((step) => (
              <article
                key={step.number}
                className="
                  group
                  relative
                  grid
                  grid-cols-1
                  gap-8
                  overflow-hidden
                  border-t
                  border-black/5
                  py-12
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  md:grid-cols-12
                  md:gap-6
                  md:py-16
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    left-0
                    top-0
                    h-px
                    w-0
                    bg-[#FF5A00]
                    transition-all
                    duration-1000
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:w-full
                  "
                />

                <div className="md:col-span-1">
                  <span
                    className="
                      text-xs
                      font-light
                      text-neutral-300
                      transition-colors
                      duration-500
                      ease-[cubic-bezier(0.25,1,0.5,1)]
                      group-hover:text-[#FF5A00]
                    "
                  >
                    {step.number}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <h3
                    className="
                      text-2xl
                      font-light
                      tracking-[-0.025em]
                      text-[#111111]
                      transition-transform
                      duration-700
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:translate-x-2
                      md:text-3xl
                    "
                  >
                    {step.title}
                  </h3>
                </div>

                <div className="md:col-span-6 md:col-start-7">
                  <p
                    className="
                      max-w-xl
                      text-base
                      font-light
                      leading-loose
                      text-neutral-500
                    "
                  >
                    {step.description}
                  </p>
                </div>
              </article>
            ))}

            <div className="border-t border-black/5" />
          </div>

          {/* Principle */}

          <div
            className="
              mt-24
              grid
              gap-10
              md:mt-32
              lg:grid-cols-12
            "
          >
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A00]" />

                <span className="text-sm font-light text-neutral-400">
                  The KYRUMA principle
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p
                className="
                  text-2xl
                  font-light
                  leading-relaxed
                  tracking-[-0.025em]
                  text-[#111111]
                  md:text-3xl
                  lg:text-4xl
                "
              >
                Every decision should make the business clearer, stronger and
                easier to trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT — KYRUMA BRAND MOMENT
      ====================================================== */}

      <section
        id="contact"
        className="
          relative
          overflow-hidden
          bg-[#FF5A00]
          py-32
          md:py-48
          lg:py-56
        "
      >
        {/* Light ambient layer */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[20%]
            -top-[30%]
            h-[700px]
            w-[700px]
            rounded-full
            bg-white/[0.1]
            blur-[120px]
          "
        />

        {/* Dark ambient layer */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-[40%]
            -left-[10%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-black/[0.05]
            blur-[120px]
          "
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-12">
          <CinematicReveal>
            <div className="flex items-center gap-3">
              <span
                className="
                  text-[10px]
                  font-light
                  uppercase
                  tracking-[0.22em]
                  text-black/50
                "
              >
                Start a Conversation
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
            </div>

            <h2
              className="
                mt-8
                max-w-5xl
                text-5xl
                font-light
                leading-[1.02]
                tracking-[-0.055em]
                text-[#111111]
                md:text-7xl
                lg:text-8xl
              "
            >
              Creemos algo
              <br />
              memorable.
            </h2>
          </CinematicReveal>

          <div
            className="
              mt-24
              grid
              gap-16
              border-t
              border-black/15
              pt-12
              md:mt-32
              lg:grid-cols-12
              lg:items-end
            "
          >
            <div className="lg:col-span-5">
              <p
                className="
                  max-w-lg
                  text-base
                  font-light
                  leading-loose
                  text-black/60
                  md:text-lg
                "
              >
                Cada gran compañía merece una marca que refleje la calidad de
                su propuesta. Trabajamos con un número limitado de proyectos
                para dedicar a cada colaboración la atención que merece.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <a
                href="mailto:hello@kyruma.com"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-6
                  border-b
                  border-black/30
                  pb-7
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:border-black
                "
              >
                <span
                  className="
                    text-[clamp(1.5rem,4vw,3.5rem)]
                    font-light
                    tracking-[-0.04em]
                    text-[#111111]
                    transition-transform
                    duration-700
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:translate-x-1
                  "
                >
                  hello@kyruma.com
                </span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#111111]
                    text-xl
                    text-white
                    transition-all
                    duration-700
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:translate-x-2
                    group-hover:scale-[1.06]
                    group-hover:bg-white
                    group-hover:text-[#FF5A00]
                    group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]
                    md:h-16
                    md:w-16
                  "
                >
                  →
                </span>
              </a>

              <p className="mt-5 text-sm font-light text-black/40">
                New business enquiries and collaborations.
              </p>
            </div>
          </div>

          {/* Footer */}

          <footer
            className="
              mt-32
              flex
              flex-col
              gap-6
              border-t
              border-black/15
              pt-8
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span
              className="
                text-[10px]
                font-light
                uppercase
                tracking-[0.22em]
                text-black/45
              "
            >
              KYRUMA — Creative Business Studio
            </span>

            <span
              className="
                text-[10px]
                font-light
                uppercase
                tracking-[0.18em]
                text-black/45
              "
            >
              Strategy · Identity · Digital · Systems
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}