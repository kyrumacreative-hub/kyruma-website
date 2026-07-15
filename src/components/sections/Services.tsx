import Container from "@/components/ui/Container";

const services = [
  {
    number: "01",
    title: "Brand Strategy",
    description:
      "Business positioning, brand architecture and strategic direction.",
  },
  {
    number: "02",
    title: "Visual Identity",
    description:
      "Identity systems designed to communicate clarity, consistency and trust.",
  },
  {
    number: "03",
    title: "Digital Experience",
    description:
      "Premium websites and digital products built around user experience.",
  },
  {
    number: "04",
    title: "AI Systems",
    description:
      "Internal workflows and AI-powered systems that improve efficiency and scalability.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-[#F7F7F5] py-40"
    >
      <Container>

        <div className="max-w-3xl">

          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#FF5A00]">
            Services
          </p>

          <h2 className="mt-8 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-[#111111] md:text-7xl">
            Everything
            <br />
            your brand
            <br />
            needs.
          </h2>

        </div>

        <div className="mt-28">

          {services.map((service) => (
            <div
              key={service.number}
              className="grid border-b border-black/10 py-10 md:grid-cols-[120px_320px_1fr]"
            >
              <span className="text-sm font-bold text-[#FF5A00]">
                {service.number}
              </span>

              <h3 className="mt-3 text-3xl font-bold text-[#111111] md:mt-0">
                {service.title}
              </h3>

              <p className="mt-5 max-w-xl text-zinc-600 md:mt-0">
                {service.description}
              </p>
            </div>
          ))}

        </div>

      </Container>
    </section>
  );
}