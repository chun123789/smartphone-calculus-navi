import { validateArticleFrontmatter } from "../scripts/lib/article-schema.mjs";

describe("article frontmatter schema", () => {
  const valid = {
    slug: "sample-article",
    title: "サンプル",
    description: "説明",
    section: "differentiation",
    order: 10,
    track: "regular",
    intent: "definition",
    level: "基礎",
    priority: "S",
    estimatedMinutes: 6,
    examTag: "定期テスト対策",
    misconceptionPattern: "公式だけ覚えて意味が曖昧",
    cta: "次へ進む",
    hookQuestion: "最初にどこを見ればよいか？",
    oneLineAnswer: "式と図を往復して説明できる状態を作る。",
    keyTakeaways: [
      "条件を言葉にする",
      "グラフで符号を確認する",
      "最後に範囲を点検する"
    ],
    checkpointQuestions: [
      "30秒で要点を説明できるか",
      "同型問題で再現できるか"
    ],
    tags: ["微分", "基礎"],
    interactive: {
      module: "secant-tangent",
      controls: [
        { id: "k", label: "係数", min: -2, max: 2, step: 0.1, default: 1 }
      ]
    },
    links: {
      prerequisitesCandidates: ["a", "b"],
      nextStep: "c",
      mistakes: "d"
    },
    updates: [{ date: "2026-03-02", note: "test" }],
    published: "2026-03-02",
    conclusion: "結論",
    example: "例",
    commonMistake: "ミス"
  };

  test("accepts expanded fields", () => {
    const normalized = validateArticleFrontmatter(valid, "test.md");
    expect(normalized.track).toBe("regular");
    expect(normalized.intent).toBe("definition");
    expect(normalized.estimatedMinutes).toBe(6);
    expect(normalized.priority).toBe("S");
  });

  test("rejects missing new required fields", () => {
    const broken = { ...valid };
    delete broken.track;
    expect(() => validateArticleFrontmatter(broken, "test.md")).toThrow(/track/);
  });

  test("rejects invalid takeaway/question lengths", () => {
    const broken = { ...valid, keyTakeaways: ["1", "2"], checkpointQuestions: ["1"] };
    expect(() => validateArticleFrontmatter(broken, "test.md")).toThrow(/keyTakeaways|checkpointQuestions/);
  });
});
