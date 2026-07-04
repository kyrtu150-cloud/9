import type { MetadataRoute } from "next";

const BASE = process.env.NEXTAUTH_URL || "https://jooz.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/auth/register`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/auth/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/legal/offer`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/legal/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/legal/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
