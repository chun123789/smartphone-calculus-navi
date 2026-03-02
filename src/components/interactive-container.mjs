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
    aria-describedby="interactive-help value-${control.id}"
  >
  <output id="value-${control.id}" class="slider-value" aria-live="polite">${control.default}</output>
</div>`;
}

export function renderInteractiveContainer(interactive) {
  if (!interactive) {
    return `
<section class="interactive-block" aria-labelledby="interactive-title">
  <h2 id="interactive-title">結論＋インタラクティブ</h2>
  <p>このページは読み物中心です。必要な可視化はありません。</p>
</section>`.trim();
  }

  const controlsHtml = interactive.controls.map((control) => renderControl(control)).join("");
  return `
<section class="interactive-block" aria-labelledby="interactive-title">
  <h2 id="interactive-title">結論＋インタラクティブ</h2>
  <p id="interactive-help">スライダーを動かすと、式とグラフの対応を同時に確認できます。</p>
  <div
    id="interactive-root"
    class="interactive-root"
    data-module="${interactive.module}"
    role="region"
    aria-label="微積可視化エリア"
  >
    <div id="viz-canvas" class="viz-canvas" role="img" aria-label="可視化グラフ"></div>
    <form class="slider-controls" aria-describedby="interactive-help">
      ${controlsHtml}
    </form>
    <p id="interactive-summary" class="interactive-summary" aria-live="polite"></p>
  </div>
</section>`.trim();
}
