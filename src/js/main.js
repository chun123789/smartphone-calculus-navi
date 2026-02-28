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

function refreshFooterYear() {
  const yearNode = document.getElementById("footer-year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

initMobileNav();
initFocusManagement();
refreshFooterYear();

