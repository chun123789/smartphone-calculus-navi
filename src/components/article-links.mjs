const KIND_ORDER = ["前提", "同階層", "次ステップ", "ミス集"];

export function renderArticleLinks({ links, currentTrack, currentIntent }) {
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
      .map((item) => {
        return `<li><a href="${item.route}" data-track="${item.track}" data-intent="${item.intent}" data-cta-kind="internal-link">${item.title}</a></li>`;
      })
      .join("");
    return `
<section class="related-group">
  <h3>${kind}</h3>
  <ul>${list}</ul>
</section>`;
  }).join("");

  return `
<section class="related-links" aria-label="内部リンク" data-track="${currentTrack}" data-intent="${currentIntent}">
  <h2>次に読む</h2>
  ${blocks}
</section>`.trim();
}
