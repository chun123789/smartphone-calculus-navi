import { initFocusManagement } from "./a11y/focus-management.js";

function initMobileNav() {
  const button = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!button || !nav) {
    return;
  }
  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

function resolveThemePreference() {
  const saved = localStorage.getItem("theme-preference");
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme-preference", theme);
  const button = document.getElementById("theme-toggle");
  if (button) {
    const label = theme === "dark" ? "テーマ: ダーク" : "テーマ: ライト";
    button.textContent = label;
    button.setAttribute("aria-label", `${label}（タップで切替）`);
  }
}

function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) {
    return;
  }
  const initial = resolveThemePreference();
  setTheme(initial);

  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

function initCloudflareAnalytics() {
  const token = document.body.dataset.cfBeaconToken;
  if (!token || token === "REPLACE_ME") {
    return;
  }
  if (document.querySelector("script[data-cf-analytics]")) {
    return;
  }
  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
  script.setAttribute("data-cf-analytics", "true");
  document.head.append(script);
}

function refreshFooterYear() {
  const yearNode = document.getElementById("footer-year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

initMobileNav();
initFocusManagement();
initThemeToggle();
initCloudflareAnalytics();
refreshFooterYear();
