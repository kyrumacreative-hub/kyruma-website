import type { Metadata } from "next";
import WorkCaseCard from "@/components/work/WorkCaseCard";
import { workCases } from "@/data/work";

export const metadata: Metadata = {
  title: "Trabajos y proyectos",
  description: "Proyectos y colaboraciones de KYRUMA documentados con contexto real, proceso y evidencia verificable.",
  alternates: { canonical: "/trabajos" },
  openGraph: { title: "Trabajos y proyectos | KYRUMA", description: "Una colección viva de proyectos reales de KYRUMA.", url: "/trabajos", images: ["/og-image.jpg"] },
};

export default function WorkPage() {
  return <main className="min-h-screen bg-[var(--background)] pb-28 pt-36 text-[var(--foreground)]"><div className="site-container"><p className="section-label">TRABAJOS<span className="accent-dot" /></p><div className="mt-10 max-w-4xl"><h1 className="section-title">El trabajo se cuenta con contexto, proceso y evidencia.</h1><p className="body-copy mt-8 max-w-2xl">Esta colección incluye proyectos activos cuando existe trabajo real que mostrar. Los resultados se incorporan únicamente después de poder verificarlos.</p></div>{workCases.map((workCase) => <WorkCaseCard key={workCase.slug} workCase={workCase} language="es" />)}</div></main>;
}
