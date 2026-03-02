import { setupSliderAnnouncer } from "./a11y/slider-announcer.js";

const loaders = {
  "secant-tangent": () => import("./viz/secant-tangent-viz.js"),
  "riemann-sum": () => import("./viz/riemann-sum-viz.js"),
  "tangent-line": () => import("./viz/tangent-line-viz.js"),
  "derivative-sign": () => import("./viz/derivative-sign-viz.js"),
  "signed-area": () => import("./viz/signed-area-viz.js"),
  "area-between-curves": () => import("./viz/area-between-curves-viz.js"),
  "chain-rule-flow": () => import("./viz/chain-rule-flow-viz.js"),
  "area-function-ftc": () => import("./viz/area-function-ftc-viz.js"),
  "integral-function-derivative": () => import("./viz/integral-function-derivative-viz.js"),
  "substitution-map": () => import("./viz/substitution-map-viz.js")
};

const initMethod = {
  "secant-tangent": "initSecantTangentViz",
  "riemann-sum": "initRiemannSumViz",
  "tangent-line": "initTangentLineViz",
  "derivative-sign": "initDerivativeSignViz",
  "signed-area": "initSignedAreaViz",
  "area-between-curves": "initAreaBetweenCurvesViz",
  "chain-rule-flow": "initChainRuleFlowViz",
  "area-function-ftc": "initAreaFunctionFtcViz",
  "integral-function-derivative": "initIntegralFunctionDerivativeViz",
  "substitution-map": "initSubstitutionMapViz"
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
  const methodName = initMethod[moduleName];
  const init = module[methodName];
  if (typeof init !== "function") {
    throw new Error(`Visualization initializer missing: ${moduleName}.${methodName}`);
  }
  init({ root, readValues });

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
