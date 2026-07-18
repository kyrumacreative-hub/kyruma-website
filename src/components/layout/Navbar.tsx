"use client";

import { useEffect, useState } from "react";
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
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        fixed
        inset-x-0
        top-0
        z-50
        transition-all
        duration-500
        ${
          scrolled
            ? "border-b border-black/[0.06] bg-[var(--background)]/90 backdrop-blur-xl"
            : "bg-transparent"
        }
      `}
    >
      <Container>
        <div className="flex h-24 items-center justify-between">
          {/* Brand */}

          <a
            href="#"
            aria-label="KYRUMA — Back to top"
            className="relative z-10 text-[17px] font-bold tracking-[0.18em] text-[var(--foreground)]"
          >
            KYRUMA
          </a>

          {/* Desktop Navigation */}

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-10 lg:flex"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-[var(--muted)] transition-colors duration-300 hover:text-[var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Contact */}

          <a
            href="#contact"
            className="
              group
              inline-flex
              items-center
              gap-3
              text-[13px]
              font-semibold
              text-[var(--foreground)]
            "
          >
            <span>Start a Project</span>

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[var(--foreground)]
                text-white
                transition-all
                duration-300
                group-hover:bg-[var(--primary)]
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </a>
        </div>
      </Container>
    </header>
  );
}