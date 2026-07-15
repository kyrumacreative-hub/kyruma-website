"use client";

import Container from "@/components/ui/Container";

const navigation = [
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Process",
    href: "#process",
  },
  {
    label: "Our Work",
    href: "#work",
  },
  {
    label: "About",
    href: "#about",
  },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-6">

      <Container>

        <div
          className="
            flex
            h-[72px]
            items-center
            justify-between
            rounded-full
            border
            border-black/5
            bg-white/80
            px-8
            backdrop-blur-xl
          "
        >

          {/* Logo */}

          <a
            href="/"
            className="
              text-[15px]
              font-semibold
              tracking-[0.45em]
              text-[#111111]
            "
          >
            KYRUMA
          </a>

          {/* Navigation */}

          <nav className="hidden lg:flex items-center gap-12">

            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="
                  text-[14px]
                  font-medium
                  text-zinc-500
                  transition-colors
                  duration-300
                  hover:text-[#111111]
                "
              >
                {item.label}
              </a>
            ))}

          </nav>

          {/* CTA */}

          <a
            href="#contact"
            className="
              inline-flex
              h-11
              items-center
              rounded-full
              bg-[#111111]
              px-6
              text-[14px]
              font-medium
              text-white
              transition-all
              duration-300
              hover:bg-[#FF5A00]
            "
          >
            Start a Project
        </a>

        </div>

      </Container>

    </header>
  );
}