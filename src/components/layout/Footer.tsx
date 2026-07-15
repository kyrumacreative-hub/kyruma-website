import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#F7F7F5]">
      <Container>

        <div className="flex h-24 items-center justify-between">

          <span className="text-sm font-black tracking-[0.35em]">
            KYRUMA
          </span>

          <span className="text-sm text-zinc-500">
            © 2026 KYRUMA
          </span>

        </div>

      </Container>
    </footer>
  );
}