import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kyruma.com"),

  title: {
    default: "KYRUMA — Creative Business Studio",
    template: "%s — KYRUMA",
  },

  description:
    "KYRUMA is an independent creative business studio combining strategy, identity, digital experiences and systems to build businesses people trust.",

  keywords: [
    "KYRUMA",
    "Creative Business Studio",
    "Brand Strategy",
    "Brand Identity",
    "Digital Experience",
    "Business Strategy",
    "Web Design",
    "Creative Studio",
  ],

  authors: [
    {
      name: "KYRUMA",
    },
  ],

  creator: "KYRUMA",

  publisher: "KYRUMA",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    title: "KYRUMA — Creative Business Studio",

    description:
      "Strategy, identity, digital experiences and systems for ambitious businesses.",

    type: "website",

    locale: "en_GB",

    siteName: "KYRUMA",

    url: "/",
  },

  twitter: {
    card: "summary_large_image",

    title: "KYRUMA — Creative Business Studio",

    description:
      "Strategy, identity, digital experiences and systems for ambitious businesses.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAF8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}