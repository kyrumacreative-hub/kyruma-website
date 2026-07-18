import CinematicReveal from "@/components/ui/CinematicReveal";
import Container from "@/components/ui/Container";

export default function Statement() {
  return (
    <section
      id="statement"
      className="relative overflow-hidden bg-black py-32 md:py-48 lg:py-56"
    >
      {/* Ambient light */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-[30%]
          top-[10%]
          h-[800px]
          w-[800px]
          rounded-full
          bg-white/[0.015]
          blur-[180px]
        "
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-16 md:gap-24">
          {/* Section label */}

          <div className="flex items-center gap-4">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500 md:text-[11px]">
              Our Perspective
            </span>
          </div>

          {/* Main statement */}

          <CinematicReveal className="max-w-6xl">
            <h2 className="text-4xl font-normal leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              Attention is easy
              <br />
              to get.
              <br />

              <span className="text-neutral-600">
                Trust is harder
                <br />
                to earn.
              </span>
            </h2>
          </CinematicReveal>

          {/* Perspective content */}

          <div
            className="
              grid
              gap-12
              border-t
              border-white/[0.06]
              pt-12
              lg:grid-cols-12
              lg:gap-16
            "
          >
            {/* Label */}

            <div className="lg:col-span-3">
              <p className="text-sm font-light tracking-wide text-neutral-600">
                What we believe
              </p>
            </div>

            {/* Content */}

            <div className="flex flex-col gap-10 lg:col-span-7 lg:col-start-6">
              <p className="text-xl font-light leading-relaxed tracking-tight text-white md:text-2xl md:leading-relaxed lg:text-3xl">
                A strong brand is not simply how a business looks. It is how
                clearly it communicates, how consistently it acts and how
                people experience it.
              </p>

              <p className="max-w-2xl text-base font-light leading-relaxed tracking-wide text-neutral-400 md:text-lg md:leading-loose">
                We bring strategy, identity and digital experience together to
                help businesses create clarity, build meaningful relationships
                and earn trust over time.
              </p>
            </div>
          </div>

          {/* Closing principle */}

          <div
            className="
              flex
              flex-col
              gap-6
              border-t
              border-white/[0.06]
              pt-8
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p className="text-sm font-light tracking-wide text-neutral-600">
              Every detail communicates.
            </p>

            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-700">
              KYRUMA Perspective — 01
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}