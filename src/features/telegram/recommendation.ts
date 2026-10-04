export type MatchProblem = "instagram" | "website" | "content" | "brand" | "multiple";
export type MatchScope = "focused" | "structural";

export type MatchRecommendation = {
  code: "KX-001" | "KX-002" | "KX-003" | "KX-004" | "KX-005" | "DISCOVERY";
  name: string;
  reason: string;
  available: boolean;
  url: string;
};

const products: Record<MatchProblem, Omit<MatchRecommendation, "reason">> = {
  instagram: { code: "KX-001", name: "Instagram Reset", available: true, url: "https://www.kyruma.com/express/instagram-reset?utm_source=telegram&utm_medium=bot&utm_campaign=kyruma_match" },
  website: { code: "KX-002", name: "Website Check", available: false, url: "https://www.kyruma.com/#contact" },
  content: { code: "KX-003", name: "Content Emergency Kit", available: false, url: "https://www.kyruma.com/#contact" },
  brand: { code: "KX-004", name: "Logo Rescue", available: false, url: "https://www.kyruma.com/#contact" },
  multiple: { code: "KX-005", name: "Business Reset", available: false, url: "https://www.kyruma.com/#contact" },
};

export function recommend(problem: MatchProblem, scope: MatchScope): MatchRecommendation {
  if (scope === "structural") return { code: "DISCOVERY", name: "KYRUMA Discovery™", reason: "Lo que describes afecta a más de una pieza del negocio. Una solución pequeña podría quedarse corta.", available: true, url: "https://www.kyruma.com/workspace?utm_source=telegram&utm_medium=bot&utm_campaign=kyruma_match" };
  const product = products[problem];
  return { ...product, reason: product.available ? "Es una intervención concreta, con alcance y precio cerrados, adecuada para resolver este punto sin abrir un proyecto largo." : "La solución específica todavía no está publicada. Te dirigimos a KYRUMA para recomendarte el siguiente paso sin venderte algo inadecuado." };
}

export function parseMatchProblem(value: string): MatchProblem | null {
  return ["instagram", "website", "content", "brand", "multiple"].includes(value) ? value as MatchProblem : null;
}

export function parseMatchScope(value: string): MatchScope | null {
  return value === "focused" || value === "structural" ? value : null;
}
