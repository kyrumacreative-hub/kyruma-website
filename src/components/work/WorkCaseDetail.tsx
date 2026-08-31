"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { WorkCase } from "@/data/work";

const copy = {
  es: {
    back: "Todos los trabajos", status: "Proyecto activo",
    context: "Contexto", direction: "Dirección", verified: "Evidencia disponible", scope: "Alcance",
    channels: "Canales activos",
    note: "Este caso documenta trabajo real en curso. No publicamos resultados, métricas o impacto hasta poder verificarlos.",
    next: "Siguiente capítulo", visit: "Visitar", cta: "Hablar de un proyecto",
  },
  en: {
    back: "All work", status: "Active project",
    context: "Context", direction: "Direction", verified: "Available evidence", scope: "Scope",
    channels: "Active channels",
    note: "This case documents real work in progress. We do not publish outcomes, metrics or impact until they can be verified.",
    next: "Next chapter", visit: "Visit", cta: "Discuss a project",
  },
} as const;

export default function WorkCaseDetail({ workCase }: { workCase: WorkCase }) {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="min-h-[92svh] pt-32 md:pt-40">
        <div className="site-container flex min-h-[calc(92svh-10rem)] flex-col justify-between pb-12">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[var(--border)] pb-6">
            <Link className="text-link" href="/trabajos"><span>←</span>{t.back}</Link>
            <div className="flex items-center gap-4"><span className="micro">{workCase.publicId}</span><span className="rounded-full border border-[var(--primary)] px-3 py-1 text-[10px] uppercase tracking-[.16em] text-[var(--primary)]">{t.status}</span></div>
          </div>
          <div className="py-16 md:py-24"><p className="micro">{workCase.sector[language]} · {workCase.project[language]}</p><h1 className="mt-8 max-w-[12ch] text-[clamp(4rem,11vw,10rem)] font-light leading-[.84] tracking-[-.075em]">{workCase.headline[language]}</h1></div>
          <div className="grid gap-8 border-t border-[var(--border)] pt-8 lg:grid-cols-12"><p className="text-xl font-light leading-[1.45] tracking-[-.02em] md:text-2xl lg:col-span-7">{workCase.intro[language]}</p><p className="body-copy lg:col-span-4 lg:col-start-9">{workCase.summary[language]}</p></div>
        </div>
      </section>

      <section className="section bg-[#111] text-white"><div className="site-container"><div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-2">
        <article className="min-h-[360px] bg-[#111] p-8 md:p-12"><p className="text-[10px] uppercase tracking-[.22em] text-[#ff6a1a]">01 · {t.context}</p><p className="mt-20 max-w-xl text-2xl font-light leading-[1.35] tracking-[-.03em] md:text-4xl">{workCase.context[language]}</p></article>
        <article className="min-h-[360px] bg-[#111] p-8 md:p-12"><p className="text-[10px] uppercase tracking-[.22em] text-[#ff6a1a]">02 · {t.direction}</p><p className="mt-20 max-w-xl text-2xl font-light leading-[1.35] tracking-[-.03em] md:text-4xl">{workCase.direction[language]}</p></article>
      </div></div></section>

      <section className="section surface-section"><div className="site-container grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5"><p className="section-label">{t.verified}<span className="accent-dot" /></p><div className="mt-10 border-t border-[var(--border)]">{workCase.evidence[language].map((item, index) => <p key={item} className="flex gap-5 border-b border-[var(--border)] py-5 text-sm"><span className="micro">0{index + 1}</span><span>{item}</span></p>)}</div></div>
        <div className="lg:col-span-5 lg:col-start-8"><p className="section-label">{t.scope}<span className="accent-dot" /></p><div className="mt-10 flex flex-wrap gap-3">{workCase.services[language].map((item) => <span key={item} className="rounded-full border border-[var(--border-strong)] px-4 py-3 text-sm">{item}</span>)}</div>{workCase.socialLinks?.length ? <div className="mt-10"><p className="micro">{t.channels}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">{workCase.socialLinks.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="text-link">{item.label}<span>↗</span></a>)}</div></div> : null}<p className="mt-10 border-l border-[var(--primary)] pl-5 text-sm leading-relaxed text-[var(--muted)]">{t.note}</p></div>
      </div></section>

      <section className="section border-t border-[var(--border)]"><div className="site-container grid gap-12 lg:grid-cols-12"><p className="section-label lg:col-span-3">{t.next}<span className="accent-dot" /></p><div className="lg:col-span-8 lg:col-start-5"><h2 className="section-title">{workCase.next[language]}</h2><div className="mt-10 flex flex-wrap items-center gap-6"><a href={workCase.publicUrl} target="_blank" rel="noopener noreferrer" className="button-primary">{t.visit} {workCase.client}<span>↗</span></a><Link href="/#contact" className="text-link rounded-full border border-[var(--border-strong)] px-6 py-4">{t.cta}<span>→</span></Link></div></div></div></section>
    </main>
  );
}
