import Link from "next/link";
import type { WorkCase, WorkLocale } from "@/data/work";

export default function WorkCaseCard({ workCase, language }: { workCase: WorkCase; language: WorkLocale }) {
  const status = language === "es" ? "Proyecto activo" : "Active project";
  const cta = language === "es" ? "Ver proyecto" : "View project";

  return (
    <article className="group mt-16 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] md:mt-24">
      <Link href={`/trabajos/${workCase.slug}`} className="grid min-h-[560px] lg:grid-cols-12" aria-label={`${cta}: ${workCase.client}`}>
        <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-[#111] p-7 text-white md:p-10 lg:col-span-7 lg:min-h-full">
          <div aria-hidden="true" className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full border border-[#ff5a00]/35" />
          <div className="relative flex items-center justify-between gap-6 text-[10px] uppercase tracking-[.2em] text-white/55">
            <span>{workCase.publicId}</span><span>{workCase.sector[language]}</span>
          </div>
          <div className="relative">
            <p className="max-w-xl text-[clamp(3.5rem,8vw,7rem)] font-light leading-[.83] tracking-[-.075em]">Magic<br /><span className="text-white/32">By Whyso</span></p>
            <div className="mt-8 h-px w-full bg-white/12"><div className="h-px w-1/3 bg-[#ff5a00]" /></div>
          </div>
        </div>
        <div className="flex flex-col justify-between p-7 md:p-10 lg:col-span-5 lg:p-12">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--primary)] px-3 py-1 text-[10px] uppercase tracking-[.16em] text-[var(--primary)]">{status}</span>
              <span className="micro">{workCase.project[language]}</span>
            </div>
            <h3 className="mt-10 text-4xl font-light tracking-[-.045em] md:text-5xl">{workCase.client}</h3>
            <p className="body-copy mt-6 max-w-lg">{workCase.summary[language]}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {workCase.services[language].map((service) => <span key={service} className="rounded-full bg-[var(--surface-soft)] px-3 py-2 text-xs text-[var(--muted)]">{service}</span>)}
            </div>
          </div>
          <span className="text-link mt-12">{cta}<span>→</span></span>
        </div>
      </Link>
    </article>
  );
}
