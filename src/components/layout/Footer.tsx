"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="site-container grid gap-12 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Link
            href="/#top"
            className="text-sm font-medium tracking-[0.22em]"
          >
            KYRUMA
          </Link>

          <p className="body-copy mt-5 max-w-sm text-sm">
            {language === "es"
              ? "Creative Partner para empresas que necesitan alinear estrategia, identidad y experiencia digital."
              : "Creative Partner for businesses that need to align strategy, identity and digital experience."}
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-8">
          <p className="micro">
            {language === "es" ? "CONTACTO" : "CONTACT"}
          </p>

          <a
            href="mailto:hello@kyruma.com"
            className="text-link mt-4"
          >
            hello@kyruma.com <span>→</span>
          </a>
        </div>

        <div className="md:col-span-2">
          <p className="micro">
            {language === "es" ? "IDIOMA" : "LANGUAGE"}
          </p>

          <p className="mt-4 text-sm text-[var(--muted)]">
            ES / EN
          </p>
        </div>
      </div>

      <div className="site-container border-t border-[var(--border)] py-6 text-[11px] text-[var(--muted)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} KYRUMA.</p>

          <nav
            aria-label={language === "es" ? "Información legal" : "Legal information"}
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <Link
              href="/legal"
              className="transition-colors duration-200 hover:text-[var(--foreground)]"
            >
              {language === "es" ? "Aviso legal" : "Legal notice"}
            </Link>

            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-[var(--foreground)]"
            >
              {language === "es" ? "Privacidad" : "Privacy"}
            </Link>

            <Link
              href="/cookies"
              className="transition-colors duration-200 hover:text-[var(--foreground)]"
            >
              Cookies
            </Link>
          </nav>

          <p>
            {language === "es"
              ? "Claridad · Coherencia · Confianza"
              : "Clarity · Coherence · Trust"}
          </p>
        </div>
      </div>
    </footer>
  );
}
