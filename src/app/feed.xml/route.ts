import { insights } from "@/data/insights";

const baseUrl = "https://www.kyruma.com";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = insights
    .map((insight) => {
      const url = `${baseUrl}/insights/${insight.slug}`;
      return `
        <item>
          <title>${escapeXml(insight.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(insight.description)}</description>
          <pubDate>${new Date(`${insight.publishedAt}T12:00:00Z`).toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>KYRUMA Insights</title>
    <link>${baseUrl}/insights</link>
    <description>Ideas prácticas sobre estrategia de marca, diseño web, Instagram y experiencia digital para empresas y negocios.</description>
    <language>es-ES</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
