import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";

import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Ambient Light */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[#FF5A00]/[0.05] blur-[220px]"
      />

      <Container className="relative z-10">
        <div className="flex min-h-screen flex-col justify-center py-28 lg:py-36">

          <Stagger>

            {/* Eyebrow */}

            <Reveal
              variant="fade"
              delay={0.05}
            >
              <div className="flex items-center gap-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500 md:text-[11px]">
                  Independent Creative Business Studio
                </span>
              </div>
            </Reveal>

            {/* Heading */}

            <Reveal
              variant="up"
              delay={0.15}
            >
              <div className="mt-10 max-w-6xl">
                <h1 className="text-5xl font-light leading-[1.02] tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
                  We build businesses
                  <br />
                  people trust.
                </h1>
              </div>
            </Reveal>

            {/* Intro */}

            <Reveal
              variant="up"
              delay={0.30}
            >
              <div className="mt-12 grid gap-14 lg:grid-cols-12">

                <div className="lg:col-span-7">
                  <p className="max-w-xl text-lg leading-relaxed text-neutral-400">
                    Strategy, identity and digital experiences for ambitious
                    businesses ready to become clear, relevant and unforgettable.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-4">

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

                <div className="hidden items-end justify-end lg:flex lg:col-span-5">

                  <div className="text-right text-sm uppercase tracking-[0.28em] text-neutral-600">
                    Strategy
                    <br />
                    Identity
                    <br />
                    Digital
                    <br />
                    Systems
                  </div>

                </div>

              </div>
            </Reveal>

            {/* Visual */}

            <Reveal
              variant="scale"
              delay={0.45}
            >
              <div className="mt-24">
                <HeroVisual />
              </div>
            </Reveal>

            {/* Scroll */}

            <Reveal
              variant="fade"
              delay={0.6}
            >
              <div className="mt-16 flex justify-end">

                <a
                  href="#statement"
                  className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-600 transition-colors hover:text-white"
                >
                  Scroll to explore ↓
                </a>

              </div>
            </Reveal>

          </Stagger>

        </div>
      </Container>
    </section>
  );
}