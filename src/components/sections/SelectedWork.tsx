import Container from "@/components/ui/Container";

const projects = [
  {
    category: "Brand Strategy",
    title: "KYRUMA",
    description:
      "Building a modern creative business from strategy to digital experience.",
  },
  {
    category: "Hospitality",
    title: "Ibiza Experience",
    description:
      "A premium charter brand designed to communicate trust, exclusivity and simplicity.",
  },
  {
    category: "Community",
    title: "BMM Morata",
    description:
      "Refreshing the visual communication of a cultural institution with a modern digital presence.",
  },
];

export default function SelectedWork() {
  return (
    <section className="bg-[#F7F7F5] py-44">
      <Container>

        <div className="max-w-4xl">

          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FF5A00]">
            Selected Work
          </p>

          <h2 className="mt-8 text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#111111]">
            Proof
            <br />
            over promises.
          </h2>

        </div>

        <div className="mt-28 space-y-10">

          {projects.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-[36px] border border-black/5 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,.08)]"
            >

              <div className="aspect-[16/9] bg-gradient-to-br from-[#F4F4F2] to-[#ECECE8]" />

              <div className="p-10">

                <p className="text-sm font-medium text-[#FF5A00]">
                  {project.category}
                </p>

                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#111111]">
                  {project.title}
                </h3>

                <p className="mt-6 max-w-xl text-[17px] leading-8 text-zinc-500">
                  {project.description}
                </p>

                <div className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#111111] transition-transform duration-300 group-hover:translate-x-1">
                  View Case →
                </div>

              </div>

            </article>
          ))}

        </div>

      </Container>
    </section>
  );
}