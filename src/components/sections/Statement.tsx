import Container from "@/components/ui/Container";

export default function Statement() {
  return (
    <section className="bg-white py-44">
      <Container>
        <div className="mx-auto max-w-5xl">

          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FF5A00]">
            Our Perspective
          </p>

          <h2 className="mt-10 text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#111111]">
            Most companies
            <br />
            chase attention.
            <br />
            <br />
            The best
            <br />
            earn trust.
          </h2>

          <div className="mt-20 max-w-2xl">

            <p className="text-xl leading-[1.9] text-zinc-500">

              Trust doesn't happen by accident.

              It is the result of thousands of intentional decisions —
              strategy, positioning, design and every interaction a person
              has with your business.

            </p>

            <p className="mt-8 text-xl leading-[1.9] text-zinc-500">

              At KYRUMA we don't create isolated deliverables.

              We build systems that help ambitious companies become brands
              people understand, remember and trust.

            </p>

          </div>

        </div>
      </Container>
    </section>
  );
}