const LEGEND_MAP = {
  "secant-tangent": [
    { label: "関数", tone: "curve" },
    { label: "割線", tone: "danger" },
    { label: "接線", tone: "primary" },
    { label: "注目点", tone: "secondary" }
  ],
  "riemann-sum": [
    { label: "関数", tone: "curve" },
    { label: "区分矩形", tone: "fill-primary" },
    { label: "誤差", tone: "accent" }
  ],
  "signed-area": [
    { label: "関数", tone: "curve" },
    { label: "符号付き", tone: "danger-soft" },
    { label: "絶対値", tone: "fill-primary" }
  ],
  default: [
    { label: "関数", tone: "curve" },
    { label: "注目点", tone: "primary" },
    { label: "補助線", tone: "secondary" }
  ]
};

function renderControl(control) {
  return `
<div class="slider-row">
  <label for="ctrl-${control.id}">${control.label}</label>
  <input
    id="ctrl-${control.id}"
    class="slider-input"
    type="range"
    min="${control.min}"
    max="${control.max}"
    step="${control.step}"
    value="${control.default}"
    data-default-value="${control.default}"
    aria-describedby="interactive-help value-${control.id}"
  >
  <output id="value-${control.id}" class="slider-value" aria-live="polite">${control.default}</output>
</div>`;
}

function renderLegend(moduleName) {
  const legends = LEGEND_MAP[moduleName] ?? LEGEND_MAP.default;
  return legends
    .map((item) => `<li><span class="legend-swatch tone-${item.tone}" aria-hidden="true"></span>${item.label}</li>`)
    .join("");
}

export function renderInteractiveContainer(interactive) {
  if (!interactive) {
    return `
<section class="interactive-block" aria-labelledby="interactive-title">
  <h2 id="interactive-title">可視化</h2>
  <p>このページは読み物中心です。必要な可視化はありません。</p>
</section>`.trim();
  }

  const controlsHtml = interactive.controls.map((control) => renderControl(control)).join("");
  const legendHtml = renderLegend(interactive.module);
  return `
<section class="interactive-block" aria-labelledby="interactive-title">
  <h2 id="interactive-title">可視化で確認する</h2>
  <p id="interactive-help">スライダーを動かすと、式とグラフの対応が同時に更新されます。</p>
  <div
    id="interactive-root"
    class="interactive-root"
    data-module="${interactive.module}"
    role="region"
    aria-label="微積可視化エリア"
  >
    <div class="interactive-toolbar" role="group" aria-label="可視化操作">
      <button type="button" class="viz-control-button" id="interactive-play-toggle" aria-pressed="false">再生</button>
      <button type="button" class="viz-control-button" id="interactive-reset">初期値に戻す</button>
    </div>
    <ul class="viz-legend" aria-label="意味色凡例">
      ${legendHtml}
    </ul>
    <div id="viz-canvas" class="viz-canvas" role="img" aria-label="可視化グラフ"></div>
    <form class="slider-controls" aria-describedby="interactive-help">
      ${controlsHtml}
    </form>
    <p id="interactive-summary" class="interactive-summary" aria-live="polite"></p>
  </div>
</section>`.trim();
}
