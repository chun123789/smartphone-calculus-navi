import path from "node:path";

export const SITE_URL = "https://example.com";
export const SITE_NAME = "スマホで微積ナビ";

export const SECTION_LABELS = {
  basics: "微積の準備",
  differentiation: "微分",
  integration: "積分",
  fundamental: "微積の基本定理",
  mistakes: "ミス集"
};

export function normalizeRoute(route) {
  if (!route || route === "/") {
    return "/";
  }
  const clean = `/${route.replace(/^\/+|\/+$/g, "")}/`;
  return clean.replace(/\/{2,}/g, "/");
}

export function articleRoute(article) {
  return normalizeRoute(`/calculus/${article.section}/${article.slug}/`);
}

export function sectionRoute(section) {
  return normalizeRoute(`/calculus/${section}/`);
}

export function routeToOutputPath(siteDir, route) {
  const clean = route === "/" ? "" : route.replace(/^\/+|\/+$/g, "");
  return clean.length === 0
    ? path.join(siteDir, "index.html")
    : path.join(siteDir, clean, "index.html");
}

export function absoluteUrl(route, siteUrl = SITE_URL) {
  const normalized = normalizeRoute(route);
  return normalized === "/" ? siteUrl : `${siteUrl}${normalized.slice(0, -1)}`;
}

export function compareByOrderThenTitle(a, b) {
  if (a.order !== b.order) {
    return a.order - b.order;
  }
  return a.title.localeCompare(b.title, "ja");
}

