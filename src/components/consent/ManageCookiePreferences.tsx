"use client";

import { MARKETING_CONSENT_KEY } from "@/features/marketing/MarketingScripts";

export default function ManageCookiePreferences() {
  function reopenPreferences() {
    window.localStorage.removeItem(MARKETING_CONSENT_KEY);
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={reopenPreferences}
      className="mt-6 inline-flex min-h-12 items-center justify-center border border-[var(--border-strong)] px-5 text-sm transition-colors hover:border-[var(--foreground)]"
    >
      Cambiar preferencias de cookies
    </button>
  );
}
