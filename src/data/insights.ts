export type InsightSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Insight = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  publishedAt: string;
  readingTime: string;
  keywords: string[];
  intro: string[];
  sections: InsightSection[];
  matchStart: string;
};

export const insights: Insight[] = [
  {
    slug: "como-saber-si-tu-web-esta-perdiendo-clientes",
    title: "Cómo saber si tu web está perdiendo clientes",
    description: "Señales concretas para detectar si tu página web está frenando contactos, reservas o ventas y qué revisar primero.",
    eyebrow: "WEB / CONVERSIÓN",
    publishedAt: "2026-10-04",
    readingTime: "7 min",
    keywords: ["auditoría web", "web no convierte", "mejorar página web", "conversión web", "diseño web empresa"],
    intro: [
      "Una web puede funcionar técnicamente y aun así estar perdiendo oportunidades. Carga, se ve bien y tiene todas las páginas necesarias, pero el usuario no entiende con rapidez qué ofrece el negocio, por qué debería confiar o qué debe hacer después.",
      "La mayoría de estos problemas no empiezan en el diseño visual. Empiezan en la claridad. Antes de rediseñar una web completa conviene detectar en qué punto se rompe la experiencia.",
    ],
    sections: [
      { heading: "1. No se entiende qué haces en pocos segundos", paragraphs: ["La primera pantalla debería permitir identificar el servicio, el tipo de cliente al que ayudas y el resultado principal que ofreces. Si el visitante necesita explorar varias secciones para entenderlo, la web está pidiendo demasiado esfuerzo demasiado pronto."], bullets: ["Qué vendes o haces", "Para quién es", "Qué resultado o valor aportas", "Cuál es el siguiente paso"] },
      { heading: "2. Hay demasiadas acciones compitiendo", paragraphs: ["Una web que pide reservar, descargar, seguir, escribir, comprar y leer al mismo tiempo suele reducir la probabilidad de que ocurra cualquiera de esas acciones. Cada página necesita una prioridad clara."], bullets: ["Define una acción principal", "Utiliza una secundaria solo cuando sea necesaria", "Repite el CTA principal en los momentos adecuados"] },
      { heading: "3. La confianza llega demasiado tarde", paragraphs: ["El usuario no conoce tu negocio como tú. Necesita señales que reduzcan incertidumbre: trabajos, casos, proceso, equipo, experiencia, datos verificables o testimonios reales cuando existan. Si esas señales están escondidas al final, muchas visitas no llegarán hasta ellas."] },
      { heading: "4. La versión móvil parece una adaptación", paragraphs: ["Para muchos negocios, una parte importante de las primeras visitas llega desde el móvil. Texto excesivo, botones pequeños, formularios largos o jerarquías que solo funcionan en escritorio pueden convertir una buena web en una mala experiencia."], bullets: ["Comprueba la primera pantalla desde un móvil real", "Prueba todos los formularios", "Revisa tamaño de botones y enlaces", "Elimina contenido redundante"] },
      { heading: "5. El diseño promete algo distinto al negocio", paragraphs: ["Una empresa que ha mejorado producto, servicio o posicionamiento puede seguir presentándose con una web creada para una etapa anterior. Esa distancia entre lo que el negocio es y lo que parece reduce confianza incluso cuando el usuario no sabe explicar por qué."] },
      { heading: "Qué revisar primero", paragraphs: ["Antes de hablar de animaciones, colores o tendencias, revisa este orden: mensaje, jerarquía, confianza, CTA, móvil y después estética. Si los cinco primeros puntos no funcionan, una capa visual nueva rara vez corrige el problema de fondo."] },
    ],
    matchStart: "seo_web_perdiendo_clientes",
  },
  {
    slug: "errores-instagram-negocios",
    title: "7 errores de Instagram que hacen que un buen negocio parezca peor de lo que es",
    description: "Errores frecuentes de perfil, bio, CTA, destacados y contenido que reducen la claridad y la confianza de un negocio en Instagram.",
    eyebrow: "INSTAGRAM / MARCA",
    publishedAt: "2026-10-04",
    readingTime: "6 min",
    keywords: ["optimizar instagram empresa", "bio instagram negocio", "instagram para negocios", "auditoría instagram", "mejorar perfil instagram"],
    intro: [
      "Instagram suele ser una de las primeras comprobaciones que hace un cliente antes de contactar con un pequeño negocio. No hace falta que el perfil sea perfecto, pero sí debe ayudar a entender qué haces, transmitir confianza y facilitar el siguiente paso.",
      "Estos son siete errores que aparecen una y otra vez incluso en negocios que ofrecen un producto o servicio excelente.",
    ],
    sections: [
      { heading: "1. La bio describe pero no posiciona", paragraphs: ["Una lista de servicios no explica por qué debería elegirte alguien. La bio debe priorizar claridad: qué haces, para quién y qué diferencia o resultado es relevante."] },
      { heading: "2. El nombre visible no ayuda a encontrarte", paragraphs: ["El campo de nombre puede aportar contexto útil sobre categoría o especialidad. Desaprovecharlo hace que un usuario nuevo tenga que interpretar demasiado y reduce oportunidades de descubrimiento dentro de la propia plataforma."] },
      { heading: "3. No existe un CTA claro", paragraphs: ["Si el perfil termina sin indicar qué hacer después, el visitante tiene que decidirlo solo. Reserva, compra, consulta, portfolio o carta: elige la acción que realmente importe al negocio."] },
      { heading: "4. Los destacados son un archivo, no una experiencia", paragraphs: ["Destacados antiguos, sin orden o con títulos ambiguos añaden ruido. Trátalos como una navegación sencilla."], bullets: ["Servicios", "Resultados o trabajos", "Sobre nosotros", "Preguntas frecuentes", "Contacto o reserva"] },
      { heading: "5. Cada publicación parece de una marca distinta", paragraphs: ["Coherencia no significa que todo sea idéntico. Significa que fotografía, tipografía, color y tono parecen pertenecer al mismo negocio. La consistencia reduce esfuerzo cognitivo y ayuda al reconocimiento."] },
      { heading: "6. Se publica sin una función", paragraphs: ["Publicar por mantener actividad genera volumen, no necesariamente claridad. Cada contenido debería cumplir al menos una función: explicar, demostrar, responder, conectar o convertir."] },
      { heading: "7. Se intenta parecer profesional en vez de ser claro", paragraphs: ["Frases grandilocuentes, textos impersonales y diseños excesivos pueden esconder lo que de verdad interesa al cliente. La claridad suele parecer más profesional que la complejidad."] },
      { heading: "Por dónde empezar", paragraphs: ["Corrige primero bio, CTA y destacados. Después define una dirección visual básica y tres o cuatro pilares de contenido. No necesitas rehacerlo todo en un día; necesitas establecer una dirección consistente."] },
    ],
    matchStart: "seo_instagram_errores",
  },
  {
    slug: "auditoria-instagram-que-revisar",
    title: "Auditoría de Instagram: qué revisar antes de cambiar tu perfil",
    description: "Checklist práctica para auditar un perfil de Instagram de negocio: nombre, bio, CTA, destacados, dirección visual, contenido y conversión.",
    eyebrow: "INSTAGRAM / AUDITORÍA",
    publishedAt: "2026-10-05",
    readingTime: "8 min",
    keywords: ["auditoría Instagram", "auditoria perfil Instagram", "mejorar perfil Instagram negocio", "bio Instagram empresa", "optimizar Instagram empresa", "Instagram para negocios"],
    intro: [
      "Cambiar colores, portadas o publicar más no siempre mejora un perfil de Instagram. Si alguien nuevo entra y no entiende con rapidez qué hace el negocio, por qué debería confiar o qué acción debe realizar después, el problema está antes del contenido.",
      "Una auditoría útil revisa el perfil como experiencia de entrada: qué ve una persona que no conoce la marca, qué entiende en los primeros segundos y qué fricciones aparecen antes de contactar, reservar o comprar.",
    ],
    sections: [
      { heading: "1. Primera impresión: ¿se entiende el negocio?", paragraphs: ["Mira el perfil sin contexto. La foto, el nombre visible, la bio, los destacados y las primeras publicaciones deberían formar una respuesta coherente a tres preguntas: qué haces, para quién y qué debería hacer alguien después."], bullets: ["Qué ofrece el negocio", "A quién ayuda o atiende", "Qué diferencia o especialidad merece recordarse", "Cuál es la acción principal"] },
      { heading: "2. Nombre visible y búsqueda", paragraphs: ["El nombre visible no tiene por qué repetir exactamente el usuario. Puede aportar una categoría, especialidad o contexto que ayude a entender y encontrar el perfil dentro de Instagram. La prioridad es que siga siendo natural y útil para una persona real."], bullets: ["Incluye la categoría si aporta claridad", "Evita acumular palabras clave sin sentido", "No sacrifiques el nombre de marca cuando sea importante"] },
      { heading: "3. Bio: claridad antes que creatividad", paragraphs: ["Una bio eficaz no necesita sonar grandilocuente. Necesita reducir dudas. Una estructura simple suele funcionar mejor: qué haces, para quién o con qué enfoque, una señal relevante de confianza cuando exista y una acción concreta."], bullets: ["Qué haces", "Para quién", "Por qué puede importar", "Qué debe hacer después"] },
      { heading: "4. CTA y enlace: una acción principal", paragraphs: ["Cuando hay demasiadas acciones compitiendo —reservar, comprar, escribir, ver carta, descargar, llamar— el visitante tiene que decidir demasiado. Define cuál sostiene el negocio y hazla evidente en bio, enlace y destacados." ] },
      { heading: "5. Destacados: conviértelos en navegación", paragraphs: ["Los destacados funcionan mejor cuando responden a las preguntas que aparecen antes de contactar. No deberían ser un archivo cronológico de historias antiguas."], bullets: ["Servicios o carta", "Resultados, trabajos o casos reales", "Sobre el negocio", "Preguntas frecuentes", "Reserva, compra o contacto"] },
      { heading: "6. Dirección visual: coherencia sin rigidez", paragraphs: ["Una dirección visual clara no significa que todas las publicaciones sean iguales. Significa que fotografía, color, tipografía y composición parecen pertenecer a la misma marca. Esa consistencia ayuda a que el negocio se reconozca y reduce la sensación de improvisación." ] },
      { heading: "7. Contenido: cada publicación necesita una función", paragraphs: ["Antes de planificar treinta ideas, define qué debe conseguir el contenido. Una mezcla útil suele combinar explicación, demostración, respuesta a objeciones, conexión y conversión."], bullets: ["Explicar qué haces y cómo funciona", "Demostrar criterio, proceso o resultado", "Responder dudas frecuentes", "Mostrar personas y contexto cuando ayude a confiar", "Conducir hacia la acción principal"] },
      { heading: "8. Conversión: revisa el camino completo", paragraphs: ["La auditoría no termina en Instagram. Abre el enlace de la bio, prueba WhatsApp, reserva o compra desde un móvil real y comprueba si el siguiente paso conserva la claridad. Un perfil puede estar bien resuelto y perder la oportunidad justo después del clic." ] },
      { heading: "9. Cómo priorizar los cambios", paragraphs: ["No hace falta rehacer el perfil entero en un día. Corrige primero lo que afecta a comprensión y acción: nombre visible, bio, CTA y enlace. Después ordena destacados, define la dirección visual y finalmente construye el sistema de contenido."], bullets: ["AHORA: claridad, bio, CTA y enlace", "DESPUÉS: destacados y señales de confianza", "SIGUIENTE: dirección visual y contenido", "MÁS TARDE: optimizaciones secundarias que no bloquean conversión"] },
    ],
    matchStart: "seo_auditoria_instagram",
  },
  {
    slug: "auditoria-web-que-revisar",
    title: "Auditoría web: qué revisar antes de rediseñar tu página",
    description: "Checklist estratégica de auditoría web para revisar claridad, confianza, experiencia, móvil y conversión antes de invertir en un rediseño.",
    eyebrow: "WEB / AUDITORÍA",
    publishedAt: "2026-10-04",
    readingTime: "8 min",
    keywords: ["auditoría web", "análisis página web", "checklist web", "rediseño web", "experiencia usuario web"],
    intro: [
      "Rediseñar una página sin saber qué problema intenta resolver puede producir una web distinta, pero no necesariamente una web mejor. Una auditoría sirve para separar síntomas visuales de problemas de mensaje, estructura y conversión.",
      "Este es el orden que utilizamos para revisar una web antes de recomendar cambios de mayor alcance.",
    ],
    sections: [
      { heading: "1. Claridad", bullets: ["¿Se entiende el negocio en la primera pantalla?", "¿Se identifica el cliente al que se dirige?", "¿La propuesta utiliza lenguaje que el cliente entiende?", "¿Las páginas tienen un objetivo claro?"] },
      { heading: "2. Jerarquía", paragraphs: ["Una página debería responder preguntas en un orden razonable. Qué es, por qué importa, por qué confiar, cómo funciona y qué hacer después. Cuando toda la información tiene el mismo peso, nada parece prioritario."] },
      { heading: "3. Confianza", bullets: ["Proyectos o ejemplos reales", "Información empresarial verificable", "Proceso comprensible", "Testimonios auténticos cuando existan", "Datos de contacto coherentes"] },
      { heading: "4. Experiencia móvil", paragraphs: ["No basta con que el layout sea responsive. Hay que comprobar lectura, navegación, botones, formularios, imágenes y velocidad percibida en un dispositivo real."] },
      { heading: "5. Conversión", paragraphs: ["Conversión no siempre significa ecommerce. Puede ser una llamada, una reserva, un formulario o una visita física. La web debe conducir con naturalidad hacia la acción que sostiene el negocio."], bullets: ["CTA principal visible", "Formulario proporcional al compromiso", "Menos pasos innecesarios", "Confirmación clara después de la acción"] },
      { heading: "6. Coherencia de marca", paragraphs: ["La web debe sentirse como la misma organización que aparece en redes, presentaciones, propuestas y conversaciones comerciales. La incoherencia no solo es estética: genera dudas sobre madurez y fiabilidad."] },
      { heading: "7. Técnica y descubrimiento", paragraphs: ["Después de validar mensaje y experiencia, revisa indexación, títulos, metadatos, sitemap, rendimiento, accesibilidad y estructura semántica. Una gran página que los buscadores no pueden descubrir tampoco cumple su función."] },
      { heading: "Resultado de una buena auditoría", paragraphs: ["El entregable útil no es una lista de cien incidencias. Es una lista priorizada: qué cambiar ahora, qué cambiar después y qué no merece inversión todavía."] },
    ],
    matchStart: "seo_auditoria_web",
  },
  {
    slug: "branding-para-empresas-cuando-necesitas",
    title: "Branding para empresas: cuándo necesitas algo más que un logo",
    description: "Cómo distinguir entre un problema de logo, identidad visual, posicionamiento o estrategia de marca antes de invertir en un rebranding.",
    eyebrow: "BRAND / ESTRATEGIA",
    publishedAt: "2026-10-04",
    readingTime: "7 min",
    keywords: ["branding para empresas", "estrategia de marca", "identidad visual", "rebranding empresa", "diseño de marca"],
    intro: [
      "Muchas conversaciones sobre branding empiezan con una frase parecida: necesitamos cambiar el logo. A veces es verdad. Otras veces el logo solo está recibiendo la culpa de un problema mucho más amplio.",
      "Antes de rediseñar, conviene identificar en qué capa está realmente la fricción.",
    ],
    sections: [
      { heading: "Logo", paragraphs: ["Es un identificador. Puede necesitar ajustes por legibilidad, aplicaciones, proporciones o evolución visual. Si el negocio sabe perfectamente quién es, cómo compite y cómo comunica, quizá el problema termine aquí."] },
      { heading: "Identidad visual", paragraphs: ["Cuando cada canal utiliza colores, tipografías, fotografías y composiciones diferentes, el problema ya no es solo el logo. Hace falta un sistema que permita reconocer la marca en múltiples contextos."] },
      { heading: "Posicionamiento", paragraphs: ["Si clientes distintos describen la empresa de maneras incompatibles, si compites únicamente en precio o si no queda claro por qué elegirte, cambiar colores no resolverá el problema. Aquí hay que trabajar propuesta, diferenciación y mensaje."] },
      { heading: "Estrategia de marca", paragraphs: ["Cuando la empresa ha crecido, entra en nuevos mercados, cambia de audiencia o reorganiza su oferta, la identidad debe responder a decisiones de negocio. La estrategia define el terreno antes de diseñar el sistema visual."] },
      { heading: "Señales de que la marca se ha quedado atrás", bullets: ["El negocio ha evolucionado pero la percepción no", "El equipo explica la empresa de formas distintas", "La web y ventas prometen cosas diferentes", "La identidad limita nuevos productos o mercados", "Los clientes adecuados no entienden rápidamente el valor"] },
      { heading: "Qué deberías pedir a un proyecto de branding", paragraphs: ["No solo archivos gráficos. Un buen proyecto debe dejar decisiones utilizables: posición, mensaje, principios visuales, aplicaciones y criterios que ayuden a mantener coherencia cuando la empresa siga creciendo."] },
    ],
    matchStart: "seo_branding_empresas",
  },
  {
    slug: "diseno-web-granada-que-debe-incluir",
    title: "Diseño web en Granada: qué debería incluir una web profesional para tu negocio",
    description: "Qué revisar al contratar diseño web en Granada: estrategia, mensaje, móvil, SEO, conversión y mantenimiento para negocios y empresas.",
    eyebrow: "GRANADA / DIGITAL",
    publishedAt: "2026-10-04",
    readingTime: "7 min",
    keywords: ["diseño web Granada", "agencia web Granada", "página web Granada", "branding Granada", "estudio creativo Granada"],
    intro: [
      "Buscar diseño web en Granada no debería reducirse a comparar cuántas páginas incluye cada presupuesto. Dos webs con el mismo número de secciones pueden tener un impacto totalmente distinto si una parte de una estrategia clara y la otra solo organiza contenido.",
      "Estas son las piezas que deberían estar resueltas antes de considerar una web profesional terminada.",
    ],
    sections: [
      { heading: "1. Una propuesta que se entienda", paragraphs: ["El visitante necesita comprender rápidamente qué hace la empresa, para quién trabaja y por qué merece atención. La primera tarea del diseño es hacer esa información legible, no decorarla."] },
      { heading: "2. Estructura orientada al negocio", paragraphs: ["La arquitectura depende del objetivo: captar contactos, reservar, vender, mostrar trabajos o explicar un servicio complejo. Una plantilla genérica rara vez prioriza exactamente lo que necesita cada empresa."] },
      { heading: "3. Diseño coherente con la marca", paragraphs: ["La web no debería ser una pieza aislada. Debe conectar con identidad, fotografía, tono, presentaciones y experiencia comercial. Esa continuidad es una señal de confianza."] },
      { heading: "4. Experiencia móvil", paragraphs: ["Gran parte del tráfico local llega desde móvil, especialmente cuando el usuario descubre el negocio desde Maps, redes o una recomendación. La experiencia móvil debe diseñarse, no simplemente comprimirse."] },
      { heading: "5. SEO técnico y contenido indexable", bullets: ["Títulos y descripciones útiles", "URLs claras", "Sitemap", "Contenido semántico", "Rendimiento", "Datos estructurados cuando aportan contexto"] },
      { heading: "6. Conversión", paragraphs: ["Toda web profesional necesita un siguiente paso claro: contacto, reserva, compra o solicitud. El diseño debe reducir fricción y hacer evidente esa acción sin convertir la experiencia en una sucesión de banners comerciales."] },
      { heading: "7. Medición y evolución", paragraphs: ["Una web no termina el día que se publica. Analítica, consultas reales y comportamiento del usuario permiten detectar qué páginas funcionan, qué preguntas aparecen y dónde merece la pena invertir después."] },
      { heading: "Trabajar con un estudio local o remoto", paragraphs: ["La ubicación no sustituye el criterio. Un estudio en Granada puede aportar cercanía cuando es útil, pero el factor decisivo debería ser su capacidad para conectar negocio, marca y experiencia digital dentro de una misma dirección."] },
    ],
    matchStart: "seo_diseno_web_granada",
  },
];

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}
