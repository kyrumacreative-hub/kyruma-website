import CinematicReveal from "@/components/ui/CinematicReveal";
import Container from "@/components/ui/Container";

const capabilities = [
  {
    number: "01",
    title: "Strategy",
    description:
      "We define the strategic foundations that give businesses clarity, direction and a distinctive position.",
    areas: ["Positioning", "Brand Strategy", "Messaging", "Direction"],
  },
  {
    number: "02",
    title: "Identity",
    description:
      "We translate strategy into distinctive visual systems designed to create recognition, consistency and meaning.",
    areas: ["Visual Identity", "Art Direction", "Brand Systems", "Guidelines"],
  },
  {
    number: "03",
    title: "Digital",
    description:
      "We create digital experiences where clarity, functionality and expression come together at every interaction.",
    areas: ["Web Design", "Digital Experience", "Development", "Interaction"],
  },
  {
    number: "04",
    title: "Systems",
    description:
      "We connect processes, technology and intelligent tools to help businesses operate with greater clarity and efficiency.",
    areas: ["Automation", "AI", "Workflows", "Business Systems"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#09090b] py-32 md:py-48 lg:py-56"
    >
      {/* Ambient depth */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[30%]
          top-[15%]
          h-[900px]
          w-[900px]
          rounded-full
          bg-white/[0.012]
          blur-[200px]
        "
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-16 md:gap-24">
          {/* Section label */}

          <div className="flex items-center gap-4">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500 md:text-[11px]">
              Capabilities
            </span>
          </div>

          {/* Main heading */}

          <CinematicReveal className="max-w-5xl">
            <h2 className="text-4xl font-normal leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              Different disciplines.
              <br />

              <span className="text-neutral-500">
                One direction.
              </span>
            </h2>
          </CinematicReveal>

          {/* Introduction */}

          <div className="grid gap-12 border-t border-white/[0.06] pt-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="text-sm font-light tracking-wide text-neutral-600">
                What we do
              </span>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-base font-light leading-relaxed tracking-wide text-neutral-400 md:text-lg md:leading-loose">
                We work across strategy, identity, digital experiences and
                systems to create businesses that communicate and operate as
                one coherent whole.
              </p>
            </div>
          </div>

          {/* Bento Grid */}

          <div className="grid gap-6 md:grid-cols-2">
            {capabilities.map((capability) => (
              <article
                key={capability.number}
                className="
                  group
                  flex
                  min-h-[420px]
                  flex-col
                  justify-between
                  rounded-2xl
                  border
                  border-white/[0.04]
                  bg-neutral-900/30
                  p-8
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:-translate-y-1
                  hover:border-white/[0.08]
                  hover:bg-neutral-900/50
                  hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_rgba(0,0,0,0.18)]
                  md:p-12
                "
              >
                {/* Card top */}

                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-[var(--primary)]">
                    {capability.number}
                  </span>

                  <span
                    aria-hidden="true"
                    className="
                      text-xl
                      font-light
                      text-neutral-700
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.25,1,0.5,1)]
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                      group-hover:text-white
                    "
                  >
                    ↗
                  </span>
                </div>

                {/* Card content */}

                <div className="mt-24">
                  <h3 className="text-3xl font-normal leading-[1.1] tracking-tight text-white md:text-4xl">
                    {capability.title}
                  </h3>

                  <p className="mt-8 max-w-md text-base font-light leading-relaxed tracking-wide text-neutral-400 md:leading-loose">
                    {capability.description}
                  </p>

                  <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">
                    {capability.areas.map((area) => (
                      <span
                        key={area}
                        className="
                          text-xs
                          font-light
                          tracking-wide
                          text-neutral-600
                          transition-colors
                          duration-700
                          ease-[cubic-bezier(0.25,1,0.5,1)]
                          group-hover:text-neutral-500
                        "
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}