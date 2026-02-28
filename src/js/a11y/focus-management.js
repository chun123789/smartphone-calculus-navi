export function initFocusManagement() {
  const hash = window.location.hash;
  if (hash === "#main-content") {
    const target = document.getElementById("main-content");
    if (target) {
      target.focus();
    }
  }
}

