import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kyruma.com"),

  title: {
    default: "KYRUMA",
    template: "%s | KYRUMA",
  },

  description:
    "Boutique Strategy & Brand Studio. We build businesses people trust.",

  keywords: [
    "Brand Strategy",
    "Brand Identity",
    "Creative Studio",
    "Digital Experience",
    "Branding",
    "Web Design",
    "KYRUMA",
  ],

  openGraph: {
    title: "KYRUMA",

    description:
      "Boutique Strategy & Brand Studio.",

    type: "website",

    locale: "en_GB",

    siteName: "KYRUMA",
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
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}