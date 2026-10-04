export type WorkLocale = "es" | "en";

type LocalizedText = Readonly<Record<WorkLocale, string>>;

export interface WorkCase {
  readonly slug: string;
  readonly publicId: string;
  readonly client: string;
  readonly publicUrl?: string;
  readonly updatedAt: string;
  readonly status: "active" | "completed";
  readonly headline: LocalizedText;
  readonly intro: LocalizedText;
  readonly sector: LocalizedText;
  readonly project: LocalizedText;
  readonly summary: LocalizedText;
  readonly context: LocalizedText;
  readonly direction: LocalizedText;
  readonly services: Readonly<Record<WorkLocale, readonly string[]>>;
  readonly evidence: Readonly<Record<WorkLocale, readonly string[]>>;
  readonly next: LocalizedText;
  readonly socialLinks?: readonly { readonly label: string; readonly url: string }[];
}

export const workCases: readonly WorkCase[] = [
  {
    slug: "pequenas-luces",
    publicId: "WORK-004",
    client: "Pequeñas Luces",
    publicUrl: "https://open.spotify.com/show/48FjmoOG82T6G9jsloYyFC",
    updatedAt: "2026-10-04",
    status: "active",
    headline: { es: "Pequeñas Luces", en: "Pequeñas Luces" },
    intro: {
      es: "Un podcast infantil que cuenta la fe con la espontaneidad, la alegría y la mirada de sus jóvenes protagonistas.",
      en: "A children's podcast sharing faith through the spontaneity, joy and perspective of its young hosts.",
    },
    sector: { es: "Podcast y comunidad", en: "Podcast and community" },
    project: { es: "Experiencia web editorial", en: "Editorial web experience" },
    summary: {
      es: "Una casa digital en desarrollo para reunir episodios, historias y comunidad alrededor del podcast Pequeñas Luces.",
      en: "A digital home in development to bring together episodes, stories and community around the Pequeñas Luces podcast.",
    },
    context: {
      es: "Pequeñas Luces nace del grupo de postcomunión de la Parroquia Nuestra Señora de la Concepción de Morata de Tajuña. Hoy vive principalmente en el podcast y en redes sociales.",
      en: "Pequeñas Luces grew from the post-communion group at Nuestra Señora de la Concepción parish in Morata de Tajuña. Today it lives primarily through its podcast and social channels.",
    },
    direction: {
      es: "La dirección aprobada convierte el proyecto en un pequeño magazine vivo: podcast, blog, comunidad y newsletter, respetando su identidad alegre y evitando una expresión institucional.",
      en: "The approved direction turns the project into a lively small magazine: podcast, blog, community and newsletter, preserving its joyful identity and avoiding an institutional tone.",
    },
    services: {
      es: ["Arquitectura de contenidos", "Experiencia web", "Podcast", "Blog editorial", "Comunidad y newsletter"],
      en: ["Content architecture", "Web experience", "Podcast", "Editorial blog", "Community and newsletter"],
    },
    evidence: {
      es: ["Podcast oficial activo en Spotify", "Identidad y dirección digital aprobadas", "Arquitectura V1 definida", "Experiencia web en desarrollo"],
      en: ["Official podcast active on Spotify", "Approved identity and digital direction", "Defined V1 architecture", "Web experience in development"],
    },
    next: {
      es: "La siguiente fase convierte el material aprobado en una web editorial responsive y preparada para publicar nuevos episodios y contenidos.",
      en: "The next phase turns the approved material into a responsive editorial website ready for new episodes and stories.",
    },
    socialLinks: [
      { label: "Spotify", url: "https://open.spotify.com/show/48FjmoOG82T6G9jsloYyFC" },
      { label: "Canales oficiales", url: "https://linktr.ee/peque.luces" },
    ],
  },
  {
    slug: "rihat-sax-quartet",
    publicId: "WORK-005",
    client: "Rihat Sax Quartet",
    publicUrl: "https://museosanjuandedios.es/index.php?id=345&seccion=actividades",
    updatedAt: "2026-10-04",
    status: "active",
    headline: { es: "Rihat Sax Quartet", en: "Rihat Sax Quartet" },
    intro: {
      es: "Cuatro saxofones, una formación común y una presencia musical que encuentra su fuerza en el conjunto.",
      en: "Four saxophones, a shared musical background and a stage presence shaped by the strength of the ensemble.",
    },
    sector: { es: "Música y cultura", en: "Music and culture" },
    project: { es: "Proyecto en documentación", en: "Project being documented" },
    summary: {
      es: "Incorporamos Rihat Sax Quartet al archivo de KYRUMA con una primera ficha basada únicamente en evidencia pública verificable.",
      en: "Rihat Sax Quartet joins the KYRUMA archive with an initial case page based only on verifiable public evidence.",
    },
    context: {
      es: "Rihat Sax Quartet es una agrupación formada en el Real Conservatorio Superior de Música Victoria Eugenia de Granada, con actividad concertística documentada en la ciudad.",
      en: "Rihat Sax Quartet is an ensemble formed at Granada's Real Conservatorio Superior de Música Victoria Eugenia, with documented concert activity in the city.",
    },
    direction: {
      es: "La ficha se publica como capítulo abierto. El alcance creativo de KYRUMA, los materiales visuales y los entregables se incorporarán cuando exista evidencia aprobada para mostrarlos.",
      en: "This case is published as an open chapter. KYRUMA's creative scope, visual materials and deliverables will be added once approved evidence is available.",
    },
    services: {
      es: ["Documentación de proyecto", "Dirección pendiente de publicación"],
      en: ["Project documentation", "Direction pending publication"],
    },
    evidence: {
      es: ["Agrupación vinculada al RCSM Victoria Eugenia", "Actividad concertística pública documentada", "Proyecto incorporado al archivo KYRUMA"],
      en: ["Ensemble linked to RCSM Victoria Eugenia", "Documented public concert activity", "Project added to the KYRUMA archive"],
    },
    next: {
      es: "Completaremos este caso con el alcance, la dirección visual y los entregables aprobados del proyecto, sin adelantar información no verificada.",
      en: "We will complete this case with the project's approved scope, visual direction and deliverables, without anticipating unverified information.",
    },
  },
  {
    slug: "magic-by-whyso",
    publicId: "KYR-002",
    client: "Magic By Whyso",
    publicUrl: "https://magicbywhyso.kyruma.com",
    updatedAt: "2026-08-30",
    status: "active",
    headline: { es: "Magic By Whyso", en: "Magic By Whyso" },
    intro: {
      es: "Una marca de experiencias de viaje construyendo una expresión propia y una forma más clara de convertir interés en reserva.",
      en: "A travel experiences brand building a distinctive expression and a clearer path from interest to booking.",
    },
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
    next: {
      es: "La dirección creativa y el diseño web avanzan en paralelo. El caso se ampliará con entregables aprobados y evidencia de lanzamiento.",
      en: "Creative direction and web design are progressing together. The case will expand with approved deliverables and launch evidence.",
    },
  },
  {
    slug: "raul-marques-de-la-torre",
    publicId: "KYR-003",
    client: "Raúl Marqués de la Torre",
    publicUrl: "https://raulmarquesdelatorre.com",
    updatedAt: "2026-09-01",
    status: "active",
    headline: {
      es: "Raúl Marqués de la Torre",
      en: "Raúl Marqués de la Torre",
    },
    intro: {
      es: "Una práctica creativa independiente donde música, estilo y cultura se convierten en una identidad editorial reconocible.",
      en: "An independent creative practice where music, style and culture become a recognizable editorial identity.",
    },
    sector: {
      es: "Marca personal y cultura",
      en: "Personal brand and culture",
    },
    project: {
      es: "Web, marca y redes sociales",
      en: "Web, brand and social media",
    },
    summary: {
      es: "Una colaboración activa para articular RMT como sistema de marca, experiencia web y presencia social conectada.",
      en: "An active collaboration shaping RMT as a connected brand system, web experience and social presence.",
    },
    context: {
      es: "RMT reúne una práctica personal en torno a la música, el estilo, los viajes y la cultura. El reto es dar continuidad a esa mirada entre la identidad, la web y cada canal social.",
      en: "RMT brings together a personal practice around music, style, travel and culture. The challenge is to carry that point of view consistently across the identity, the website and every social channel.",
    },
    direction: {
      es: "KYRUMA está desarrollando una expresión editorial coherente bajo la idea «Process. Passion. Purpose.», con una web-archivo activa y un sistema de contenidos para Instagram, TikTok, YouTube y Facebook.",
      en: "KYRUMA is developing a coherent editorial expression around ‘Process. Passion. Purpose.’, with an active web archive and a content system for Instagram, TikTok, YouTube and Facebook.",
    },
    services: {
      es: ["Estrategia de marca", "Identidad editorial", "Experiencia web", "Sistema de contenidos", "Dirección de RRSS"],
      en: ["Brand strategy", "Editorial identity", "Web experience", "Content system", "Social media direction"],
    },
    evidence: {
      es: ["Identidad RMT activa", "Web editorial publicada", "Archivo de música, estilo y vida", "Presencia social conectada en cuatro canales"],
      en: ["Active RMT identity", "Published editorial website", "Music, style and life archive", "Connected social presence across four channels"],
    },
    next: {
      es: "La siguiente fase conecta el crecimiento del archivo web con una cadencia editorial coherente en redes sociales, sin adelantar resultados todavía no medidos.",
      en: "The next phase connects the growth of the web archive with a coherent editorial rhythm across social media, without anticipating outcomes that have not yet been measured.",
    },
    socialLinks: [
      { label: "Instagram", url: "https://www.instagram.com/raulmarquesdlt/" },
      { label: "TikTok", url: "https://www.tiktok.com/@raulmarquesdlt" },
      { label: "YouTube", url: "https://www.youtube.com/@raulmarquesdlt" },
      { label: "Facebook", url: "https://www.facebook.com/rauul.mt28/" },
    ],
  },
] as const;

export function getWorkCase(slug: string): WorkCase | undefined {
  return workCases.find((item) => item.slug === slug);
}
