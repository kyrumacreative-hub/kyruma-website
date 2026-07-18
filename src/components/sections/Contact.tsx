import Container from "@/components/ui/Container";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[var(--primary)] py-32 md:py-40 lg:py-48"
    >
      {/* Subtle decorative element */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-black/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full border border-black/10"
      />

      <Container className="relative z-10">
        {/* Section label */}

        <div className="flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-black" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/60 md:text-[11px]">
            Start a Conversation
          </span>
        </div>

        {/* Main statement */}

        <div className="mt-16 max-w-[1150px]">
          <h2 className="text-[clamp(4rem,8vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.07em] !text-black">
            Have something
            <br />
            ambitious in mind?
          </h2>
        </div>

        {/* Contact content */}

        <div className="mt-28 grid gap-16 border-t border-black/20 pt-10 lg:grid-cols-12 lg:items-end">
          {/* Supporting content */}

          <div className="lg:col-span-4">
            <p className="max-w-[440px] !text-lg leading-[1.7] !text-black/65">
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
              <div className="flex items-center justify-between gap-8 border-b border-black pb-6">
                <span className="text-[clamp(1.75rem,4vw,3.75rem)] font-semibold tracking-[-0.055em] text-black">
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
                    bg-black
                    text-xl
                    text-white
                    transition-transform
                    duration-300
                    group-hover:translate-x-2
                    md:h-16
                    md:w-16
                  "
                >
                  →
                </span>
              </div>
            </a>

            <p className="mt-5 !text-sm !text-black/50">
              New business enquiries and collaborations.
            </p>
          </div>
        </div>

        {/* Bottom line */}

        <div className="mt-32 flex flex-col gap-5 border-t border-black/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
            KYRUMA — Let&apos;s build something meaningful.
          </span>

          <span className="text-sm font-medium text-black/40">
            Strategy · Identity · Digital · Systems
          </span>
        </div>
      </Container>
    </section>
  );
}