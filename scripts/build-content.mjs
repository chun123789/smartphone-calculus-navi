import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdownFile } from "./markdown-to-html.mjs";
import { validateArticleFrontmatter } from "./lib/article-schema.mjs";
import {
  SITE_NAME,
  SITE_URL,
  SECTION_LABELS,
  articleRoute,
  sectionRoute,
  routeToOutputPath,
  compareByOrderThenTitle
} from "./lib/route-utils.mjs";
import { loadTemplate, fillTemplate } from "./lib/template-loader.mjs";
import { buildSeoTags } from "./lib/seo-utils.mjs";
import { generateInternalLinks, assertNoBrokenInternalLinks } from "./check-internal-links.mjs";
import { writeSitemap } from "./generate-sitemap.mjs";
import { renderHeader } from "../src/components/header.mjs";
import { renderFooter } from "../src/components/footer.mjs";
import { renderBreadcrumb } from "../src/components/breadcrumb.mjs";
import { renderAdSlot } from "../src/components/ad-slot.mjs";
import { renderArticleLinks } from "../src/components/article-links.mjs";
import { renderInteractiveContainer } from "../src/components/interactive-container.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "src", "articles");
const SITE_DIR = path.join(ROOT, ".site");
const PUBLIC_SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");

const SECTION_DESCRIPTIONS = {
  basics: "グラフと極限を短時間で確認し、微積へスムーズに入るための基礎です。",
  differentiation: "割線から接線へ。変化率と導関数をグラフで理解します。",
  integration: "リーマン和から定積分へ。面積と合計の考え方を整理します。",
  fundamental: "微分と積分がどうつながるか、微積の基本定理で確認します。",
  mistakes: "つまずきやすい典型ミスを先回りで対策します。"
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function difficultyLabel(order) {
  if (order < 20) {
    return "基礎";
  }
  if (order < 40) {
    return "標準";
  }
  return "発展";
}

function estimateMinutes(markdownText) {
  const words = markdownText
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
}

async function collectMarkdownFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function prepareSiteWorkspace() {
  await fs.rm(SITE_DIR, { recursive: true, force: true });
  await fs.mkdir(SITE_DIR, { recursive: true });
  await fs.mkdir(path.join(SITE_DIR, "assets"), { recursive: true });
  await fs.cp(path.join(ROOT, "src", "js"), path.join(SITE_DIR, "assets", "js"), { recursive: true });
  await fs.cp(path.join(ROOT, "src", "styles"), path.join(SITE_DIR, "assets", "styles"), { recursive: true });
}

function renderArticleCard(article) {
  return `
<article class="learn-card">
  <h3>${escapeHtml(article.title)}</h3>
  <p>${escapeHtml(article.description)}</p>
  <p class="card-meta">難易度: ${difficultyLabel(article.order)} / 目安: ${article.minutes}分</p>
  <a class="card-link" href="${article.route}">読む</a>
</article>`.trim();
}

function renderTagList(tags) {
  return tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("");
}

function renderUpdates(updates) {
  return updates
    .map((item) => `<li>${escapeHtml(item.date)}: ${escapeHtml(item.note)}</li>`)
    .join("");
}

function buildMailtoHref() {
  const subject = encodeURIComponent("[スマホで微積ナビ] 誤り報告");
  const body = encodeURIComponent(
    "報告ページURL:\n内容:\n期待する正しい説明:\n再現手順(あれば):\n端末/ブラウザ:\n"
  );
  return `mailto:owner@example.com?subject=${subject}&body=${body}`;
}

async function writePage({
  templates,
  route,
  bodyClass,
  currentRoute,
  pageTemplate,
  pageValues,
  pageScript,
  seo
}) {
  const pageBody = fillTemplate(templates[pageTemplate], pageValues);
  const breadcrumbHtml = pageValues.breadcrumb_html ?? "";
  const html = fillTemplate(templates.layout, {
    body_class: bodyClass,
    head_tags: seo,
    header: renderHeader(currentRoute),
    breadcrumb: breadcrumbHtml,
    main: pageBody,
    footer: renderFooter(),
    page_script: pageScript
  });
  const outputPath = routeToOutputPath(SITE_DIR, route);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, "utf8");
}

function sectionTitleForHome(section) {
  return SECTION_LABELS[section] ?? section;
}

