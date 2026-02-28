export function renderFooter() {
  const year = new Date().getFullYear();
  return `
<footer class="site-footer" role="contentinfo">
  <p>© <span id="footer-year">${year}</span> スマホで微積ナビ</p>
  <p><a href="/report/">誤り報告</a> / <a href="/changelog/">更新ログ</a></p>
</footer>`.trim();
}

