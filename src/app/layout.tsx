import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.kyruma.com/#organization",
                  name: "KYRUMA",
                  url: "https://www.kyruma.com/",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.kyruma.com/og-image.jpg",
                  },
                  description:
                    "Independent Creative Business & Strategy Studio. Strategy, identity, digital experiences and systems for ambitious businesses.",
                  email: "hello@kyruma.com",
                  sameAs: [
                    "https://www.linkedin.com/company/kyruma/",
                    "https://www.instagram.com/kyrumacreative/",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.kyruma.com/#website",
                  url: "https://www.kyruma.com/",
                  name: "KYRUMA",
                  publisher: {
                    "@id": "https://www.kyruma.com/#organization",
                  },
                  inLanguage: ["es", "en"],
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://www.kyruma.com/#service",
                  name: "KYRUMA",
                  url: "https://www.kyruma.com/",
                  provider: {
                    "@id": "https://www.kyruma.com/#organization",
                  },
                  serviceType: [
                    "Business Strategy",
                    "Brand Strategy",
                    "Brand Identity",
                    "Digital Experiences",
                    "Business Systems",
                    "Artificial Intelligence Systems",
                  ],
                },
              ],
            }),
          }}
        />
        {children}
        
        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-XDB5TYYW0J" />
      </body>
    </html>
  );
}