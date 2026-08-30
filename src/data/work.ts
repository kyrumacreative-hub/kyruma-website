export type WorkLocale = "es" | "en";

type LocalizedText = Readonly<Record<WorkLocale, string>>;

export interface WorkCase {
  readonly slug: string;
  readonly publicId: string;
  readonly client: string;
  readonly publicUrl: string;
  readonly updatedAt: string;
  readonly status: "active" | "completed";
  readonly sector: LocalizedText;
  readonly project: LocalizedText;
  readonly summary: LocalizedText;
  readonly context: LocalizedText;
  readonly direction: LocalizedText;
  readonly services: Readonly<Record<WorkLocale, readonly string[]>>;
  readonly evidence: Readonly<Record<WorkLocale, readonly string[]>>;
}

export const workCases: readonly WorkCase[] = [
  {
    slug: "magic-by-whyso",
    publicId: "KYR-002",
    client: "Magic By Whyso",
    publicUrl: "https://magicbywhyso.kyruma.com",
    updatedAt: "2026-08-30",
    status: "active",
    sector: {
      es: "Experiencias de viaje",
      en: "Travel experiences",
    },
    project: {
      es: "Identidad y experiencia web",
      en: "Identity and web experience",
    },
    summary: {
      es: "Una colaboración activa para ordenar la expresión de marca y convertirla en una experiencia digital clara, reconocible y preparada para reservas.",
      en: "An active collaboration to shape the brand expression and turn it into a clear, recognizable digital experience built around bookings.",
    },
    context: {
      es: "Magic By Whyso llega con una identidad en desarrollo, materiales de marca, referencias visuales y un flujo de reservas que deben convivir dentro de una misma experiencia.",
      en: "Magic By Whyso brings together an evolving identity, brand materials, visual references and a booking flow that need to work as one experience.",
    },
    direction: {
      es: "KYRUMA está conectando Discovery, dirección creativa, identidad y diseño web en un sistema coherente. La web continúa en desarrollo y el caso crecerá a medida que existan entregables y resultados verificables.",
      en: "KYRUMA is connecting Discovery, creative direction, identity and web design into one coherent system. The website remains in progress and this case will grow as verified deliverables and outcomes become available.",
    },
    services: {
      es: ["Estrategia de marca", "Dirección visual", "Experiencia web", "Flujo de reservas"],
      en: ["Brand strategy", "Visual direction", "Web experience", "Booking flow"],
    },
    evidence: {
      es: ["Discovery recibido", "Materiales de identidad y referencias revisados", "Dirección creativa definida", "Diseño web en curso"],
      en: ["Discovery received", "Identity materials and references reviewed", "Creative direction defined", "Web design in progress"],
    },
  },
] as const;

export function getWorkCase(slug: string): WorkCase | undefined {
  return workCases.find((item) => item.slug === slug);
}
