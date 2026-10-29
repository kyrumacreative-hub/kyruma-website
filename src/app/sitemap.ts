import type { MetadataRoute } from "next";
import { workCases } from "@/data/work";
import { authorityInsights } from "@/data/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.kyruma.com";

  return [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/strategy`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...["brand-strategy", "visual-identity", "web-experience"].map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    {
      url: `${baseUrl}/granada`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signal`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...authorityInsights.map((insight) => ({
      url: `${baseUrl}/insights/${insight.slug}`,
      lastModified: new Date(insight.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/trabajos`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...workCases.map((workCase) => ({
      url: `${baseUrl}/trabajos/${workCase.slug}`,
      lastModified: new Date(workCase.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/legal`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/cookies`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
