import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import CookieConsent from "@/components/consent/CookieConsent";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomepageExpressPrompt from "@/components/express/HomepageExpressPrompt";
import { MotionProvider } from "@/motion";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kyruma.com"),
  applicationName: "KYRUMA",
  creator: "KYRUMA",
  publisher: "KYRUMA",
  category: "B2B Creative Partner",

  title: {
    default: "KYRUMA | Estrategia, Identidad y Experiencia Digital",
    template: "%s | KYRUMA",
  },

  description:
    "Creative Partner B2B para empresas cuyo negocio ha evolucionado más rápido que su percepción. Estrategia, identidad y experiencia digital en una sola dirección.",

  keywords: [
    "KYRUMA",
    "KYRUMA Creative",
    "estrategia de marca",
    "identidad de marca",
    "experiencia digital",
    "creative partner",
  ],

  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },

  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "1254x1254" }],
    apple: [{ url: "/icon.png", sizes: "1254x1254" }],
  },
  manifest: "/manifest.webmanifest",

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
        alt: "KYRUMA — Creative Partner B2B",
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
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <ClerkProvider>
          <ThemeProvider>
            <LanguageProvider>
              <MotionProvider>
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
                        alternateName: "KYRUMA Creative",
                        url: "https://www.kyruma.com/",
                        logo: {
                          "@type": "ImageObject",
                          url: "https://www.kyruma.com/icon.png",
                          contentUrl: "https://www.kyruma.com/icon.png",
                          width: 1254,
                          height: 1254,
                        },
                        description:
                          "B2B Creative Partner aligning strategy, identity and digital experience for businesses that have evolved faster than their perception.",
                        email: "hello@kyruma.com",
                        telephone: "+34614189346",
                        contactPoint: {
                          "@type": "ContactPoint",
                          contactType: "customer service",
                          email: "hello@kyruma.com",
                          telephone: "+34614189346",
                          availableLanguage: ["Spanish", "English"],
                        },
                        sameAs: [
                          "https://www.linkedin.com/company/kyruma/",
                          "https://www.instagram.com/kyrumacreative/",
                        ],
                        knowsAbout: [
                          "Business Strategy",
                          "Brand Strategy",
                          "Brand Identity",
                          "Digital Experience",
                          "UX Strategy",
                          "Creative Direction",
                        ],
                      },
                      {
                        "@type": "WebSite",
                        "@id": "https://www.kyruma.com/#website",
                        url: "https://www.kyruma.com/",
                        name: "KYRUMA",
                        alternateName: "KYRUMA Creative",
                        publisher: {
                          "@id": "https://www.kyruma.com/#organization",
                        },
                        inLanguage: ["es", "en"],
                      },
                      {
                        "@type": "Brand",
                        "@id": "https://www.kyruma.com/#brand",
                        name: "KYRUMA",
                        alternateName: "KYRUMA Creative",
                        url: "https://www.kyruma.com/",
                        logo: "https://www.kyruma.com/icon.png",
                        owner: {
                          "@id": "https://www.kyruma.com/#organization",
                        },
                      },
                    ],
                  }),
                }}
              />

              <Navbar />
              <HomepageExpressPrompt />

              {children}

              <Footer />

              <CookieConsent />
              </MotionProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
