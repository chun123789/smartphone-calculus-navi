export function renderBreadcrumb(crumbs) {
  const listItems = crumbs
    .map((crumb, index) => {
      const isLast = index === crumbs.length - 1;
      if (isLast) {
        return `<li aria-current="page">${crumb.name}</li>`;
      }
      return `<li><a href="${crumb.route}">${crumb.name}</a></li>`;
    })
    .join("");

  return `
<nav class="breadcrumb" aria-label="パンくずリスト">
  <ol>${listItems}</ol>
</nav>`.trim();
}

