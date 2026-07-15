import Container from "@/components/ui/Container";

export default function Statement() {
  return (
    <section className="bg-white py-40">

      <Container>

        <div className="mx-auto max-w-6xl">

          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#FF5A00]">
            Our Philosophy
          </p>

          <h2 className="mt-10 text-[3.5rem] font-black leading-[0.9] tracking-[-0.06em] text-[#111111] md:text-[5rem] lg:text-[6rem]">

            Most companies
            <br />

            fight for attention.

            <br />
            <br />

            The best earn
            <br />

            trust.

          </h2>

        </div>

      </Container>

    </section>
  );
}