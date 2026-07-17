import Container from "@/components/ui/Container";

const steps = [
  {
    title: "Think.",
    description:
      "Every project starts with clarity. We understand the business before making design decisions.",
  },
  {
    title: "Design.",
    description:
      "Identity, digital experiences and systems are created to communicate one consistent story.",
  },
  {
    title: "Build.",
    description:
      "Ideas become real through precise execution, technology and obsessive attention to detail.",
  },
  {
    title: "Refine.",
    description:
      "Great brands are never finished. They evolve through measurement, iteration and consistency.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="bg-[#F7F7F5] py-44"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FF5A00]">
            Our Process
          </p>

          <h2 className="mt-8 text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#111111]">
            Great brands
            <br />
            aren't created
            <br />
            by chance.
          </h2>
        </div>

        <div className="mt-28 grid gap-16 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="border-t border-black/10 pt-8"
            >
              <span className="text-sm font-medium text-[#FF5A00]">
                0{index + 1}
              </span>

              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#111111]">
                {step.title}
              </h3>

              <p className="mt-6 text-[17px] leading-8 text-zinc-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}