import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, normalizeRoute } from "./lib/route-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DEFAULT_SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");

export function renderSitemapXml(routes, siteUrl = SITE_URL, lastmod = "2026-02-28") {
  const uniqueRoutes = [...new Set(routes.map((route) => normalizeRoute(route)))];
  const urlEntries = uniqueRoutes
    .map((route) => {
      const loc = route === "/" ? siteUrl : `${siteUrl}${route.slice(0, -1)}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

export async function writeSitemap(routes, outputPath = DEFAULT_SITEMAP_PATH, siteUrl = SITE_URL) {
  const xml = renderSitemapXml(routes, siteUrl);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, xml, "utf8");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const defaultRoutes = ["/", "/calculus/differentiation/", "/calculus/integration/", "/changelog/", "/report/"];
  await writeSitemap(defaultRoutes);
}

