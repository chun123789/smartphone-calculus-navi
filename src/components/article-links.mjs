const KIND_ORDER = ["前提", "同階層", "次ステップ", "ミス集"];

export function renderArticleLinks(links) {
  const grouped = new Map();
  for (const kind of KIND_ORDER) {
    grouped.set(kind, []);
  }
  for (const link of links) {
    if (grouped.has(link.kind)) {
      grouped.get(link.kind).push(link);
    }
  }

  const blocks = KIND_ORDER.map((kind) => {
    const items = grouped.get(kind) ?? [];
    const list = items
      .map((item) => `<li><a href="${item.route}">${item.title}</a></li>`)
      .join("");
    return `
<section class="related-group">
  <h3>${kind}</h3>
  <ul>${list}</ul>
</section>`;
  }).join("");

  return `
<section class="related-links" aria-label="内部リンク">
  <h2>次に読む</h2>
  ${blocks}
</section>`.trim();
}

