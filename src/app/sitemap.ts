import type { MetadataRoute } from "next";

const BASE = "https://josens83-kanjivision-main.vercel.app";

const STATIC_PAGES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/learn", changeFrequency: "daily" as const, priority: 0.9 },
  { path: "/quiz", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/packages", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/vocabulary", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/announcements", changeFrequency: "weekly" as const, priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/signin", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/signup", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/legal/terms", changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/legal/privacy", changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/legal/refund-policy", changeFrequency: "yearly" as const, priority: 0.2 },
];

const LEVELS = ["JLPT_N5", "JLPT_N4", "JLPT_N3", "JLPT_N2", "JLPT_N1"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const levelEntries: MetadataRoute.Sitemap = LEVELS.map((lv) => ({
    url: `${BASE}/vocabulary/${lv}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  let packageEntries: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/packages`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      packageEntries = (data.packages ?? []).map((p: { slug: string }) => ({
        url: `${BASE}/packages/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch { /* sitemap still works without packages */ }

  return [...staticEntries, ...levelEntries, ...packageEntries];
}
