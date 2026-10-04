import type { Metadata } from "next";
import InstagramResetBrief from "@/components/express/InstagramResetBrief";

export const metadata: Metadata = { title: "Brief Instagram Reset", description: "Cuéntanos lo necesario para comenzar tu Instagram Reset.", robots: { index: false, follow: false } };

export default function BriefPage() {
  return <main className="min-h-screen bg-[var(--background)] pt-32 text-[var(--foreground)]"><div className="site-container max-w-3xl pb-24"><p className="section-label">KYRUMA EXPRESS™ / KX-001<span className="accent-dot" /></p><h1 className="mt-8 text-[clamp(3rem,7vw,6rem)] font-light tracking-[-.055em]">Antes de empezar.</h1><p className="mt-6 max-w-xl text-lg leading-[1.7] text-[var(--muted)]">Necesitamos conocerte un poco mejor. No compartas contraseñas, códigos de acceso ni otra información sensible.</p><InstagramResetBrief /></div></main>;
}
