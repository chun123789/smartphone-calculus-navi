import * as d3 from "d3";
import { createChart } from "./common-chart.js";

function u(x, p) {
  return p * x * x;
}

export function initSubstitutionMapViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { p, x } = readValues();
    const xMin = -2;
    const xMax = 2;
    const data = d3.range(xMin, xMax + 0.01, 0.03).map((vx) => ({ x: vx, y: u(vx, p) }));
    const yMax = Math.max(...data.map((d) => d.y), 1.2) * 1.2;

    const { plot, xScale, yScale, palette } = createChart(canvas, {
      xDomain: [xMin, xMax],
      yDomain: [0, yMax]
    });

    const line = d3.line().x((d) => xScale(d.x)).y((d) => yScale(d.y));

    plot
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", palette.primary)
      .attr("stroke-width", 2.2)
      .attr("d", line);

    const uv = u(x, p);
    const dudx = 2 * p * x;

    plot
      .append("circle")
      .attr("cx", xScale(x))
      .attr("cy", yScale(uv))
      .attr("r", 4.3)
      .attr("fill", palette.secondary);

    summary.textContent = `x=${x.toFixed(2)} を u=${uv.toFixed(3)} に写像。du/dx=${dudx.toFixed(3)} を使って置換積分を組み立てます。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => input.addEventListener("input", render));
  render();
}
