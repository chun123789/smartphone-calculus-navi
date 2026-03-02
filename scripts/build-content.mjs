import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdownFile } from "./markdown-to-html.mjs";
import { validateArticleFrontmatter } from "./lib/article-schema.mjs";
import {
  SITE_NAME,
  SITE_URL,
  SECTION_LABELS,
  TRACK_LABELS,
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
import { validateArticlePlan } from "./content/validate-plan.mjs";
import { generateArticlesFromPlan } from "./content/generate-articles.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "src", "articles");
const SITE_DIR = path.join(ROOT, ".site");
const PUBLIC_SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const KPI_OUTPUT_PATH = path.join(ROOT, "public", "kpi-content.json");

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

function difficultyLabel(level) {
  return level;
}

function estimateMinutes(markdownText, fallbackMinutes) {
  const words = markdownText
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
  const fromWords = Math.max(3, Math.round(words / 220));
  return Math.max(fromWords, Number(fallbackMinutes || 0));
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

function renderTrackChip(article) {
  return `<span class="track-chip">${escapeHtml(TRACK_LABELS[article.track] ?? article.track)} / ${escapeHtml(article.level)}</span>`;
}

function renderArticleCard(article) {
  return `
<article class="learn-card" data-track="${article.track}" data-intent="${article.intent}">
  ${renderTrackChip(article)}
  <h3>${escapeHtml(article.title)}</h3>
  <p>${escapeHtml(article.description)}</p>
  <p class="card-meta">難易度: ${difficultyLabel(article.level)} / 目安: ${article.minutes}分</p>
  <a class="card-link" href="${article.route}" data-track="${article.track}" data-intent="${article.intent}" data-cta-kind="card-read">読む</a>
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

function buildMisconceptionBlock(article) {
  return `
<section class="content-section misconception-block">
  <h2>誤概念チェック</h2>
  <p>${escapeHtml(article.misconceptionPattern)}</p>
  <p class="small-note">先に誤答パターンを知っておくと、計算ミスが減ります。</p>
</section>`.trim();
}

function buildQuickReviewBlock(article) {
  return `
<section class="content-section quick-review">
  <h2>10分復習ポイント</h2>
  <ul class="plain-list">
    <li>${escapeHtml(article.title)} を30秒で言葉にできる</li>
    <li>グラフ上で「何が変化しているか」を説明できる</li>
    <li>最後に符号・範囲・単位をチェックできる</li>
  </ul>
</section>`.trim();
}

function buildExamCta(article) {
  const href = article.track === "exam" ? article.route : "/exam/";
  const label = article.track === "exam" ? "この共通テスト記事を繰り返す" : "共通テスト導線へ進む";
  return `
<section class="exam-cta" data-track="${article.track}" data-intent="${article.intent}">
  <h2>次の演習</h2>
  <p>誘導文で迷わないために、共通テスト導線で同テーマを1問解きましょう。</p>
  <a class="button-primary" href="${href}" data-track="exam" data-intent="exam" data-cta-kind="exam-cta">${label}</a>
</section>`.trim();
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

async function writeKpiContent(articles) {
  const byTrack = {};
  const bySection = {};
  const byPriority = {};
  let interactiveCount = 0;
  let totalMinutes = 0;

  for (const article of articles) {
    byTrack[article.track] = (byTrack[article.track] ?? 0) + 1;
    bySection[article.section] = (bySection[article.section] ?? 0) + 1;
    byPriority[article.priority] = (byPriority[article.priority] ?? 0) + 1;
    if (article.interactive) {
      interactiveCount += 1;
    }
    totalMinutes += article.minutes;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      articles: articles.length,
      interactive: interactiveCount,
      examTrack: byTrack.exam ?? 0,
      regularTrack: byTrack.regular ?? 0,
      avgMinutes: Number((totalMinutes / Math.max(articles.length, 1)).toFixed(2))
    },
    byTrack,
    bySection,
    byPriority,
    notes: [
      "週次で Search Console の CTR と掲載順位を記録する",
      "Cloudflare Web Analytics で PV と回遊率の変化を確認する"
    ]
  };

  await fs.writeFile(KPI_OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function build() {
  const planRows = await validateArticlePlan();
  await generateArticlesFromPlan();
  await prepareSiteWorkspace();

  const planSlugs = new Set(planRows.map((row) => row.slug));
  const markdownFiles = await collectMarkdownFiles(ARTICLES_DIR);
  const articles = [];

  for (const filePath of markdownFiles) {
    const parsed = await parseMarkdownFile(filePath, validateArticleFrontmatter);
    if (!planSlugs.has(parsed.frontmatter.slug)) {
      continue;
    }
    const article = {
      ...parsed.frontmatter,
      bodyHtml: parsed.html,
      markdownBody: parsed.content,
      route: articleRoute(parsed.frontmatter),
      sectionLabel: SECTION_LABELS[parsed.frontmatter.section] ?? parsed.frontmatter.section,
      trackLabel: TRACK_LABELS[parsed.frontmatter.track] ?? parsed.frontmatter.track,
      minutes: estimateMinutes(parsed.content, parsed.frontmatter.estimatedMinutes)
    };
    articles.push(article);
  }

  articles.sort(compareByOrderThenTitle);
  if (articles.length !== planRows.length) {
    throw new Error(`Plan rows (${planRows.length}) and generated articles (${articles.length}) are inconsistent.`);
  }

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
        route: target.route,
        track: target.track,
        intent: target.intent
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
    report: await loadTemplate("report.html"),
    exam: await loadTemplate("exam.html")
  };

  const routesForSitemap = new Set(["/", "/exam/", "/changelog/", "/report/"]);

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
    .map((article) => renderArticleCard(article))
    .join("");

  const firstThreeCards = ["limits-intro", "secant-to-tangent", "riemann-sum-area"]
    .map((slug) => slugToArticle.get(slug))
    .filter(Boolean)
    .map((article) => renderArticleCard(article))
    .join("");

  const regularTrackCards = articles
    .filter((article) => article.track !== "exam")
    .slice(0, 8)
    .map((article) => renderArticleCard(article))
    .join("");

  const examTrackCards = articles
    .filter((article) => article.track === "exam")
    .slice(0, 8)
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
    .slice(0, 10)
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
      regular_track_cards: regularTrackCards,
      exam_track_cards: examTrackCards,
      recent_updates: recentUpdates,
      breadcrumb_html: ""
    },
    pageScript: '<script type="module" src="/assets/js/page-home.js"></script>',
    seo: buildSeoTags({
      title: SITE_NAME,
      description: "高校生向けのスマホ中心・微積インタラクティブ学習サイト。定期テストと共通テストの二層導線。",
      route: "/",
      siteUrl: SITE_URL,
      type: "website",
      crumbs: [{ name: "ホーム", route: "/" }]
    })
  });

  const examCrumbs = [
    { name: "ホーム", route: "/" },
    { name: "共通テストハブ", route: "/exam/" }
  ];
  await writePage({
    templates,
    route: "/exam/",
    bodyClass: "page-exam",
    currentRoute: "/exam/",
    pageTemplate: "exam",
    pageValues: {
      exam_cards: articles
        .filter((article) => article.track === "exam")
        .sort(compareByOrderThenTitle)
        .map((article) => renderArticleCard(article))
        .join(""),
      breadcrumb_html: renderBreadcrumb(examCrumbs)
    },
    pageScript: '<script type="module" src="/assets/js/page-section.js"></script>',
    seo: buildSeoTags({
      title: "共通テスト微積ハブ",
      description: "共通テストの微積で失点しやすいテーマを順番に演習するページ。",
      route: "/exam/",
      siteUrl: SITE_URL,
      type: "website",
      crumbs: examCrumbs
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
    const examCount = sectionArticles.filter((article) => article.track === "exam").length;
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
        section_meta: `${sectionArticles.length}記事 / 共通テスト導線 ${examCount}記事`,
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

    await writePage({
      templates,
      route: article.route,
      bodyClass: "page-article",
      currentRoute: article.route,
      pageTemplate: "article",
      pageValues: {
        article_track: article.track,
        article_intent: article.intent,
        track_badge: `${escapeHtml(article.trackLabel)} / ${escapeHtml(article.examTag)} / ${escapeHtml(article.level)}`,
        article_title: escapeHtml(article.title),
        article_description: escapeHtml(article.description),
        article_tags: renderTagList(article.tags),
        conclusion_text: escapeHtml(article.conclusion || article.description),
        interactive_html: renderInteractiveContainer(article.interactive),
        ad_top: renderAdSlot({ slotId: `${article.slug}-top`, position: "top" }),
        misconception_block: buildMisconceptionBlock(article),
        article_body: article.bodyHtml,
        example_text: escapeHtml(
          article.example || "本文を読んだ後、式を見ずに自分でグラフと式の対応を説明してみましょう。"
        ),
        quick_review_block: buildQuickReviewBlock(article),
        common_mistake_text: escapeHtml(article.commonMistake || article.misconceptionPattern),
        exam_cta: buildExamCta(article),
        related_links_html: renderArticleLinks({
          links: article.relatedLinks,
          currentTrack: article.track,
          currentIntent: article.intent
        }),
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
        crumbs,
        article: {
          publishedDate: article.published,
          modifiedDate: article.updates[0]?.date ?? article.published
        }
      })
    });
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

  await writeKpiContent(articles);
  await writeSitemap([...routesForSitemap], PUBLIC_SITEMAP_PATH, SITE_URL);

  console.log(`Built content: ${articles.length} articles / ${articles.filter((a) => a.interactive).length} interactive.`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
