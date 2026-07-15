import BackgroundGrid from "@/components/ui/BackgroundGrid";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import HeroVisual from "@/components/ui/HeroVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F7F7F5]">

      <BackgroundGrid />

      <Container className="relative">

        <div className="grid min-h-screen items-center gap-20 pt-28 lg:grid-cols-2">

          {/* LEFT */}

          <div className="relative z-10 max-w-[620px]">

            <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FF5A00] backdrop-blur-xl">
              Boutique Strategy & Brand Studio
            </span>

            <h1 className="mt-10 text-[72px] font-black leading-[0.88] tracking-[-0.08em] text-[#111111] xl:text-[96px]">

              We build

              <br />

              businesses

              <br />

              people trust.

            </h1>

            <p className="mt-10 max-w-[520px] text-[19px] leading-[1.9] text-zinc-500">

              Strategy, identity and digital experiences for ambitious
              companies that want to become unforgettable brands.

            </p>

            <div className="mt-14 flex items-center gap-5">

              <Button href="#contact">

                Start Project

              </Button>

              <Button
                href="#services"
                variant="secondary"
              >

                Our Method

              </Button>

            </div>

            <div className="mt-24 flex flex-wrap gap-8 text-sm text-zinc-400">

              <span>Strategy</span>

              <span>Identity</span>

              <span>Experience</span>

              <span>Systems</span>

              <span>AI</span>

            </div>

          </div>

          {/* RIGHT */}

          <HeroVisual />

        </div>

      </Container>

    </section>
  );
}