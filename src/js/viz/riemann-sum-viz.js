import * as d3 from "d3";
import { createChart } from "./common-chart.js";
import { computeRiemannSum, exactIntegralX2 } from "../calc/index.js";

function f(k, x) {
  return k * x * x;
}

export function initRiemannSumViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { k, N } = readValues();
    const n = Math.max(1, Math.floor(N));
    const a = 0;
    const b = 2;
    const dx = (b - a) / n;
    const data = d3.range(a, b + 0.01, 0.02).map((x) => ({ x, y: f(k, x) }));
    const yMax = Math.max(...data.map((d) => d.y), 1);

    const { plot, xScale, yScale, palette } = createChart(canvas, {
      xDomain: [a, b],
      yDomain: [0, yMax * 1.15]
    });

    const curve = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    plot
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", palette.curve)
      .attr("stroke-width", 2.2)
      .attr("d", curve);

    for (let i = 0; i < n; i += 1) {
      const x = a + i * dx;
      const y = f(k, x);
      plot
        .append("rect")
        .attr("x", xScale(x))
        .attr("y", yScale(y))
        .attr("width", Math.max(0, xScale(x + dx) - xScale(x) - 1))
        .attr("height", yScale(0) - yScale(y))
        .attr("fill", palette.fillPrimary)
        .attr("stroke", palette.primary);
    }

    const approx = computeRiemannSum({ k, n, method: "left", a, b });
    const exact = exactIntegralX2({ k, a, b });
    const error = Math.abs(exact - approx);
    summary.textContent =
      `リーマン和(左端): ${approx.toFixed(4)} / 正確な面積: ${exact.toFixed(4)} / 誤差: ${error.toFixed(4)}`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => {
    input.addEventListener("input", render);
  });
  render();
}
