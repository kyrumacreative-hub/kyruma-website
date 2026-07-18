import CinematicReveal from "@/components/ui/CinematicReveal";
import Container from "@/components/ui/Container";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[var(--primary)] py-32 md:py-48 lg:py-56"
    >
      {/* Ambient geometry */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-[600px]
          w-[600px]
          rounded-full
          border
          border-black/10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-[400px]
          w-[400px]
          rounded-full
          border
          border-black/10
        "
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-16 md:gap-24">
          {/* Section label */}

          <div className="flex items-center gap-4">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/60 md:text-[11px]">
              Start a Conversation
            </span>
          </div>

          {/* Main statement */}

          <CinematicReveal className="max-w-6xl">
            <h2 className="text-5xl font-light leading-[1.05] tracking-tighter !text-black md:text-7xl md:leading-[1.02] lg:text-8xl">
              Have something
              <br />
              ambitious in mind?
            </h2>
          </CinematicReveal>

          {/* Contact content */}

          <div
            className="
              grid
              gap-16
              border-t
              border-black/20
              pt-12
              lg:grid-cols-12
              lg:items-end
            "
          >
            {/* Supporting content */}

            <div className="lg:col-span-4">
              <p className="max-w-md text-base font-light leading-relaxed tracking-wide !text-black/65 md:text-lg md:leading-loose">
                Tell us what you are building, where you want to go and what
                needs to change to get there.
              </p>
            </div>

            {/* Main CTA */}

            <div className="lg:col-span-7 lg:col-start-6">
              <a
                href="mailto:hello@kyruma.com"
                className="group block"
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-8
                    border-b
                    border-black/30
                    pb-8
                    transition-all
                    duration-700
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    group-hover:border-black
                  "
                >
                  <span
                    className="
                      text-[clamp(1.75rem,4vw,3.75rem)]
                      font-normal
                      tracking-tight
                      text-black
                      transition-transform
                      duration-700
                      ease-[cubic-bezier(0.25,1,0.5,1)]
                      group-hover:-translate-y-0.5
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
                      border
                      border-black
                      bg-black
                      text-xl
                      text-white
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.25,1,0.5,1)]
                      group-hover:translate-x-1
                      group-hover:scale-[1.02]
                      group-hover:bg-black/90
                      md:h-16
                      md:w-16
                    "
                  >
                    →
                  </span>
                </div>
              </a>

              <p className="mt-6 text-sm font-light tracking-wide !text-black/50">
                New business enquiries and collaborations.
              </p>
            </div>
          </div>

          {/* Bottom line */}

          <div
            className="
              flex
              flex-col
              gap-6
              border-t
              border-black/20
              pt-8
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40">
              KYRUMA — Let&apos;s build something meaningful.
            </span>

            <span className="text-sm font-light tracking-wide text-black/40">
              Strategy · Identity · Digital · Systems
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}