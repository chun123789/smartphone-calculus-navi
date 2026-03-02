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

function emitInput(input) {
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function setupInteractiveControls(root) {
  const sliders = [...root.querySelectorAll(".slider-input")];
  const playButton = root.querySelector("#interactive-play-toggle");
  const resetButton = root.querySelector("#interactive-reset");

  if (sliders.length === 0) {
    if (playButton) {
      playButton.disabled = true;
    }
    if (resetButton) {
      resetButton.disabled = true;
    }
    return () => {};
  }

  const defaults = new Map(
    sliders.map((slider) => [slider.id, slider.getAttribute("data-default-value") ?? slider.value])
  );

  let timer = null;
  let direction = 1;

  const updatePlayButton = (playing) => {
    if (!playButton) {
      return;
    }
    playButton.setAttribute("aria-pressed", String(playing));
    playButton.textContent = playing ? "停止" : "再生";
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    updatePlayButton(false);
  };

  const stepPrimarySlider = () => {
    const slider = sliders[0];
    if (!slider) {
      stop();
      return;
    }

    const min = Number(slider.min);
    const max = Number(slider.max);
    const step = Number(slider.step) || 1;
    const current = Number(slider.value);
    let next = current + direction * step;

    if (next >= max) {
      next = max;
      direction = -1;
    } else if (next <= min) {
      next = min;
      direction = 1;
    }

    slider.value = String(Number(next.toFixed(6)));
    emitInput(slider);
  };

  const play = () => {
    if (timer) {
      return;
    }
    updatePlayButton(true);
    timer = window.setInterval(stepPrimarySlider, 750);
  };

  if (playButton) {
    playButton.addEventListener("click", () => {
      if (timer) {
        stop();
      } else {
        play();
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      stop();
      sliders.forEach((slider) => {
        slider.value = defaults.get(slider.id) ?? slider.value;
        emitInput(slider);
      });
    });
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      stop();
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    stop();
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}

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
  const cleanup = setupInteractiveControls(root);
  window.addEventListener("beforeunload", cleanup, { once: true });

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
