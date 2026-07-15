import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#111111] py-44 text-white"
    >
      <Container>

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#FF5A00]">
            Contact
          </p>

          <h2 className="mt-10 text-[3.8rem] font-black leading-[0.9] tracking-[-0.06em] md:text-[5.5rem] xl:text-[7rem]">

            Let's build
            <br />

            something people
            <br />

            trust.

          </h2>

          <p className="mx-auto mt-10 max-w-2xl text-lg leading-9 text-zinc-400">

            Every great company deserves a brand that reflects the quality of
            what it offers.

          </p>

          <div className="mt-16 flex justify-center">

            <Button href="mailto:hello@kyruma.com">
              Start a Project
            </Button>

          </div>

        </div>

      </Container>
    </section>
  );
}