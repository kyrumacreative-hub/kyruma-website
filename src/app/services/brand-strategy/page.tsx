import type { Metadata } from "next";
import ServicePageTemplate, {
  type ServicePageData,
} from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Brand Strategy",
  description:
    "Estrategia de marca para empresas que necesitan claridad, diferenciación y una dirección sólida para crecer.",
  alternates: {
    canonical: "/services/brand-strategy",
  },
  openGraph: {
    title: "Brand Strategy | KYRUMA",
    description:
      "Construimos la dirección estratégica que convierte una marca en una ventaja competitiva.",
    url: "/services/brand-strategy",
    type: "website",
  },
};

const brandStrategyData: ServicePageData = {
  eyebrow: "Brand Strategy",

  title:
    "La claridad que convierte una marca en una ventaja competitiva.",

  introduction:
    "Definimos la dirección estratégica que conecta negocio, posicionamiento y marca para construir empresas más claras, relevantes y preparadas para crecer.",

  challenge: {
    title:
      "Muchas marcas no tienen un problema de diseño. Tienen un problema de dirección.",

    paragraphs: [
      "Cuando una empresa no tiene claro qué representa, para quién existe o por qué debería ser elegida, cada decisión se vuelve más difícil.",

      "La estrategia de marca establece esa dirección. Alinea el negocio con la percepción que queremos construir y crea una base sólida para todo lo que viene después.",
    ],
  },

  approach: [
    {
      number: "01",
      title: "Understand",
      text:
        "Entendemos el negocio, el contexto, la ambición y las decisiones que han llevado a la empresa hasta donde está.",
    },
    {
      number: "02",
      title: "Define",
      text:
        "Definimos posicionamiento, propuesta de valor, narrativa y los principios que deben guiar la marca.",
    },
    {
      number: "03",
      title: "Align",
      text:
        "Conectamos estrategia de negocio y estrategia de marca para construir una dirección compartida.",
    },
    {
      number: "04",
      title: "Activate",
      text:
        "Convertimos la estrategia en criterios claros capaces de orientar identidad, comunicación y experiencias.",
    },
  ],

  deliverables: [
    "Strategic Foundation",
    "Brand Positioning",
    "Value Proposition",
    "Brand Narrative",
    "Audience Definition",
    "Brand Principles",
    "Strategic Roadmap",
  ],

  finalCta: {
    eyebrow: "Start a Project",
    title:
      "Si tu marca necesita una dirección más clara, empecemos por entender hacia dónde debe ir.",
    email: "hello@kyruma.com",
  },
};

export default function BrandStrategyPage() {
  return <ServicePageTemplate data={brandStrategyData} />;
}