import { markdownToSafeHtml } from "../scripts/markdown-to-html.mjs";

describe("math markdown rendering", () => {
  test("preserves display math delimiters", () => {
    const html = markdownToSafeHtml("\\[f'(a)=\\lim_{h\\to 0}\\frac{f(a+h)-f(a)}{h}\\]");
    expect(html).toContain("\\[");
    expect(html).toContain("\\]");
  });

  test("preserves inline math delimiters", () => {
    const html = markdownToSafeHtml("接線の傾きは \\(f'(a)\\) で表します。");
    expect(html).toContain("\\(f'(a)\\)");
  });

  test("preserves $$ blocks", () => {
    const html = markdownToSafeHtml("$$\\int_0^2 x^2 dx$$");
    expect(html).toContain("$$\\int_0^2 x^2 dx$$");
  });
});
