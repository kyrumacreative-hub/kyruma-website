import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkCaseDetail from "@/components/work/WorkCaseDetail";
import { getWorkCase, workCases } from "@/data/work";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return workCases.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workCase = getWorkCase(slug);
  if (!workCase) return {};
  const description = workCase.summary.es;
  const url = `/trabajos/${workCase.slug}`;
  return {
    title: `${workCase.client} — Proyecto activo`, description,
    alternates: { canonical: url },
    openGraph: { title: `${workCase.client} — Proyecto activo | KYRUMA`, description, url, type: "article", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title: `${workCase.client} | KYRUMA`, description, images: ["/og-image.jpg"] },
  };
}

export default async function WorkCasePage({ params }: Props) {
  const { slug } = await params;
  const workCase = getWorkCase(slug);
  if (!workCase) notFound();
  const structuredData = {
    "@context": "https://schema.org", "@type": "CreativeWork", name: `${workCase.client} — ${workCase.project.es}`,
    description: workCase.summary.es, dateModified: workCase.updatedAt, inLanguage: ["es", "en"],
    creator: { "@type": "Organization", name: "KYRUMA", url: "https://www.kyruma.com" },
    about: { "@type": "Organization", name: workCase.client, url: workCase.publicUrl },
    url: `https://www.kyruma.com/trabajos/${workCase.slug}`,
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><WorkCaseDetail workCase={workCase} /></>;
}
