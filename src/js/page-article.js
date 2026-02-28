import { setupSliderAnnouncer } from "./a11y/slider-announcer.js";

const loaders = {
  "secant-tangent": () => import("./viz/secant-tangent-viz.js"),
  "riemann-sum": () => import("./viz/riemann-sum-viz.js")
};

async function initInteractive() {
  const root = document.getElementById("interactive-root");
  if (!root) {
    return;
  }

  const moduleName = root.dataset.module;
  if (!moduleName || !loaders[moduleName]) {
    const summary = root.querySelector("#interactive-summary");
    if (summary) {
      summary.textContent = "このページは可視化モジュール未設定です。";
    }
    return;
  }

  const readValues = setupSliderAnnouncer(root);
  const module = await loaders[moduleName]();
  if (moduleName === "secant-tangent") {
    module.initSecantTangentViz({ root, readValues });
  } else if (moduleName === "riemann-sum") {
    module.initRiemannSumViz({ root, readValues });
  }

  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise();
  }
}

initInteractive().catch((error) => {
  const root = document.getElementById("interactive-root");
  if (root) {
    const summary = root.querySelector("#interactive-summary");
    if (summary) {
      summary.textContent = "可視化の読み込みで問題が発生しました。";
    }
  }
  console.error(error);
});

