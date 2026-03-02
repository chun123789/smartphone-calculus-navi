import { SITE_NAME, absoluteUrl } from "./route-utils.mjs";

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildBreadcrumbJsonLd(crumbs, siteUrl) {
  const itemListElement = crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.route, siteUrl)
  }));
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function buildArticleJsonLd({
  title,
  description,
  route,
  siteUrl,
  publishedDate,
  modifiedDate
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedDate,
    dateModified: modifiedDate ?? publishedDate,
    mainEntityOfPage: absoluteUrl(route, siteUrl),
    inLanguage: "ja-JP"
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function buildSeoTags({
  title,
  description,
  route,
  siteUrl,
  imagePath = "/icons/icon-512.png",
  type = "article",
  crumbs = [],
  article = null
}) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = absoluteUrl(route, siteUrl);
  const ogImage = `${siteUrl}${imagePath}`;
  const breadcrumbScript = crumbs.length > 0 ? buildBreadcrumbJsonLd(crumbs, siteUrl) : "";
  const articleScript =
    article && type === "article"
      ? buildArticleJsonLd({
          title,
          description,
          route,
          siteUrl,
          publishedDate: article.publishedDate,
          modifiedDate: article.modifiedDate
        })
      : "";
  return `
<title>${escapeText(fullTitle)}</title>
<meta name="description" content="${escapeAttribute(description)}">
<link rel="canonical" href="${escapeAttribute(canonical)}">
<meta property="og:site_name" content="${escapeAttribute(SITE_NAME)}">
<meta property="og:type" content="${escapeAttribute(type)}">
<meta property="og:title" content="${escapeAttribute(fullTitle)}">
<meta property="og:description" content="${escapeAttribute(description)}">
<meta property="og:url" content="${escapeAttribute(canonical)}">
<meta property="og:image" content="${escapeAttribute(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttribute(fullTitle)}">
<meta name="twitter:description" content="${escapeAttribute(description)}">
${breadcrumbScript}
${articleScript}`.trim();
}
