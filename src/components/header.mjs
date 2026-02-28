const NAV_ITEMS = [
  { href: "/", label: "トップ" },
  { href: "/calculus/differentiation/", label: "微分" },
  { href: "/calculus/integration/", label: "積分" },
  { href: "/changelog/", label: "更新ログ" },
  { href: "/report/", label: "誤り報告" }
];

function isActive(route, href) {
  if (href === "/") {
    return route === "/";
  }
  return route.startsWith(href);
}

export function renderHeader(currentRoute = "/") {
  const navItems = NAV_ITEMS.map((item) => {
    const activeClass = isActive(currentRoute, item.href) ? "is-active" : "";
    const ariaCurrent = activeClass ? 'aria-current="page"' : "";
    return `<li><a class="nav-link ${activeClass}" href="${item.href}" ${ariaCurrent}>${item.label}</a></li>`;
  }).join("");

  return `
<header class="site-header" role="banner">
  <div class="header-inner">
    <a class="site-logo" href="/">スマホで微積ナビ</a>
    <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">メニュー</button>
  </div>
  <nav class="site-nav" id="site-nav" aria-label="メインナビゲーション">
    <ul>${navItems}</ul>
  </nav>
</header>`.trim();
}

