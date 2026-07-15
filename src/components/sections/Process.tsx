import Container from "@/components/ui/Container";

const steps = [
  {
    number: "01",
    title: "Discover",
    text: "We analyse your business, market and goals before making a single design decision.",
  },
  {
    number: "02",
    title: "Define",
    text: "We create a strategic foundation that gives direction to every future decision.",
  },
  {
    number: "03",
    title: "Design",
    text: "Identity, digital experience and communication become one coherent system.",
  },
  {
    number: "04",
    title: "Grow",
    text: "We help your brand evolve with consistency, scalability and measurable impact.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="bg-white py-40"
    >
      <Container>

        <div className="max-w-3xl">

          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#FF5A00]">
            Process
          </p>

          <h2 className="mt-8 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-[#111111] md:text-7xl">
            A clear process.
            <br />
            Better decisions.
            <br />
            Better brands.
          </h2>

        </div>

        <div className="mt-24 grid gap-8 lg:grid-cols-2">

          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-[28px] border border-black/8 bg-[#FAFAF8] p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-sm font-bold tracking-[0.2em] text-[#FF5A00]">
                {step.number}
              </span>

              <h3 className="mt-6 text-3xl font-bold text-[#111111]">
                {step.title}
              </h3>

              <p className="mt-6 max-w-md text-zinc-600">
                {step.text}
              </p>

            </article>
          ))}

        </div>

      </Container>
    </section>
  );
}