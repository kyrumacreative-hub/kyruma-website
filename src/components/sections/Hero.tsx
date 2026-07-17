import BackgroundGrid from "@/components/ui/BackgroundGrid";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import HeroVisual from "@/components/ui/HeroVisual";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F7F5]">

      <BackgroundGrid />

      <Container className="relative z-10 flex min-h-screen items-center">

        <div className="grid w-full items-center gap-24 lg:grid-cols-2">

          {/* LEFT */}

          <div className="max-w-[640px]">

            <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.35em] text-[#FF5A00] backdrop-blur-xl">
              Independent Creative Business Studio
            </span>

            <h1 className="mt-10 text-[clamp(4rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-[#111111]">

              We build
              <br />
              businesses
              <br />
              people trust.

            </h1>

            <p className="mt-10 max-w-[560px] text-[20px] leading-[1.8] text-zinc-500">

              Strategy, identity and digital experiences
              designed to help ambitious companies become
              brands people believe in.

            </p>

            <div className="mt-14 flex flex-wrap gap-4">

              <Button href="#contact">
                Start a Project
              </Button>

              <Button
                href="#process"
                variant="secondary"
              >
                Explore our Process
              </Button>

            </div>

            <div className="mt-20 flex gap-8 text-sm text-zinc-400">

              <span>Strategy</span>

              <span>Identity</span>

              <span>Experience</span>

              <span>Systems</span>

            </div>

          </div>

          {/* RIGHT */}

          <HeroVisual />

        </div>

      </Container>

    </section>
  );
}