import { compareByOrderThenTitle } from "./lib/route-utils.mjs";

function uniqueSlugs(slugs) {
  return [...new Set(slugs)];
}

function resolveSameLevelTargets(article, articles, reserved) {
  const sameSection = articles
    .filter((candidate) => candidate.section === article.section && candidate.slug !== article.slug)
    .sort((a, b) => {
      const delta = Math.abs(a.order - article.order) - Math.abs(b.order - article.order);
      return delta !== 0 ? delta : compareByOrderThenTitle(a, b);
    });

  const selected = [];
  for (const candidate of sameSection) {
    if (!reserved.has(candidate.slug)) {
      selected.push(candidate.slug);
      reserved.add(candidate.slug);
    }
    if (selected.length === 2) {
      return selected;
    }
  }

  // Fallback: if a section has too few siblings, fill from nearby global articles.
  const fallback = articles
    .filter((candidate) => candidate.slug !== article.slug)
    .sort((a, b) => {
      const delta = Math.abs(a.order - article.order) - Math.abs(b.order - article.order);
      return delta !== 0 ? delta : compareByOrderThenTitle(a, b);
    });
  for (const candidate of fallback) {
    if (!reserved.has(candidate.slug)) {
      selected.push(candidate.slug);
      reserved.add(candidate.slug);
    }
    if (selected.length === 2) {
      return selected;
    }
  }
  throw new Error(`Unable to assign 2 same-level links for "${article.slug}".`);
}

function assertSlugExists(slug, slugToArticle, reason, sourceSlug) {
  if (!slugToArticle.has(slug)) {
    throw new Error(`Link target "${slug}" (${reason}) in "${sourceSlug}" does not exist.`);
  }
}

export function generateInternalLinks(articles) {
  const slugToArticle = new Map(articles.map((article) => [article.slug, article]));
  const result = new Map();

  for (const article of articles) {
    const prerequisites = uniqueSlugs(article.links.prerequisitesCandidates)
      .filter((slug) => slug !== article.slug)
      .slice(0, 2);
    if (prerequisites.length < 2) {
      throw new Error(`"${article.slug}" must define at least 2 prerequisites.`);
    }

    const nextStep = article.links.nextStep;
    const mistakeSlug = article.links.mistakes;
    assertSlugExists(nextStep, slugToArticle, "nextStep", article.slug);
    assertSlugExists(mistakeSlug, slugToArticle, "mistakes", article.slug);

    const reserved = new Set([...prerequisites, nextStep, mistakeSlug]);
    const sameLevel = resolveSameLevelTargets(article, articles, reserved);

    const links = [
      ...prerequisites.map((slug) => ({ kind: "前提", slug })),
      ...sameLevel.map((slug) => ({ kind: "同階層", slug })),
      { kind: "次ステップ", slug: nextStep },
      { kind: "ミス集", slug: mistakeSlug }
    ];

    if (links.length !== 6) {
      throw new Error(`"${article.slug}" must have exactly 6 internal links.`);
    }
    const uniqueCount = new Set(links.map((link) => link.slug)).size;
    if (uniqueCount !== 6) {
      throw new Error(`"${article.slug}" internal links contain duplicates.`);
    }
    if (links.some((link) => link.slug === article.slug)) {
      throw new Error(`"${article.slug}" cannot link to itself.`);
    }
    for (const link of links) {
      assertSlugExists(link.slug, slugToArticle, link.kind, article.slug);
    }

    result.set(article.slug, links);
  }

  return result;
}

export function assertNoBrokenInternalLinks(articles, internalLinksBySlug) {
  const routes = new Set(articles.map((article) => article.route));
  for (const article of articles) {
    const links = internalLinksBySlug.get(article.slug) ?? [];
    for (const link of links) {
      const target = articles.find((candidate) => candidate.slug === link.slug);
      if (!target || !routes.has(target.route)) {
        throw new Error(`Broken route from "${article.slug}" to "${link.slug}".`);
      }
    }
  }
}

