import Container from "@/components/ui/Container";

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We start by understanding the business, its context, its ambitions and the people it wants to reach.",
  },
  {
    number: "02",
    title: "Define",
    description:
      "We turn complexity into direction and establish the strategic foundations that guide every decision.",
  },
  {
    number: "03",
    title: "Create",
    description:
      "We transform strategy into identity, experiences and systems designed as one coherent whole.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "We connect design, technology and execution to bring the work into the real world.",
  },
  {
    number: "05",
    title: "Evolve",
    description:
      "We create foundations designed to adapt as the business and its ambitions continue to grow.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative bg-black py-32 md:py-48 lg:py-56"
    >
      <Container>
        <div className="flex flex-col gap-16 md:gap-24">
          {/* Label */}

          <div className="flex items-center gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500 md:text-[11px]">
              Our Method
            </span>
          </div>

          {/* Heading */}

          <div className="grid gap-16 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 className="text-4xl font-normal leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Clarity before
                <br />
                creation.
              </h2>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-base font-light leading-relaxed tracking-wide text-neutral-400 md:text-lg md:leading-loose">
                We understand what matters, define a clear direction and build
                from there.
              </p>
            </div>
          </div>

          {/* Steps */}

          <div className="flex flex-col gap-5">
            {steps.map((step) => (
              <article
                key={step.number}
                className="
                  group
                  grid
                  gap-12
                  rounded-2xl
                  border
                  border-white/[0.04]
                  bg-neutral-900/30
                  p-8
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:border-white/[0.08]
                  hover:bg-neutral-900/50
                  md:p-12
                  lg:grid-cols-12
                  lg:items-center
                "
              >
                <div className="lg:col-span-1">
                  <span className="text-xs font-medium text-[var(--primary)]">
                    {step.number}
                  </span>
                </div>

                <div className="lg:col-span-4">
                  <h3 className="text-3xl font-normal leading-[1.1] tracking-tight text-white md:text-4xl">
                    {step.title}
                  </h3>
                </div>

                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-base font-light leading-relaxed tracking-wide text-neutral-400 md:leading-loose">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Principle */}

          <div className="grid gap-12 border-t border-white/[0.06] pt-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-sm font-light tracking-wide text-neutral-600">
                The KYRUMA principle
              </span>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-2xl font-light leading-relaxed tracking-tight text-white md:text-3xl md:leading-relaxed lg:text-4xl">
                Every decision should make the business clearer, stronger and
                easier to trust.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}