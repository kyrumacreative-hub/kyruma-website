import type { Metadata } from "next";
import WorkCaseCard from "@/components/work/WorkCaseCard";
import { workCases } from "@/data/work";

export const metadata: Metadata = {
  title: "Trabajos y proyectos",
  description: "Trabajo de KYRUMA publicado únicamente cuando autoría, permiso y evidencia están suficientemente documentados.",
  alternates: { canonical: "/trabajos" },
  openGraph: { title: "Trabajos y proyectos | KYRUMA", description: "Trabajo publicado con autoría, permiso y evidencia documentados.", url: "/trabajos", images: ["/og-image.jpg"] },
};

export default function WorkPage() {
  return <main className="min-h-screen bg-[var(--background)] pb-28 pt-36 text-[var(--foreground)]"><div className="site-container"><p className="section-label">TRABAJOS<span className="accent-dot" /></p><div className="mt-10 max-w-4xl"><h1 className="section-title">La evidencia también forma parte del trabajo.</h1><p className="body-copy mt-8 max-w-2xl">Solo publicamos casos cuando podemos documentar con claridad la relación, nuestra autoría, el permiso de publicación y la evidencia disponible. Los resultados se incorporan únicamente cuando pueden verificarse.</p></div>{workCases.map((workCase) => <WorkCaseCard key={workCase.slug} workCase={workCase} language="es" />)}</div></main>;
}
