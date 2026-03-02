import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";
import { validateArticlePlan } from "./validate-plan.mjs";
import { getInteractiveFromModule } from "./module-presets.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const ARTICLES_ROOT = path.join(ROOT, "src", "articles");

function sectionLabel(section) {
  return (
    {
      basics: "微積の準備",
      differentiation: "微分",
      integration: "積分",
      fundamental: "微積の基本定理",
      mistakes: "ミス集"
    }[section] ?? section
  );
}

function estimateMinutes(level, track) {
  if (track === "exam") {
    return level === "発展" ? 10 : 8;
  }
  return level === "基礎" ? 6 : level === "標準" ? 8 : 10;
}

function examTag(track) {
  return track === "exam" ? "共通テスト対策" : "定期テスト対策";
}

function misconception(intent, title) {
  if (intent === "mistake") {
    return "記号だけ追って意味を確認しないまま計算を進めてしまう";
  }
  if (intent === "exam") {
    return "誘導文の条件を式に変換する前に計算を始めてしまう";
  }
  return `${title} を公式暗記だけで処理してしまう`;
}

function makeBody(row) {
  return [
    `## このページのゴール`,
    "",
    `${row.title} を、式とグラフを往復しながら短時間で理解します。`,
    "",
    "## 誤答例",
    "",
    `- ${misconception(row.intent, row.title)}`,
    "",
    "## 反例可視化",
    "",
    "スライダーを動かして、誤答が成立しないケースを確認しましょう。",
    "",
    "## 正ルール",
    "",
    "1. 条件を先に言葉で整理する",
    "2. 式とグラフを同時に確認する",
    "3. 最後に単位・符号・範囲をチェックする",
    "",
    "## 確認問題",
    "",
    "- 30秒で要点を説明できるか",
    "- 似た問題で同じ手順を再現できるか"
  ].join("\n");
}

function buildFrontmatter(row) {
  const interactive = getInteractiveFromModule(row.vizModule);
  const commonTags = [sectionLabel(row.section), row.track === "exam" ? "共通テスト" : "定期テスト", row.intent];
  return {
    slug: row.slug,
    title: row.title,
    description: `${row.title}を高校生向けにスマホで理解する。`,
    section: row.section,
    order: row.order,
    track: row.track,
    intent: row.intent,
    level: row.level,
    priority: row.priority,
    estimatedMinutes: estimateMinutes(row.level, row.track),
    examTag: examTag(row.track),
    misconceptionPattern: misconception(row.intent, row.title),
    cta: row.track === "exam" ? "共通テスト演習へ進む" : "次の基礎記事へ進む",
    tags: commonTags,
    interactive,
    links: {
      prerequisitesCandidates: [row.prereq1, row.prereq2],
      nextStep: row.next,
      mistakes: row.mistake
    },
    updates: [
      {
        date: row.published,
        note: "構成を最新方針に更新"
      }
    ],
    published: row.published,
    conclusion: `${row.title}は「誤答→反例→正ルール」で理解すると定着が速い。`,
    example: "本文のルールを使って、1問だけ自力で再現してみよう。",
    commonMistake: misconception(row.intent, row.title)
  };
}

export async function generateArticlesFromPlan() {
  const rows = await validateArticlePlan();

  for (const row of rows) {
    const sectionDir = path.join(ARTICLES_ROOT, row.section);
    const articlePath = path.join(sectionDir, `${row.slug}.md`);
    await fs.mkdir(sectionDir, { recursive: true });

    let body = "";
    try {
      const current = await fs.readFile(articlePath, "utf8");
      body = matter(current).content.trim();
    } catch {
      body = "";
    }

    const frontmatter = buildFrontmatter(row);
    const contentBody = body.length > 0 ? body : makeBody(row);
    const output = matter.stringify(`${contentBody}\n`, frontmatter);
    await fs.writeFile(articlePath, output, "utf8");
  }

  return rows.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const count = await generateArticlesFromPlan();
  console.log(`Generated/updated ${count} articles from plan.`);
}
