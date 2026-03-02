const NAV_ITEMS = [
  { href: "/", label: "トップ", short: "TOP" },
  { href: "/calculus/differentiation/", label: "微分", short: "D" },
  { href: "/calculus/integration/", label: "積分", short: "I" },
  { href: "/exam/", label: "共テ", short: "EX" },
  { href: "/changelog/", label: "更新ログ", short: "LOG" },
  { href: "/report/", label: "誤り報告", short: "REP" }
];

const TABBAR_ITEMS = NAV_ITEMS.slice(0, 4);

function isActive(route, href) {
  if (href === "/") {
    return route === "/";
  }
  return route.startsWith(href);
}

function renderNavItems(currentRoute) {
  return NAV_ITEMS.map((item) => {
    const activeClass = isActive(currentRoute, item.href) ? "is-active" : "";
    const ariaCurrent = activeClass ? 'aria-current="page"' : "";
    return `<li><a class="nav-link ${activeClass}" href="${item.href}" ${ariaCurrent}>${item.label}</a></li>`;
  }).join("");
}

function renderTabbarItems(currentRoute) {
  return TABBAR_ITEMS.map((item) => {
    const activeClass = isActive(currentRoute, item.href) ? "is-active" : "";
    const ariaCurrent = activeClass ? 'aria-current="page"' : "";
    return `<li><a class="tab-link ${activeClass}" href="${item.href}" ${ariaCurrent}><span class="tab-short">${item.short}</span><span class="tab-label">${item.label}</span></a></li>`;
  }).join("");
}

export function renderHeader(currentRoute = "/") {
  return `
<header class="site-header" role="banner">
  <div class="header-inner">
    <a class="site-logo" href="/" aria-label="スマホで微積ナビ ホーム">
      <span class="logo-badge" aria-hidden="true">∫</span>
      <span class="logo-block">
        <strong>スマホで微積ナビ</strong>
        <small>定期テスト + 共通テスト 最短導線</small>
      </span>
    </a>
    <div class="header-actions">
      <button class="theme-toggle" id="theme-toggle" aria-label="テーマを切替" aria-live="polite">テーマ</button>
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">メニュー</button>
    </div>
  </div>
  <nav class="site-nav" id="site-nav" aria-label="メインナビゲーション">
    <ul>${renderNavItems(currentRoute)}</ul>
  </nav>
</header>
<nav class="mobile-tabbar" aria-label="クイックナビ">
  <ul>${renderTabbarItems(currentRoute)}</ul>
</nav>`.trim();
}
