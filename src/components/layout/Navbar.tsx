"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

const navTranslations = {
  es: {
    perspective: "Perspectiva",
    services: "Servicios",
    method: "El Método",
    cta: "Iniciar Consulta",
  },
  en: {
    perspective: "Perspective",
    services: "Services",
    method: "Method",
    cta: "Start Consultation",
  },
} as const;

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const lastScrollY = useRef(0);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const t = navTranslations[language];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

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
    setIsScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigation = [
    {
      label: t.perspective,
      href: "/#perspective",
    },
    {
      label: t.services,
      href: "/#capabilities",
    },
    {
      label: t.method,
      href: "/#method",
    },
  ];

  return (
    <header
      className={`
        fixed
        left-0
        right-0
        top-0
        z-50
        w-full
        border-b
        transition-all
        duration-700
        ease-[cubic-bezier(0.16,1,0.3,1)]
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }
        ${
          isScrolled
            ? "border-[var(--border)] bg-[var(--surface)]/70 shadow-[0_8px_40px_rgba(17,17,17,0.025)] backdrop-blur-xl"
            : "border-transparent bg-[var(--background)]/60 backdrop-blur-xl"
        }
      `}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 md:px-12">
        {/* LOGO */}

        <Link
          href="/"
          aria-label="KYRUMA — Home"
          className="
            text-sm
            font-light
            uppercase
            tracking-[0.25em]
            text-[var(--foreground)]
            transition-all
            duration-500
            ease-[cubic-bezier(0.25,1,0.5,1)]
            hover:opacity-60
          "
        >
          KYRUMA
        </Link>

        {/* NAVIGATION */}

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-10 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                group
                relative
                py-2
                text-[10px]
                font-light
                uppercase
                tracking-[0.18em]
                text-[var(--muted)]
                transition-colors
                duration-300
                ease-[cubic-bezier(0.25,1,0.5,1)]
                hover:text-[var(--foreground)]
              "
            >
              {item.label}

              <span
                aria-hidden="true"
                className="
                  absolute
                  -bottom-1
                  left-1/2
                  h-1
                  w-1
                  -translate-x-1/2
                  scale-0
                  rounded-full
                  bg-[var(--primary)]
                  opacity-0
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  group-hover:scale-100
                  group-hover:opacity-100
                "
              />
            </Link>
          ))}
        </nav>

        {/* CONTROLS */}

        <div className="flex items-center gap-4 sm:gap-6">
          {/* LANGUAGE */}

          <div
            className="
              flex
              items-center
              gap-3
              text-[10px]
              font-light
              uppercase
              tracking-[0.15em]
            "
            aria-label="Language selector"
          >
            <button
              type="button"
              onClick={() => setLanguage("es")}
              aria-pressed={language === "es"}
              className={
                language === "es"
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] transition-colors duration-300 hover:text-[var(--primary)]"
              }
            >
              ES
            </button>

            <span className="text-[var(--muted)]">/</span>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={
                language === "en"
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] transition-colors duration-300 hover:text-[var(--primary)]"
              }
            >
              EN
            </button>
          </div>

          {/* THEME */}

          <div
            className="flex items-center gap-2"
            aria-label="Theme selector"
          >
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-label="Light mode"
              aria-pressed={theme === "light"}
              title="Light"
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                theme === "light"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[var(--primary)]"
              }`}
            >
              ☀
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              aria-label="Automatic system theme"
              aria-pressed={theme === "system"}
              title="Automatic"
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                theme === "system"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[var(--primary)]"
              }`}
            >
              ◐
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              aria-label="Dark mode"
              aria-pressed={theme === "dark"}
              title="Dark"
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[var(--primary)]"
              }`}
            >
              ☾
            </button>
          </div>

          {/* CTA */}

          <Link
            href="/#contact"
            onClick={() =>
              sendGAEvent("event", "start_consultation", {
                event_category: "conversion",
                event_label: "navbar_cta",
              })
            }
            className="
              group
              hidden
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#111111]
              px-5
              py-2.5
              text-[10px]
              font-light
              uppercase
              tracking-[0.16em]
              !text-white
              transition-all
              duration-500
              ease-[cubic-bezier(0.25,1,0.5,1)]
              hover:scale-[1.02]
              hover:bg-[var(--primary)]
              hover:shadow-[0_12px_35px_rgba(255,90,0,0.16)]
              sm:inline-flex
              sm:px-6
            "
          >
            <span className="!text-white">
              {t.cta}
            </span>

            <span
              aria-hidden="true"
              className="
                inline-block
                !text-white
                transition-transform
                duration-500
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}