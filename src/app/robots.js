export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login", "/api/"],
    },
    sitemap: "https://www.dailysattakings.com/sitemap.xml",
    host: "https://www.dailysattakings.com",
  };
}
