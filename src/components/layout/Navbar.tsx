"use client";

import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > 80
      ) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;

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
        left-0
        right-0
        top-0
        z-50
        w-full
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
      <div
        className="
          mx-auto
          flex
          h-20
          w-full
          max-w-7xl
          items-center
          justify-between
          px-6
          md:px-12
        "
      >
        {/* Logo */}

        <a
          href="#"
          aria-label="KYRUMA — Home"
          className="
            text-sm
            font-medium
            uppercase
            tracking-[0.25em]
            text-white
            transition-opacity
            duration-700
            ease-[cubic-bezier(0.25,1,0.5,1)]
            hover:opacity-60
          "
        >
          KYRUMA
        </a>

        {/* Navigation */}

        <nav
          aria-label="Main navigation"
          className="
            hidden
            items-center
            gap-10
            md:flex
          "
        >
          <a
            href="#statement"
            className="
              text-xs
              font-light
              uppercase
              tracking-widest
              text-neutral-500
              transition-colors
              duration-700
              ease-[cubic-bezier(0.25,1,0.5,1)]
              hover:text-white
            "
          >
            Perspective
          </a>

          <a
            href="#services"
            className="
              text-xs
              font-light
              uppercase
              tracking-widest
              text-neutral-500
              transition-colors
              duration-700
              ease-[cubic-bezier(0.25,1,0.5,1)]
              hover:text-white
            "
          >
            Capabilities
          </a>

          <a
            href="#process"
            className="
              text-xs
              font-light
              uppercase
              tracking-widest
              text-neutral-500
              transition-colors
              duration-700
              ease-[cubic-bezier(0.25,1,0.5,1)]
              hover:text-white
            "
          >
            Method
          </a>
        </nav>

        {/* CTA */}

        <a
          href="#contact"
          className="
            group
            inline-flex
            items-center
            justify-center
            rounded-full
            border
            border-white/[0.08]
            bg-neutral-950
            px-5
            py-2.5
            text-[10px]
            font-light
            uppercase
            tracking-[0.16em]
            text-white
            transition-all
            duration-700
            ease-[cubic-bezier(0.25,1,0.5,1)]
            hover:scale-[1.02]
            hover:border-white/20
            hover:bg-neutral-900
            sm:px-6
            sm:text-xs
          "
        >
          <span
            className="
              inline-block
              transition-transform
              duration-700
              ease-[cubic-bezier(0.25,1,0.5,1)]
              group-hover:-translate-y-[2px]
            "
          >
            Start a Project
          </span>
        </a>
      </div>
    </header>
  );
}