"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  es: { approach: "Enfoque", services: "Qué hacemos", method: "Método", work: "Trabajo", cta: "Iniciar conversación" },
  en: { approach: "Approach", services: "What we do", method: "Method", work: "Work", cta: "Start conversation" },
} as const;

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const lastY = useRef(0);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const t = copy[language];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setVisible(y < 12 || y < lastY.current || y < 90);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [[t.approach, "#perspective"], [t.services, "#capabilities"], [t.method, "#method"], [t.work, "#work"]];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color] duration-300 ${visible ? "translate-y-0" : "-translate-y-full"} ${scrolled ? "border-[var(--border)] bg-[var(--background)]/88 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
      <div className="site-container flex h-[76px] items-center justify-between">
        <Link href="/#top" aria-label="KYRUMA — Home" className="flex items-center gap-3">
          <Image src="/kyruma-isotipo.png" alt="" width={24} height={24} className="h-5 w-5 object-contain" priority />
          <span className="text-[13px] font-medium tracking-[0.22em]">KYRUMA</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className="nav-link">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <button className="control" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>ES</button>
            <span className="text-[var(--border-strong)]">/</span>
            <button className="control" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <button className="control hidden sm:block" onClick={() => setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system")} aria-label={`Theme: ${theme}`}>{theme === "light" ? "○" : theme === "dark" ? "●" : "◐"}</button>
          <Link href="/#contact" className="button-primary hidden md:inline-flex" onClick={() => sendGAEvent("event", "start_consultation", { event_category: "conversion", event_label: "navbar" })}>{t.cta}<span>→</span></Link>
          <button className="control lg:hidden" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}>{menu ? "×" : "Menu"}</button>
        </div>
      </div>
      {menu && <div className="border-t border-[var(--border)] bg-[var(--background)] lg:hidden"><nav className="site-container flex flex-col py-5">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenu(false)} className="border-b border-[var(--border)] py-4 text-lg font-light">{label}</Link>)}<Link href="/#contact" onClick={() => setMenu(false)} className="mt-5 text-link">{t.cta}<span>→</span></Link><div className="mt-6 flex gap-4"><button className="control" onClick={() => setLanguage("es")}>ES</button><button className="control" onClick={() => setLanguage("en")}>EN</button><button className="control" onClick={() => setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system")}>Theme · {theme}</button></div></nav></div>}
    </header>
  );
}
