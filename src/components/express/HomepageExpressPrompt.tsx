"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TrackedShopLink from "@/components/express/TrackedShopLink";
import { expressProduct } from "@/data/express";

const DISMISS_KEY = "kyruma_home_express_prompt_dismissed";

export default function HomepageExpressPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    if (window.sessionStorage.getItem(DISMISS_KEY) === "1") return;

    const updateVisibility = () => setVisible(window.scrollY > 520);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [pathname]);

  if (!visible || pathname !== "/") return null;

  function dismiss() {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <aside
      aria-label="KYRUMA Express — Auditoría Instagram"
      className="fixed bottom-4 left-4 right-4 z-40 border border-[var(--border-strong)] bg-[var(--background)]/95 p-4 shadow-2xl backdrop-blur md:bottom-6 md:left-auto md:right-6 md:w-[520px] md:p-5"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar"
        className="absolute right-3 top-3 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        ×
      </button>

      <div className="pr-7">
        <p className="text-[10px] uppercase tracking-[.18em] text-[var(--primary)]">KYRUMA EXPRESS™ · ENTRADA RÁPIDA</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xl font-light tracking-[-.025em]">Auditoría Instagram · 29 €</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Pago único · entrega ≤ 48 h laborables · sin contraseña.</p>
          </div>
          <div className="shrink-0">
            <TrackedShopLink
              href={expressProduct.shopUrl}
              placement="homepage_engaged_prompt"
              className="button-primary inline-flex"
            >
              Comprar <span>→</span>
            </TrackedShopLink>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
          <Link href="/auditoria-instagram" className="underline underline-offset-4 hover:text-[var(--foreground)]">Ver qué incluye</Link>
          <Link href="/auditoria-instagram/ejemplo" className="underline underline-offset-4 hover:text-[var(--foreground)]">Ver ejemplo de entrega</Link>
        </div>
      </div>
    </aside>
  );
}
