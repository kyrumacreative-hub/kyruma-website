import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, insights } from "@/data/insights";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return insights.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};
  const url = `/insights/${insight.slug}`;

  return {
    title: insight.title,
    robots: insight.authorityStatus === "legacy" ? { index: false, follow: true } : undefined,
    description: insight.description,
    keywords: insight.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${insight.title} | KYRUMA`,
      description: insight.description,
      url,
      type: "article",
      publishedTime: insight.publishedAt,
      images: ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${insight.title} | KYRUMA`,
      description: insight.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.description,
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    inLanguage: "es",
    author: { "@type": "Organization", name: "KYRUMA", url: "https://www.kyruma.com" },
    publisher: { "@type": "Organization", name: "KYRUMA", url: "https://www.kyruma.com" },
    mainEntityOfPage: `https://www.kyruma.com/insights/${insight.slug}`,
    keywords: insight.keywords.join(", "),
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <article>
        <header className="border-b border-[var(--border)] pt-36">
          <div className="site-container pb-16 md:pb-24">
            <Link href="/insights" className="text-link">← Insights</Link>
            <p className="section-label mt-10">{insight.eyebrow}<span className="accent-dot" /></p>
            <h1 className="mt-8 max-w-[1080px] text-[clamp(3rem,7vw,6.6rem)] font-light leading-[.98] tracking-[-.052em]">{insight.title}</h1>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--border)] pt-6 text-xs uppercase tracking-[.14em] text-[var(--muted)]">
              <span>{new Date(insight.publishedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</span>
              <span>{insight.readingTime}</span>
              <span>KYRUMA</span>
            </div>
          </div>
        </header>

        <div className="site-container grid gap-12 py-16 md:grid-cols-12 md:py-24">
          <aside className="md:col-span-3">
            <p className="section-label">EN UNA FRASE<span className="accent-dot" /></p>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{insight.description}</p>
          </aside>

          <div className="md:col-span-7 md:col-start-5">
            <div className="space-y-6 text-[1.08rem] font-light leading-[1.85] text-[var(--muted)]">
              {insight.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <div className="mt-16 space-y-16">
              {insight.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.08] tracking-[-.04em] text-[var(--foreground)]">{section.heading}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-6 text-[1.05rem] font-light leading-[1.85] text-[var(--muted)]">{paragraph}</p>)}
                  {section.bullets && (
                    <ul className="mt-6 grid gap-3 border-t border-[var(--border)] pt-5">
                      {section.bullets.map((bullet) => <li key={bullet} className="flex gap-4 text-base leading-7 text-[var(--muted)]"><span className="text-[var(--primary)]">→</span><span>{bullet}</span></li>)}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-20 border-y border-[var(--border)] py-12">
              <p className="section-label">CONTINUAR<span className="accent-dot" /></p>
              <h2 className="mt-7 text-4xl font-light tracking-[-.04em]">Una señal útil cada semana.</h2>
              <p className="mt-5 max-w-xl leading-7 text-[var(--muted)]">KYRUMA / SIGNAL reúne análisis breves sobre estrategia, identidad y experiencia digital. Sin secuencias comerciales automáticas.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/signal" className="button-primary inline-flex">Conocer SIGNAL <span>→</span></Link>
                <Link href="/#contact" className="text-link">Iniciar una conversación <span>→</span></Link>
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
