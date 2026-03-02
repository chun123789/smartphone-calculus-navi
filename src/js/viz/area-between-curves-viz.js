import * as d3 from "d3";
import { createChart } from "./common-chart.js";

function y1(x, a, b) {
  return a * x + b;
}

function y2(x) {
  return x * x - 0.4;
}

export function initAreaBetweenCurvesViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { a, b } = readValues();
    const xMin = -0.3;
    const xMax = 2;

    const samples = d3.range(xMin, xMax + 0.01, 0.02).map((x) => ({ x, top: y1(x, a, b), bottom: y2(x) }));
    const yMin = Math.min(...samples.map((d) => Math.min(d.top, d.bottom))) - 0.5;
    const yMax = Math.max(...samples.map((d) => Math.max(d.top, d.bottom))) + 0.5;

    const { plot, xScale, yScale, palette } = createChart(canvas, {
      xDomain: [xMin, xMax],
      yDomain: [yMin, yMax]
    });

    const line1 = d3.line().x((d) => xScale(d.x)).y((d) => yScale(d.top));
    const line2 = d3.line().x((d) => xScale(d.x)).y((d) => yScale(d.bottom));

    plot
      .append("path")
      .datum(samples)
      .attr("fill", "none")
      .attr("stroke", palette.primary)
      .attr("stroke-width", 2)
      .attr("d", line1);

    plot
      .append("path")
      .datum(samples)
      .attr("fill", "none")
      .attr("stroke", palette.secondary)
      .attr("stroke-width", 2)
      .attr("d", line2);

    const area = d3
      .area()
      .x((d) => xScale(d.x))
      .y0((d) => yScale(Math.min(d.top, d.bottom)))
      .y1((d) => yScale(Math.max(d.top, d.bottom)));

    plot
      .append("path")
      .datum(samples)
      .attr("d", area)
      .attr("fill", palette.fillSecondary);

    const areaApprox = samples.reduce((acc, point, index) => {
      if (index === 0) return acc;
      const prev = samples[index - 1];
      const dx = point.x - prev.x;
      const h1 = Math.abs(point.top - point.bottom);
      const h0 = Math.abs(prev.top - prev.bottom);
      return acc + ((h0 + h1) * dx) / 2;
    }, 0);

    summary.textContent = `2曲線の差の面積（近似）= ${areaApprox.toFixed(4)}。上−下を先に判定すると計算が安定します。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => input.addEventListener("input", render));
  render();
}
