import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre KYRUMA — Creative Partner",
  description:
    "KYRUMA es un Creative Partner para empresas cuyo negocio ha evolucionado más rápido que la forma en la que está siendo percibido.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Sobre KYRUMA — Creative Partner",
    description:
      "Estrategia, identidad y experiencia digital conectadas en un único sistema coherente.",
    url: "/about",
    siteName: "KYRUMA",
    type: "website",
  },
};

export default function AboutKyrumaPage() {
  return (
    <main className="bg-[var(--background)] pb-24 pt-36 text-[var(--foreground)] md:pt-44">
      <div className="site-container">
        <p className="section-label">SOBRE KYRUMA</p>
        <h1 className="section-title mt-8 max-w-5xl">
          KYRUMA es un Creative Partner para empresas cuyo negocio ha evolucionado más rápido que su percepción.
        </h1>

        <div className="mt-14 grid gap-10 border-t border-[var(--border)] pt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="body-copy text-lg">
              Partimos del negocio, definimos la dirección y conectamos estrategia,
              identidad y experiencia digital para cerrar la distancia entre lo
              que una empresa ha construido y la forma en la que está siendo
              entendida. Definimos antes de diseñar.
            </p>
          </div>
          <div className="space-y-6 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="micro">NOMBRE OFICIAL</p>
              <p className="mt-2">KYRUMA</p>
            </div>
            <div>
              <p className="micro">ESPECIALIDAD</p>
              <p className="mt-2">Estrategia · Identidad · Experiencia digital</p>
            </div>
            <div>
              <p className="micro">WEB OFICIAL</p>
              <a className="text-link mt-2" href="https://www.kyruma.com/">
                kyruma.com <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        <section className="mt-20 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-12">
          <p className="micro">IDENTIDAD DIGITAL OFICIAL</p>
          <p className="body-copy mt-5 max-w-3xl">
            La web oficial de KYRUMA es kyruma.com. Nuestros perfiles oficiales
            son KYRUMA en LinkedIn y @kyrumacreative en Instagram. KYRUMA no es
            un restaurante ni una marca de restauración.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              className="button-primary"
              href="https://www.linkedin.com/company/kyruma/"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn <span>↗</span>
            </a>
            <a
              className="text-link"
              href="https://www.instagram.com/kyrumacreative/"
              rel="noreferrer"
              target="_blank"
            >
              Instagram <span>↗</span>
            </a>
          </div>
        </section>

        <div className="mt-16">
          <Link className="text-link" href="/#contact">
            Iniciar una conversación <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
