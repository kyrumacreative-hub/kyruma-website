export type WorkLocale = "es" | "en";

type LocalizedText = Readonly<Record<WorkLocale, string>>;

export interface WorkCase {
  readonly slug: string;
  readonly publicId: string;
  readonly client: string;
  readonly publicUrl?: string;
  readonly updatedAt: string;
  readonly status: "active" | "completed";
  readonly publication: "public" | "hold";
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

const allWorkCases: readonly WorkCase[] = [
  {
    slug: "pequenas-luces",
    publicId: "KYR-003",
    client: "Pequeñas Luces",
    publicUrl: "https://open.spotify.com/show/48FjmoOG82T6G9jsloYyFC",
    updatedAt: "2026-10-04",
    status: "active",
    publication: "hold",
    headline: { es: "Pequeñas Luces", en: "Pequeñas Luces" },
    intro: {
      es: "Un podcast infantil que cuenta la fe con la espontaneidad, la alegría y la mirada de sus jóvenes protagonistas.",
      en: "A children's podcast sharing faith through the spontaneity, joy and perspective of its young hosts.",
    },
    sector: { es: "Podcast y comunidad", en: "Podcast and community" },
    project: { es: "Experiencia web editorial", en: "Editorial web experience" },
    summary: {
      es: "Un proyecto cliente en fase de Discovery para reunir episodios, historias y comunidad alrededor del podcast Pequeñas Luces. La fase actual está a la espera de continuación.",
      en: "A client project in Discovery focused on bringing together episodes, stories and community around the Pequeñas Luces podcast. The current phase is awaiting continuation.",
    },
    context: {
      es: "Pequeñas Luces nace del grupo de postcomunión de la Parroquia Nuestra Señora de la Concepción de Morata de Tajuña. Hoy vive principalmente en el podcast y en redes sociales.",
      en: "Pequeñas Luces grew from the post-communion group at Nuestra Señora de la Concepción parish in Morata de Tajuña. Today it lives primarily through its podcast and social channels.",
    },
    direction: {
      es: "La dirección de trabajo desarrollada por KYRUMA plantea un pequeño magazine vivo —podcast, blog, comunidad y newsletter— respetando su identidad alegre y evitando una expresión institucional. El alcance publicado seguirá condicionado por evidencia y permiso.",
      en: "KYRUMA’s working direction proposes a lively small magazine — podcast, blog, community and newsletter — preserving its joyful identity and avoiding an institutional tone. Any published scope remains subject to evidence and permission.",
    },
    services: {
      es: ["Arquitectura de contenidos", "Experiencia web", "Podcast", "Blog editorial", "Comunidad y newsletter"],
      en: ["Content architecture", "Web experience", "Podcast", "Editorial blog", "Community and newsletter"],
    },
    evidence: {
      es: ["Cliente KYR-003 confirmado", "Discovery recibido", "Podcast oficial activo en Spotify", "Dirección de identidad/web documentada"],
      en: ["KYR-003 client status confirmed", "Discovery received", "Official podcast active on Spotify", "Identity/web direction documented"],
    },
    next: {
      es: "La siguiente fase se reanudará cuando Pequeñas Luces confirme la continuación. El caso permanece en HOLD para portfolio hasta registrar permiso y evidencia suficiente.",
      en: "The next phase will resume when Pequeñas Luces confirms continuation. The case remains on HOLD for portfolio use until permission and sufficient evidence are recorded.",
    },
    socialLinks: [
      { label: "Spotify", url: "https://open.spotify.com/show/48FjmoOG82T6G9jsloYyFC" },
      { label: "Canales oficiales", url: "https://linktr.ee/peque.luces" },
    ],
  },
  {
    slug: "rihat-sax-quartet",
    publicId: "KYR-004",
    client: "Rihat Sax Quartet",
    publicUrl: "https://museosanjuandedios.es/index.php?id=345&seccion=actividades",
    updatedAt: "2026-10-04",
    status: "active",
    publication: "hold",
    headline: { es: "Rihat Sax Quartet", en: "Rihat Sax Quartet" },
    intro: {
      es: "Cuatro saxofones, una formación común y una presencia musical que encuentra su fuerza en el conjunto.",
      en: "Four saxophones, a shared musical background and a stage presence shaped by the strength of the ensemble.",
    },
    sector: { es: "Música y cultura", en: "Music and culture" },
    project: { es: "Proyecto en documentación", en: "Project being documented" },
    summary: {
      es: "Rihat Sax Quartet está incorporado al archivo interno de KYRUMA con una ficha de trabajo basada únicamente en evidencia verificable y todavía no publicada.",
      en: "Rihat Sax Quartet is included in KYRUMA’s internal archive with a working record based only on verifiable evidence and not yet published.",
    },
    context: {
      es: "Rihat Sax Quartet es una agrupación formada en el Real Conservatorio Superior de Música Victoria Eugenia de Granada, con actividad concertística documentada en la ciudad.",
      en: "Rihat Sax Quartet is an ensemble formed at Granada's Real Conservatorio Superior de Música Victoria Eugenia, with documented concert activity in the city.",
    },
    direction: {
      es: "La ficha permanece en preparación y en HOLD. El alcance creativo de KYRUMA, los materiales visuales y los entregables solo se incorporarán cuando exista evidencia y permiso aprobados.",
      en: "The record remains in preparation and on HOLD. KYRUMA's creative scope, visual materials and deliverables will only be added once evidence and permission are approved.",
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
    updatedAt: "2026-10-07",
    status: "completed",
    publication: "public",
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
      es: "Dirección digital y experiencia web",
      en: "Digital direction and web experience",
    },
    summary: {
      es: "Un proyecto entregado para ordenar materiales de marca existentes y convertirlos en una experiencia digital clara, reconocible y preparada para reservas.",
      en: "A delivered project that organised existing brand materials into a clear, recognizable digital experience built around bookings.",
    },
    context: {
      es: "Magic By Whyso llega con una identidad en desarrollo, materiales de marca, referencias visuales y un flujo de reservas que deben convivir dentro de una misma experiencia.",
      en: "Magic By Whyso brings together an evolving identity, brand materials, visual references and a booking flow that need to work as one experience.",
    },
    direction: {
      es: "KYRUMA conectó Discovery, dirección creativa y diseño web alrededor de una identidad y materiales de marca preexistentes del cliente. El caso se publica únicamente dentro de ese alcance documentado: no atribuimos a KYRUMA el logo ni la identidad original.",
      en: "KYRUMA connected Discovery, creative direction and web design around the client’s pre-existing identity and brand materials. This case is published only within that documented scope: KYRUMA does not claim authorship of the original logo or identity.",
    },
    services: {
      es: ["Discovery", "Dirección creativa", "Experiencia web", "Flujo de reservas"],
      en: ["Discovery", "Creative direction", "Web experience", "Booking flow"],
    },
    evidence: {
      es: ["Discovery recibido", "Materiales de identidad aportados por el cliente revisados", "Dirección creativa definida", "Web y activos digitales entregados"],
      en: ["Discovery received", "Client-provided identity materials reviewed", "Creative direction defined", "Web and digital assets delivered"],
    },
    next: {
      es: "El proyecto está entregado. Este caso permanece deliberadamente limitado a trabajo y entregables verificables; no publicamos métricas de rendimiento que no estén documentadas.",
      en: "The project is delivered. This case is deliberately limited to verifiable work and deliverables; no undocumented performance metrics are published.",
    },
  },
  {
    slug: "raul-marques-de-la-torre",
    publicId: "KYR-001",
    client: "Raúl Marqués de la Torre",
    publicUrl: "https://raulmarquesdelatorre.com",
    updatedAt: "2026-09-01",
    status: "active",
    publication: "public",
    headline: {
      es: "Raúl Marqués de la Torre",
      en: "Raúl Marqués de la Torre",
    },
    intro: {
      es: "Un proyecto cliente founder-controlled, impulsado por el fundador de KYRUMA, donde música, estilo y cultura se articulan como una identidad editorial reconocible.",
      en: "A founder-controlled client project where music, style and culture are shaped into a recognizable editorial identity.",
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
      es: "Un proyecto cliente founder-controlled que desarrolla RMT como sistema de marca, experiencia web y presencia social conectada.",
      en: "A founder-controlled client project developing RMT as a connected brand system, web experience and social presence.",
    },
    context: {
      es: "RMT reúne una práctica personal en torno a la música, el estilo, los viajes y la cultura. Es un cliente founder-controlled de KYRUMA y permite demostrar proceso, criterio y sistema, pero no se presenta como validación de un cliente externo independiente.",
      en: "RMT brings together a personal practice around music, style, travel and culture. It is a founder-controlled KYRUMA client and demonstrates process, judgement and system thinking, but is not presented as independent external-client validation.",
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

export const workCases: readonly WorkCase[] = allWorkCases.filter((item) => item.publication === "public");

export function getWorkCase(slug: string): WorkCase | undefined {
  return workCases.find((item) => item.slug === slug);
}
