"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();
  const year = new Date().getFullYear();
  const socialLinks = [
    { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/kyrumacreative/" },
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/company/kyruma/" },
    { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL },
    { label: "Email", href: "mailto:hello@kyruma.com" },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

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
          <a href="tel:+34614189346" className="text-link mt-3">
            614 189 346 <span>→</span>
          </a>
          <Link href="/sign-in" className="text-link mt-3">
            {language === "es" ? "Acceso clientes" : "Client access"} <span>→</span>
          </Link>
        </div>

        <div className="md:col-span-2">
          <p className="micro">
            {language === "es" ? "IDIOMA" : "LANGUAGE"}
          </p>

          <p className="mt-4 text-sm text-[var(--muted)]">
            ES / EN
          </p>
        </div>

        <div className="md:col-span-12 border-t border-[var(--border)] pt-8">
          <p className="micro">{language === "es" ? "TAMBIÉN PUEDES ENCONTRARNOS AQUÍ" : "YOU CAN ALSO FIND US HERE"}</p>
          <p className="body-copy mt-3 max-w-xl text-sm">{language === "es" ? "Queremos que contactar con KYRUMA sea tan sencillo como empezar una conversación." : "We want contacting KYRUMA to be as easy as starting a conversation."}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((link) => <a key={link.label} href={link.href} target={link.label === "Email" ? undefined : "_blank"} rel={link.label === "Email" ? undefined : "noreferrer"} className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]">{link.label} <span aria-hidden="true">↗</span></a>)}
          </div>
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
