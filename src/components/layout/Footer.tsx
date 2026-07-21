"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useLanguage } from "@/components/LanguageProvider";

const translations = {
  es: {
    description:
      "Estudio independiente de estrategia y negocio creativo. Estrategia, identidad, experiencias digitales y sistemas.",
    explore: "Explorar",
    perspective: "Perspectiva",
    services: "Servicios",
    method: "El Método",
    contact: "Contacto",
    backToTop: "Volver arriba",
    rights: "Todos los derechos reservados.",
    signature: "Construido con claridad e intención.",
  },

  en: {
    description:
      "Independent creative business and strategy studio. Strategy, identity, digital experiences and systems.",
    explore: "Explore",
    perspective: "Perspective",
    services: "Services",
    method: "Method",
    contact: "Contact",
    backToTop: "Back to top",
    rights: "All rights reserved.",
    signature: "Built with clarity and intention.",
  },
} as const;

export default function Footer() {
  const year = new Date().getFullYear();
  const { language } = useLanguage();
  const t = translations[language];

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
    {
      label: t.contact,
      href: "/#contact",
    },
  ];

  return (
    <footer className="relative bg-[#111111] text-white">
      <Container>
        {/* MAIN FOOTER */}

        <div className="grid gap-16 py-16 md:py-20 lg:grid-cols-12 lg:items-start">
          {/* BRAND */}

          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label="KYRUMA — Home"
              className="inline-block text-[20px] font-bold tracking-[0.18em] text-white"
            >
              KYRUMA
            </Link>

            <p className="mt-5 max-w-[360px] text-sm leading-[1.7] text-white/40">
              {t.description}
            </p>
          </div>

          {/* NAVIGATION */}

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
              {t.explore}
            </p>

            <nav
              aria-label="Footer navigation"
              className="mt-6 flex flex-col items-start gap-3"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* BACK TO TOP */}

          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
              KYRUMA
            </p>

            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault();

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="group mt-6 inline-flex items-center gap-3 text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white"
            >
              {t.backToTop}

              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-1"
              >
                ↑
              </span>
            </a>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">
            © {year} KYRUMA. {t.rights}
          </p>

          <p className="text-xs text-white/25">
            {t.signature}
          </p>
        </div>
      </Container>
    </footer>
  );
}