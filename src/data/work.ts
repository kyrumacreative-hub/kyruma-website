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
      es: "Una dirección de trabajo en fase pre-cliente para reunir episodios, historias y comunidad alrededor del podcast Pequeñas Luces. No existe activación de cliente documentada.",
      en: "A pre-client working direction for bringing together episodes, stories and community around the Pequeñas Luces podcast. No client activation is documented.",
    },
    context: {
      es: "Pequeñas Luces nace del grupo de postcomunión de la Parroquia Nuestra Señora de la Concepción de Morata de Tajuña. Hoy vive principalmente en el podcast y en redes sociales.",
      en: "Pequeñas Luces grew from the post-communion group at Nuestra Señora de la Concepción parish in Morata de Tajuña. Today it lives primarily through its podcast and social channels.",
    },
    direction: {
      es: "La dirección explorada por KYRUMA plantea un pequeño magazine vivo —podcast, blog, comunidad y newsletter— respetando su identidad alegre y evitando una expresión institucional. No debe presentarse como una solución contratada o implantada.",
      en: "KYRUMA’s explored direction proposes a lively small magazine — podcast, blog, community and newsletter — preserving its joyful identity and avoiding an institutional tone. It must not be presented as a commissioned or implemented solution.",
    },
    services: {
      es: ["Arquitectura de contenidos", "Experiencia web", "Podcast", "Blog editorial", "Comunidad y newsletter"],
      en: ["Content architecture", "Web experience", "Podcast", "Editorial blog", "Community and newsletter"],
    },
    evidence: {
      es: ["Discovery recibido", "Podcast oficial activo en Spotify", "Dirección interna de identidad/web documentada", "Sin contrato, pago ni activación de cliente documentados"],
      en: ["Discovery received", "Official podcast active on Spotify", "Internal identity/web direction documented", "No contract, payment or client activation documented"],
    },
    next: {
      es: "La siguiente fase solo debe comenzar si Pequeñas Luces confirma que quiere continuar. Hasta entonces, el registro permanece en HOLD y no es proof comercial.",
      en: "The next phase should only begin if Pequeñas Luces confirms it wants to continue. Until then, the record remains on HOLD and is not commercial proof.",
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
    status: "completed",
    publication: "hold",
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
      es: "KYRUMA conectó Discovery, dirección creativa y diseño web alrededor de una identidad y materiales de marca preexistentes del cliente. El proyecto está entregado; el caso permanece en HOLD hasta registrar permiso de portfolio y claims aprobados.",
      en: "KYRUMA connected Discovery, creative direction and web design around the client’s pre-existing identity and brand materials. The project is delivered; the case remains on HOLD until portfolio permission and approved claims are recorded.",
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
      es: "El siguiente paso no es ampliar el alcance: es registrar permiso de portfolio y definir exactamente qué claims pueden publicarse.",
      en: "The next step is not broader scope: it is to record portfolio permission and define exactly which claims may be published.",
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
      es: "Un proyecto propio, impulsado por el fundador de KYRUMA, donde música, estilo y cultura se articulan como una identidad editorial reconocible.",
      en: "A founder-led internal project where music, style and culture are shaped into a recognizable editorial identity.",
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
      es: "Un proyecto interno y founder-controlled que sirve para desarrollar RMT como sistema de marca, experiencia web y presencia social conectada.",
      en: "An internal, founder-controlled project developing RMT as a connected brand system, web experience and social presence.",
    },
    context: {
      es: "RMT reúne una práctica personal en torno a la música, el estilo, los viajes y la cultura. Como proyecto propio, permite demostrar proceso, criterio y sistema, pero no se presenta como validación de un cliente externo independiente.",
      en: "RMT brings together a personal practice around music, style, travel and culture. As an internal project, it demonstrates process, judgement and system thinking, but is not presented as independent external-client validation.",
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
