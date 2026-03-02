import * as d3 from "d3";
import { createChart } from "./common-chart.js";

function f(x, k) {
  return k * x * x;
}

function A(x, k) {
  return (k * x ** 3) / 3;
}

export function initAreaFunctionFtcViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { k, x } = readValues();
    const xMin = 0;
    const xMax = 3;
    const dataA = d3.range(xMin, xMax + 0.01, 0.03).map((vx) => ({ x: vx, y: A(vx, k) }));
    const yMax = Math.max(...dataA.map((d) => d.y), 1) * 1.15;

    const { plot, xScale, yScale } = createChart(canvas, {
      xDomain: [xMin, xMax],
      yDomain: [0, yMax]
    });

    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    plot
      .append("path")
      .datum(dataA)
      .attr("fill", "none")
      .attr("stroke", "#0b74de")
      .attr("stroke-width", 2.1)
      .attr("d", line);

    const dx = 0.05;
    const approxSlope = (A(x + dx, k) - A(x, k)) / dx;
    const fx = f(x, k);

    plot
      .append("circle")
      .attr("cx", xScale(x))
      .attr("cy", yScale(A(x, k)))
      .attr("r", 4.3)
      .attr("fill", "#e27a00");

    summary.textContent = `A'(x)の差分近似=${approxSlope.toFixed(4)}、f(x)=${fx.toFixed(4)}。2つが一致していくのが基本定理です。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => input.addEventListener("input", render));
  render();
}
