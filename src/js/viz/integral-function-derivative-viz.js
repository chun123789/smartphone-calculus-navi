import * as d3 from "d3";
import { createChart } from "./common-chart.js";

function f(x, k) {
  return k * x * x;
}

function F(x, k) {
  return (k * (x ** 3 - 1)) / 3;
}

export function initIntegralFunctionDerivativeViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { k, x } = readValues();
    const xMin = 1;
    const xMax = 3;
    const data = d3.range(xMin, xMax + 0.01, 0.03).map((vx) => ({ x: vx, y: F(vx, k) }));
    const yExtent = d3.extent(data, (d) => d.y);

    const { plot, xScale, yScale, palette } = createChart(canvas, {
      xDomain: [xMin, xMax],
      yDomain: [Math.min(0, yExtent[0]) - 0.5, yExtent[1] + 0.8]
    });

    const line = d3.line().x((d) => xScale(d.x)).y((d) => yScale(d.y));
    plot
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", palette.curve)
      .attr("stroke-width", 2.1)
      .attr("d", line);

    const dx = 0.03;
    const derivativeApprox = (F(x + dx, k) - F(x, k)) / dx;
    const fx = f(x, k);

    plot
      .append("circle")
      .attr("cx", xScale(x))
      .attr("cy", yScale(F(x, k)))
      .attr("r", 4.3)
      .attr("fill", palette.primary);

    summary.textContent = `d/dx ∫[1,x]f(t)dt ≈ ${derivativeApprox.toFixed(4)}、f(x)=${fx.toFixed(4)}。差分近似で一致を確認。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => input.addEventListener("input", render));
  render();
}