async function build() {
  await prepareSiteWorkspace();
  const markdownFiles = await collectMarkdownFiles(ARTICLES_DIR);
  const articles = [];
  for (const filePath of markdownFiles) {
    const parsed = await parseMarkdownFile(filePath, validateArticleFrontmatter);
    const article = {
      ...parsed.frontmatter,
      bodyHtml: parsed.html,
      markdownBody: parsed.content,
      route: articleRoute(parsed.frontmatter),
      sectionLabel: SECTION_LABELS[parsed.frontmatter.section] ?? parsed.frontmatter.section,
      minutes: estimateMinutes(parsed.content)
    };
    articles.push(article);
  }

  articles.sort(compareByOrderThenTitle);
  const slugToArticle = new Map(articles.map((article) => [article.slug, article]));

  const internalLinksBySlug = generateInternalLinks(articles);
  for (const article of articles) {
    const links = internalLinksBySlug.get(article.slug) ?? [];
    article.relatedLinks = links.map((link) => {
      const target = slugToArticle.get(link.slug);
      return {
        kind: link.kind,
        slug: link.slug,
        title: target.title,
        route: target.route
      };
    });
  }
  assertNoBrokenInternalLinks(articles, internalLinksBySlug);

  const templates = {
    layout: await loadTemplate("layout.html"),
    home: await loadTemplate("home.html"),
    section: await loadTemplate("section.html"),
    article: await loadTemplate("article.html"),
    changelog: await loadTemplate("changelog.html"),
    report: await loadTemplate("report.html")
  };

  const routesForSitemap = new Set(["/", "/changelog/", "/report/"]);

  const roadmapSlugs = [
    "limits-intro",
    "secant-to-tangent",
    "riemann-sum-area",
    "ftc-basic",
    "common-calculus-mistakes"
  ];
  const roadmapCards = roadmapSlugs
    .map((slug) => slugToArticle.get(slug))
    .filter(Boolean)
    .map((article) => {
      return `
<article class="learn-card">
  <h3>${escapeHtml(article.title)}</h3>
  <p class="card-meta">${escapeHtml(sectionTitleForHome(article.section))} / ${article.minutes}分</p>
  <a class="card-link" href="${article.route}">この順で読む</a>
</article>`;
    })
    .join("");

  const firstThreeCards = ["limits-intro", "secant-to-tangent", "riemann-sum-area"]
    .map((slug) => slugToArticle.get(slug))
    .filter(Boolean)
    .map((article) => renderArticleCard(article))
    .join("");

  const recentUpdates = articles
    .flatMap((article) =>
      article.updates.map((item) => ({
        ...item,
        articleTitle: article.title,
        articleRoute: article.route
      }))
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8)
    .map(
      (item) =>
        `<li><a href="${item.articleRoute}">${escapeHtml(item.articleTitle)}</a> - ${escapeHtml(item.date)} ${escapeHtml(item.note)}</li>`
    )
    .join("");

  await writePage({
    templates,
    route: "/",
    bodyClass: "page-home",
    currentRoute: "/",
    pageTemplate: "home",
    pageValues: {
      roadmap_cards: roadmapCards,
      first_three_cards: firstThreeCards,
      recent_updates: recentUpdates,
      breadcrumb_html: ""
    },
    pageScript: '<script type="module" src="/assets/js/page-home.js"></script>',
    seo: buildSeoTags({
      title: SITE_NAME,
      description: "高校生向けのスマホ中心・微積インタラクティブ学習サイト。",
      route: "/",
      siteUrl: SITE_URL,
      type: "website",
      crumbs: [{ name: "ホーム", route: "/" }]
    })
  });

  const sectionGroups = new Map();
  for (const article of articles) {
    if (!sectionGroups.has(article.section)) {
      sectionGroups.set(article.section, []);
    }
    sectionGroups.get(article.section).push(article);
  }

  for (const [section, sectionArticlesRaw] of sectionGroups.entries()) {
    const sectionArticles = [...sectionArticlesRaw].sort(compareByOrderThenTitle);
    const route = sectionRoute(section);
    routesForSitemap.add(route);
    const cards = sectionArticles.map((article) => renderArticleCard(article)).join("");
    const crumbs = [
      { name: "ホーム", route: "/" },
      { name: SECTION_LABELS[section] ?? section, route }
    ];
    await writePage({
      templates,
      route,
      bodyClass: "page-section",
      currentRoute: route,
      pageTemplate: "section",
      pageValues: {
        section_title: escapeHtml(SECTION_LABELS[section] ?? section),
        section_description: escapeHtml(SECTION_DESCRIPTIONS[section] ?? ""),
        section_cards: cards,
        breadcrumb_html: renderBreadcrumb(crumbs)
      },
      pageScript: '<script type="module" src="/assets/js/page-section.js"></script>',
      seo: buildSeoTags({
        title: `${SECTION_LABELS[section] ?? section}セクション`,
        description: SECTION_DESCRIPTIONS[section] ?? "",
        route,
        siteUrl: SITE_URL,
        type: "website",
        crumbs
      })
    });
  }

  for (const article of articles) {
    routesForSitemap.add(article.route);
    const crumbs = [
      { name: "ホーム", route: "/" },
      { name: article.sectionLabel, route: sectionRoute(article.section) },
      { name: article.title, route: article.route }
    ];
    const content = fillTemplate(templates.article, {
      article_title: escapeHtml(article.title),
      article_description: escapeHtml(article.description),
      article_tags: renderTagList(article.tags),
      conclusion_text: escapeHtml(article.conclusion || article.description),
      interactive_html: renderInteractiveContainer(article.interactive),
      ad_top: renderAdSlot({ slotId: `${article.slug}-top`, position: "top" }),
      article_body: article.bodyHtml,
      example_text: escapeHtml(
        article.example || "本文を読んだ後、式を見ずに自分でグラフと式の対応を説明してみましょう。"
      ),
      common_mistake_text: escapeHtml(
        article.commonMistake || "記号だけ追ってしまうと意味を見失います。グラフと単位をセットで確認してください。"
      ),
      related_links_html: renderArticleLinks(article.relatedLinks),
      ad_bottom: renderAdSlot({ slotId: `${article.slug}-bottom`, position: "bottom" }),
      update_items: renderUpdates(article.updates)
    });

    await writePage({
      templates,
      route: article.route,
      bodyClass: "page-article",
      currentRoute: article.route,
      pageTemplate: "article",
      pageValues: {
        article_title: escapeHtml(article.title),
        article_description: escapeHtml(article.description),
        article_tags: renderTagList(article.tags),
        conclusion_text: escapeHtml(article.conclusion || article.description),
        interactive_html: renderInteractiveContainer(article.interactive),
        ad_top: renderAdSlot({ slotId: `${article.slug}-top`, position: "top" }),
        article_body: article.bodyHtml,
        example_text: escapeHtml(
          article.example || "本文を読んだ後、式を見ずに自分でグラフと式の対応を説明してみましょう。"
        ),
        common_mistake_text: escapeHtml(
          article.commonMistake || "記号だけ追ってしまうと意味を見失います。グラフと単位をセットで確認してください。"
        ),
        related_links_html: renderArticleLinks(article.relatedLinks),
        ad_bottom: renderAdSlot({ slotId: `${article.slug}-bottom`, position: "bottom" }),
        update_items: renderUpdates(article.updates),
        breadcrumb_html: renderBreadcrumb(crumbs)
      },
      pageScript: '<script type="module" src="/assets/js/page-article.js"></script>',
      seo: buildSeoTags({
        title: article.title,
        description: article.description,
        route: article.route,
        siteUrl: SITE_URL,
        type: "article",
        crumbs
      })
    });

    if (!content.includes("interactive-block")) {
      throw new Error(`Article template render failed for ${article.slug}`);
    }
  }

  const changelogItems = articles
    .flatMap((article) =>
      article.updates.map((entry) => ({
        date: entry.date,
        note: entry.note,
        title: article.title,
        route: article.route
      }))
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (entry) =>
        `<li><strong>${escapeHtml(entry.date)}</strong> <a href="${entry.route}">${escapeHtml(entry.title)}</a> - ${escapeHtml(entry.note)}</li>`
    )
    .join("");

  const changelogCrumbs = [
    { name: "ホーム", route: "/" },
    { name: "更新ログ", route: "/changelog/" }
  ];
  await writePage({
    templates,
    route: "/changelog/",
    bodyClass: "page-changelog",
    currentRoute: "/changelog/",
    pageTemplate: "changelog",
    pageValues: {
      changelog_items: changelogItems,
      breadcrumb_html: renderBreadcrumb(changelogCrumbs)
    },
    pageScript: "",
    seo: buildSeoTags({
      title: "更新ログ",
      description: "記事の訂正・改善履歴",
      route: "/changelog/",
      siteUrl: SITE_URL,
      type: "website",
      crumbs: changelogCrumbs
    })
  });

  const reportCrumbs = [
    { name: "ホーム", route: "/" },
    { name: "誤り報告", route: "/report/" }
  ];
  await writePage({
    templates,
    route: "/report/",
    bodyClass: "page-report",
    currentRoute: "/report/",
    pageTemplate: "report",
    pageValues: {
      mailto_href: buildMailtoHref(),
      breadcrumb_html: renderBreadcrumb(reportCrumbs)
    },
    pageScript: "",
    seo: buildSeoTags({
      title: "誤り報告フォーム",
      description: "式や説明の誤りを報告できます。",
      route: "/report/",
      siteUrl: SITE_URL,
      type: "website",
      crumbs: reportCrumbs
    })
  });

  await writeSitemap([...routesForSitemap], PUBLIC_SITEMAP_PATH, SITE_URL);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

