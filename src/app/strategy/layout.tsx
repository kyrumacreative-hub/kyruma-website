import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estrategia de negocio y marca",
  description:
    "Estrategia de negocio, posicionamiento y arquitectura de marca para convertir ambición en una dirección clara y coherente.",
  alternates: {
    canonical: "/strategy",
  },
};

export default function StrategyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
