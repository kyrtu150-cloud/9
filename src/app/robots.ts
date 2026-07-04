import type { MetadataRoute } from "next";

const BASE = process.env.NEXTAUTH_URL || "https://jooz.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
