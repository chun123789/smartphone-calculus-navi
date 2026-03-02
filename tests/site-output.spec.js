import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = "/Users/masudanaoki/ai-workspace/math-blog-test";
const SITE_ROOT = path.join(ROOT, ".site");

function readSiteFile(...segments) {
  return fs.readFileSync(path.join(SITE_ROOT, ...segments), "utf8");
}

describe("site output UX checks", () => {
  beforeAll(() => {
    execSync("node scripts/build-content.mjs", { cwd: ROOT, stdio: "pipe" });
  }, 120000);

  test("home uses 4 fixed blocks and avoids duplicate article cards", () => {
    const home = readSiteFile("index.html");
    expect(home).toContain("30秒で選ぶ");
    expect(home).toContain("最初の1本");
    expect(home).toContain("今日の10分");
    expect(home).toContain("最近の更新");

    const cardLinks = [...home.matchAll(/data-cta-kind="card-read"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*data-cta-kind="card-read"/g)]
      .map((match) => match[1] || match[2])
      .filter(Boolean);

    expect(cardLinks.length).toBeGreaterThanOrEqual(3);
    expect(new Set(cardLinks).size).toBe(cardLinks.length);
  });

  test("article keeps the intended block order", () => {
    const article = readSiteFile("calculus", "differentiation", "secant-to-tangent", "index.html");
    const checkpoints = [
      "問い",
      "結論1行",
      "可視化で確認する",
      "60秒要点",
      "ミス反例",
      "確認2問",
      "次の1本",
      "関連記事6本を開く"
    ];

    let previousIndex = -1;
    for (const marker of checkpoints) {
      const index = article.indexOf(marker);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  test("a11y smoke: interactive controls and tap size token exist", () => {
    const article = readSiteFile("calculus", "differentiation", "secant-to-tangent", "index.html");
    const baseCss = fs.readFileSync(path.join(ROOT, "src", "styles", "base.css"), "utf8");

    expect(article).toContain("id=\"interactive-play-toggle\"");
    expect(article).toContain("id=\"interactive-reset\"");
    expect(article).toContain("関連記事6本を開く");
    expect(baseCss).toContain("--tap-min: 44px");
    expect(baseCss).toContain("--tap-main: 48px");
  });

  test("ux-content-quality report is generated with no errors", () => {
    const reportPath = path.join(ROOT, "public", "ux-content-quality.json");
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    expect(report.articleCount).toBeGreaterThanOrEqual(30);
    expect(Array.isArray(report.errors)).toBe(true);
    expect(report.errors).toHaveLength(0);
  });
});
