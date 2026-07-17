import Container from "@/components/ui/Container";

const services = [
  {
    number: "01",
    title: "Brand Strategy",
    description:
      "Positioning, messaging and strategic direction that give businesses clarity and purpose.",
  },
  {
    number: "02",
    title: "Visual Identity",
    description:
      "Identity systems designed to be recognised, remembered and trusted across every touchpoint.",
  },
  {
    number: "03",
    title: "Digital Experience",
    description:
      "Websites and digital products where design, performance and usability work together.",
  },
  {
    number: "04",
    title: "AI & Systems",
    description:
      "Automation and intelligent workflows that help ambitious companies operate more efficiently.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-white py-44"
    >
      <Container>
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FF5A00]">
            Capabilities
          </p>

          <h2 className="mt-8 text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#111111]">
            Everything your
            <br />
            business needs.
            <br />
            Nothing it doesn't.
          </h2>
        </div>

        <div className="mt-28 divide-y divide-black/10">
          {services.map((service) => (
            <div
              key={service.number}
              className="grid gap-8 py-12 lg:grid-cols-12 lg:items-start"
            >
              <div className="lg:col-span-2">
                <span className="text-sm font-medium text-[#FF5A00]">
                  {service.number}
                </span>
              </div>

              <div className="lg:col-span-4">
                <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#111111]">
                  {service.title}
                </h3>
              </div>

              <div className="lg:col-span-6">
                <p className="max-w-xl text-[17px] leading-8 text-zinc-500">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}