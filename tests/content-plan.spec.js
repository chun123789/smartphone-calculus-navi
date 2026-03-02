import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { loadArticlePlan } from "../scripts/content/import-plan.mjs";
import { validateArticlePlan } from "../scripts/content/validate-plan.mjs";

describe("content plan validation", () => {
  test("default plan has 30 rows", async () => {
    const rows = await validateArticlePlan();
    expect(rows.length).toBeGreaterThanOrEqual(30);
  });

  test("detects duplicate slug in csv", async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "plan-test-"));
    const csvPath = path.join(tmpDir, "articles.csv");
    const raw = [
      "slug,title,section,order,track,intent,level,priority,vizModule,prereq1,prereq2,next,mistake,published,hookQuestion,oneLineAnswer,takeaway1,takeaway2,takeaway3,check1,check2",
      "a,Title A,basics,1,regular,definition,基礎,S,,b,c,d,e,2026-03-02,最初に何を見るべきか,図と式で説明できるようにする,条件整理を先に行う,符号と範囲を確認する,最後に単位を点検する,30秒で説明できるか,同型問題を再現できるか",
      "a,Title B,basics,2,regular,definition,基礎,S,,b,c,d,e,2026-03-02,最初に何を見るべきか,図と式で説明できるようにする,条件整理を先に行う,符号と範囲を確認する,最後に単位を点検する,30秒で説明できるか,同型問題を再現できるか",
      "b,Title C,basics,3,regular,definition,基礎,S,,a,c,d,e,2026-03-02,最初に何を見るべきか,図と式で説明できるようにする,条件整理を先に行う,符号と範囲を確認する,最後に単位を点検する,30秒で説明できるか,同型問題を再現できるか",
      "c,Title D,basics,4,regular,definition,基礎,S,,a,b,d,e,2026-03-02,最初に何を見るべきか,図と式で説明できるようにする,条件整理を先に行う,符号と範囲を確認する,最後に単位を点検する,30秒で説明できるか,同型問題を再現できるか",
      "d,Title E,basics,5,regular,definition,基礎,S,,a,b,c,e,2026-03-02,最初に何を見るべきか,図と式で説明できるようにする,条件整理を先に行う,符号と範囲を確認する,最後に単位を点検する,30秒で説明できるか,同型問題を再現できるか",
      "e,Title F,basics,6,regular,definition,基礎,S,,a,b,c,d,2026-03-02,最初に何を見るべきか,図と式で説明できるようにする,条件整理を先に行う,符号と範囲を確認する,最後に単位を点検する,30秒で説明できるか,同型問題を再現できるか"
    ].join("\n");
    await fs.writeFile(csvPath, `${raw}\n`, "utf8");

    await expect(loadArticlePlan(csvPath)).resolves.toHaveLength(6);
    await expect(validateArticlePlan(csvPath)).rejects.toThrow(/at least 30 rows|Duplicate slug/);
  });
});
