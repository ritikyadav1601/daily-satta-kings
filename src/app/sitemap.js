import { GAMES } from "@/utils/gameConfig";

const BASE_URL = "https://www.dailysattakings.com";

export default function sitemap() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const staticPages = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/chart", changeFrequency: "daily", priority: 0.9 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/payment-proofs", changeFrequency: "weekly", priority: 0.5 },
  ];

  const yearlyCharts = GAMES.flatMap((game) =>
    [currentYear - 1, currentYear].map((year) => ({
      url: `${BASE_URL}/${game.key.replaceAll("_", "-")}-yearly-chart-${year}`,
      lastModified: now,
      changeFrequency: year === currentYear ? "daily" : "yearly",
      priority: year === currentYear ? 0.8 : 0.6,
    }))
  );

  return [
    ...staticPages.map((page) => ({
      url: `${BASE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...yearlyCharts,
  ];
}
