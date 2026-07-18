"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const difference = currentScrollY - lastScrollY.current;

      /*
       * Always show navbar near the top.
       */

      if (currentScrollY < 80) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        ticking.current = false;
        return;
      }

      /*
       * Ignore tiny movements.
       * Prevents navbar flickering on trackpads
       * and mobile momentum scrolling.
       */

      if (Math.abs(difference) < 8) {
        ticking.current = false;
        return;
      }

      /*
       * Scroll down → hide.
       * Scroll up → reveal.
       */

      if (difference > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateNavbar);
        ticking.current = true;
      }
    };

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
        bg-black/40
        backdrop-blur-xl
        transition-all
        duration-500
        ease-[cubic-bezier(0.16,1,0.3,1)]
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }
      `}
    >
      <Container>
        <div className="flex h-20 items-center justify-between md:h-24">
          {/* Brand */}

          <a
            href="#"
            aria-label="KYRUMA — Back to top"
            className="
              text-[14px]
              font-semibold
              tracking-[0.28em]
              text-white
              transition-opacity
              duration-700
              ease-[cubic-bezier(0.25,1,0.5,1)]
              hover:opacity-60
            "
          >
            KYRUMA
          </a>

          {/* Desktop Navigation */}

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-10 md:flex lg:gap-12"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="
                  text-[13px]
                  font-light
                  tracking-wide
                  text-neutral-400
                  transition-colors
                  duration-700
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  hover:text-white
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
              group
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-white/[0.08]
              bg-neutral-950
              px-5
              py-3
              text-[12px]
              font-medium
              text-white
              transition-all
              duration-700
              ease-[cubic-bezier(0.25,1,0.5,1)]
              hover:scale-[1.02]
              hover:border-white/20
              hover:bg-neutral-900
              md:px-6
            "
          >
            <span
              className="
                transition-transform
                duration-700
                ease-[cubic-bezier(0.25,1,0.5,1)]
                group-hover:-translate-y-0.5
              "
            >
              Start a Project
            </span>

            <span
              aria-hidden="true"
              className="
                text-neutral-500
                transition-all
                duration-700
                ease-[cubic-bezier(0.25,1,0.5,1)]
                group-hover:translate-x-0.5
                group-hover:text-white
              "
            >
              ↗
            </span>
          </a>
        </div>
      </Container>
    </header>
  );
}