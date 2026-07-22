import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kyruma.com"),

  title: {
    default: "KYRUMA | Estrategia, Identidad y Experiencia Digital",
    template: "%s | KYRUMA",
  },

  description:
    "Alineamos estrategia, identidad y experiencia digital para que la percepción de tu marca esté a la altura del negocio que has construido.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "KYRUMA | Estrategia, Identidad y Experiencia Digital",
    description:
      "Estrategia, identidad y experiencia digital para empresas que quieren cerrar la brecha entre lo que son y cómo son percibidas.",
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
    title: "KYRUMA | Estrategia, Identidad y Experiencia Digital",
    description:
      "Estrategia, identidad y experiencia digital para empresas que quieren cerrar la brecha entre lo que son y cómo son percibidas.",
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
        <ThemeProvider>
          <LanguageProvider>
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
                      knowsAbout: [
                        "Business Strategy",
                        "Brand Strategy",
                        "Brand Identity",
                        "Digital Experiences",
                        "Business Systems",
                        "Artificial Intelligence",
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
                      image: "https://www.kyruma.com/og-image.jpg",
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

            <Navbar />

            {children}

            <Footer />

            {/* Google Analytics */}
            <GoogleAnalytics gaId="G-XDB5TYYW0J" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}