"use client";

import Container from "@/components/ui/Container";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container>

        <div
          className={`mt-6 flex h-16 items-center justify-between rounded-full px-8 transition-all duration-500 ${
            scrolled
              ? "bg-white/85 backdrop-blur-2xl border border-black/5 shadow-[0_15px_40px_rgba(0,0,0,.06)]"
              : "bg-transparent"
          }`}
        >

          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.05em] text-[#111111]"
          >
            KYRUMA
          </Link>

          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:text-white"
          >
            Contact

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>

          </Link>

        </div>

      </Container>
    </header>
  );
}