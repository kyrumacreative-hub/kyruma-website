"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

type Consent = "accepted" | "rejected" | null;

const STORAGE_KEY = "kyruma-analytics-consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    }

    setReady(true);
  }, []);

  function choose(value: Exclude<Consent, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  }

  if (!ready) {
    return null;
  }

  return (
    <>
      {consent === "accepted" && (
        <GoogleAnalytics gaId="G-XDB5TYYW0J" />
      )}

      {consent === null && (
        <div
          role="dialog"
          aria-label="Preferencias de cookies"
          className="
            fixed
            bottom-4
            left-4
            right-4
            z-[100]
            mx-auto
            max-w-2xl
            border
            border-[var(--border)]
            bg-[var(--background)]
            p-6
            shadow-2xl
            md:bottom-6
            md:p-8
          "
        >
          <p className="text-sm font-medium tracking-[-0.01em]">
            Tu privacidad importa.
          </p>

          <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-[var(--muted)]">
            Utilizamos tecnologías necesarias para que KYRUMA funcione y,
            con tu permiso, analítica para entender cómo se utiliza el sitio y
            mejorar la experiencia.
          </p>

          <p className="mt-3 text-xs text-[var(--muted)]">
            Puedes consultar más información en nuestra{" "}
            <Link
              href="/cookies"
              className="underline underline-offset-4"
            >
              Política de Cookies
            </Link>
            .
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="button-primary"
            >
              Aceptar analíticas
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => choose("rejected")}
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                border
                border-[var(--border-strong)]
                px-5
                text-sm
                transition-colors
                hover:border-[var(--foreground)]
              "
            >
              Solo necesarias
            </button>
          </div>
        </div>
      )}
    </>
  );
}
