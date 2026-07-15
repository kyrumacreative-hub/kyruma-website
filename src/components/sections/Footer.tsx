import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#F7F7F5]">

      <Container>

        <div className="flex flex-col items-center justify-between gap-8 py-10 md:flex-row">

          <span className="text-[15px] font-black tracking-[0.35em] text-[#111111]">
            KYRUMA
          </span>

          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} KYRUMA. All rights reserved.
          </p>

        </div>

      </Container>
    </footer>
  );
}