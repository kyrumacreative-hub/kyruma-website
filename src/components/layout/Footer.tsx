import Container from "@/components/ui/Container";

const navigation = [
  {
    label: "Perspective",
    href: "#statement",
  },
  {
    label: "Capabilities",
    href: "#services",
  },
  {
    label: "Method",
    href: "#process",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#111111] text-white">
      <Container>
        {/* Main footer */}

        <div className="grid gap-16 py-16 md:py-20 lg:grid-cols-12 lg:items-start">
          {/* Brand */}

          <div className="lg:col-span-5">
            <a
              href="#"
              aria-label="KYRUMA — Back to top"
              className="inline-block text-[20px] font-bold tracking-[0.18em] text-white"
            >
              KYRUMA
            </a>

            <p className="mt-5 max-w-[360px] !text-sm leading-[1.7] !text-white/40">
              An independent creative business studio working across strategy,
              identity, digital experiences and systems.
            </p>
          </div>

          {/* Navigation */}

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="!text-[10px] font-semibold uppercase tracking-[0.25em] !text-white/30">
              Explore
            </p>

            <nav
              aria-label="Footer navigation"
              className="mt-6 flex flex-col items-start gap-3"
            >
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Back to top */}

          <div className="lg:col-span-3">
            <p className="!text-[10px] font-semibold uppercase tracking-[0.25em] !text-white/30">
              KYRUMA
            </p>

            <a
              href="#"
              className="group mt-6 inline-flex items-center gap-3 text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white"
            >
              Back to top

              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-1"
              >
                ↑
              </span>
            </a>
          </div>
        </div>

        {/* Bottom */}

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="!text-xs !text-white/25">
            © {year} KYRUMA. All rights reserved.
          </p>

          <p className="!text-xs !text-white/25">
            Built with clarity and intention.
          </p>
        </div>
      </Container>
    </footer>
  );
}