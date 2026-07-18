import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kyruma.com"),

  title: {
    default: "KYRUMA | Estudio de Estrategia y Negocio Creativo",
    template: "%s | KYRUMA",
  },

  description:
    "Articulamos la estrategia, la identidad visual y los ecosistemas digitales de las compañías que definen su industria.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "KYRUMA | Estudio de Estrategia y Negocio Creativo",
    description:
      "Diseñamos empresas en las que la gente confía. No competimos por atención; construimos legado.",
    url: "/",
    siteName: "KYRUMA",
    locale: "es_ES",
    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KYRUMA — Estudio de Estrategia y Negocio Creativo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "KYRUMA | Estudio de Estrategia y Negocio Creativo",
    description:
      "Diseñamos empresas en las que la gente confía. No competimos por atención; construimos legado.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}