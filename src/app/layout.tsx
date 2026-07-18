import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://kyruma.com"),

  title: {
    default: "KYRUMA | Estudio de Estrategia y Negocio Creativo",
    template: "%s | KYRUMA",
  },

  description:
    "Articulamos la estrategia, la identidad visual y los ecosistemas digitales de las compañías que definen su industria.",

  openGraph: {
    title: "KYRUMA | Estudio de Estrategia y Negocio Creativo",
    description:
      "Diseñamos empresas en las que la gente confía. No competimos por atención; construimos legado.",
    url: "https://kyruma.com",
    siteName: "KYRUMA",
    locale: "es_ES",
    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KYRUMA — Creative Business & Strategy Studio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "KYRUMA | Estudio de Estrategia y Negocio Creativo",
    description: "Diseñamos empresas en las que la gente confía.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://kyruma.com",
  },
};