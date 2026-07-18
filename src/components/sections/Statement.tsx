import Container from "@/components/ui/Container";

export default function Statement() {
  return (
    <section
      id="statement"
      className="relative overflow-hidden bg-white py-32 md:py-40 lg:py-48"
    >
      <Container>
        {/* Section label */}

        <div className="flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500 md:text-[11px]">
            Our Perspective
          </span>
        </div>

        {/* Main statement */}

        <div className="mt-16 max-w-[1100px]">
          <h2 className="text-[clamp(3.5rem,7vw,6.75rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[var(--foreground)]">
            Attention is easy
            <br />
            to get.
            <br />

            <span className="text-zinc-300">
              Trust is harder
              <br />
              to earn.
            </span>
          </h2>
        </div>

        {/* Perspective content */}

        <div className="mt-28 grid gap-12 border-t border-black/10 pt-10 lg:grid-cols-12">
          {/* Label */}

          <div className="lg:col-span-3">
            <p className="text-sm font-medium text-[var(--foreground)]">
              What we believe
            </p>
          </div>

          {/* Content */}

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-xl font-medium leading-[1.55] text-[var(--foreground)] md:text-2xl lg:text-[1.75rem]">
              A strong brand is not simply how a business looks.
              It is how clearly it communicates, how consistently it acts
              and how people experience it.
            </p>

            <p className="mt-10 max-w-[650px] text-base leading-[1.8] text-[var(--muted)] md:text-lg">
              We bring strategy, identity and digital experience together
              to help businesses create clarity, build meaningful
              relationships and earn trust over time.
            </p>
          </div>
        </div>

        {/* Closing principle */}

        <div className="mt-28 flex flex-col gap-6 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-zinc-400">
            Every detail communicates.
          </p>

          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
            KYRUMA Perspective — 01
          </span>
        </div>
      </Container>
    </section>
  );
}