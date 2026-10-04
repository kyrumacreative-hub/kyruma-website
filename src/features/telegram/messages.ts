import { MatchProblem, MatchRecommendation } from "./recommendation";

export type InlineButton = { text: string; callback_data?: string; url?: string };
export type BotReply = { text: string; keyboard?: InlineButton[][] };

export const mainMenu: BotReply = {
  text: "<b>KYRUMA MATCH™</b>\n\nCuéntanos qué necesitas ordenar. Te haremos unas preguntas breves y te recomendaremos el siguiente paso adecuado.\n\nNo necesitas compartir contraseñas ni información sensible.",
  keyboard: [
    [{ text: "Instagram", callback_data: "problem:instagram" }, { text: "Web", callback_data: "problem:website" }],
    [{ text: "Contenido", callback_data: "problem:content" }, { text: "Marca / logo", callback_data: "problem:brand" }],
    [{ text: "Varias cosas", callback_data: "problem:multiple" }],
  ],
};

const labels: Record<MatchProblem, string> = { instagram: "Instagram", website: "tu web", content: "tu contenido", brand: "tu identidad", multiple: "varias áreas" };

export function scopeQuestion(problem: MatchProblem): BotReply {
  return { text: `<b>Entendido: ${labels[problem]}.</b>\n\n¿Es un problema concreto que quieres resolver ahora o sientes que forma parte de algo más estructural?`, keyboard: [[{ text: "Es algo concreto", callback_data: `scope:${problem}:focused` }], [{ text: "Es algo más profundo", callback_data: `scope:${problem}:structural` }], [{ text: "Empezar de nuevo", callback_data: "restart" }]] };
}

export function recommendationReply(result: MatchRecommendation): BotReply {
  const availability = result.available ? "" : "\n\n<i>Esta solución aún no está disponible como compra inmediata.</i>";
  return { text: `<b>YOUR KYRUMA MATCH</b>\n\n<b>${result.code} · ${result.name}</b>\n\n${result.reason}${availability}`, keyboard: [[{ text: result.code === "DISCOVERY" || !result.available ? "Hablar con KYRUMA" : "Ver Instagram Reset · 29 €", url: result.url }], [{ text: "Seguir diagnóstico", callback_data: "restart" }]] };
}

export const solutionsReply: BotReply = { text: "<b>KYRUMA EXPRESS™</b>\n\nDisponible ahora:\n\n<b>KX-001 · Instagram Reset · 29 €</b>\nBio, CTA, SEO, destacados, dirección visual y tres ideas de contenido. Entrega máxima en 48 horas laborables desde el brief.", keyboard: [[{ text: "Ver KX-001", url: "https://www.kyruma.com/express/instagram-reset?utm_source=telegram&utm_medium=bot&utm_campaign=kyruma_match" }], [{ text: "Diagnosticar mi caso", callback_data: "restart" }]] };
export const supportReply: BotReply = { text: "<b>Soporte KYRUMA</b>\n\nEscríbenos a hello@kyruma.com indicando tu número de pedido si ya has comprado. Nunca te pediremos contraseñas, códigos 2FA ni acceso a tu cuenta.", keyboard: [[{ text: "Abrir KYRUMA", url: "https://www.kyruma.com" }]] };
export const privacyReply: BotReply = { text: "<b>Privacidad</b>\n\nKYRUMA MATCH utiliza únicamente los datos mínimos necesarios para responder a tu diagnóstico. No compartas credenciales ni información sensible. Comprar o conversar con KYRUMA no implica aceptar comunicaciones comerciales.", keyboard: [[{ text: "Política de privacidad", url: "https://www.kyruma.com/privacy" }]] };
export const errorReply: BotReply = { text: "No hemos podido continuar desde ese punto.", keyboard: [[{ text: "Empezar de nuevo", callback_data: "restart" }]] };
