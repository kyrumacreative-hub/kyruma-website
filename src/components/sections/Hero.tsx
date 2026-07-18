import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black py-32 md:py-48 lg:py-56">
      {/* Ambient light */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[25%] -top-[30%] h-[900px] w-[900px] rounded-full bg-[#FF5A00]/[0.05] blur-[200px]"
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24">
          {/* Eyebrow */}

          <div className="flex items-center gap-4">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500 md:text-[11px]">
              Independent Creative Business Studio
            </span>
          </div>

          {/* Main title */}

          <div className="max-w-6xl">
            <h1 className="text-5xl font-light leading-[1.05] tracking-tighter text-white md:text-7xl md:leading-[1.02] lg:text-8xl">
              We build businesses
              <br className="hidden md:block" />
              {" "}people trust.
            </h1>
          </div>

          {/* Supporting content */}

          <div className="grid gap-16 border-t border-white/[0.06] pt-12 lg:grid-cols-12 lg:items-end">
            <div className="hidden lg:col-span-5 lg:block">
              <p className="text-sm font-light tracking-wide text-neutral-600">
                Strategy · Identity · Digital · Systems
              </p>
            </div>

            <div className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
              <p className="max-w-xl text-base font-light leading-relaxed tracking-wide text-neutral-400 md:text-lg md:leading-loose">
                Strategy, identity and digital experiences for ambitious
                businesses ready to become clear, relevant and unforgettable.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button href="#contact">
                  Start a Project
                </Button>

                <Button
                  href="#services"
                  variant="secondary"
                >
                  Explore KYRUMA
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll */}

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
            <span className="text-xs font-light tracking-wide text-neutral-600 lg:hidden">
              Strategy · Identity · Digital · Systems
            </span>

            <a
              href="#statement"
              className="ml-auto text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-600 hover:text-white"
            >
              Scroll to explore ↓
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}