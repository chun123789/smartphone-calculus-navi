import * as d3 from "d3";
import { createChart } from "./common-chart.js";

function u(x, p) {
  return p * x + 1;
}

function yFromU(uValue) {
  return uValue * uValue;
}

export function initChainRuleFlowViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { x, p } = readValues();
    const xMin = -2;
    const xMax = 2;
    const data = d3.range(xMin, xMax + 0.01, 0.03).map((vx) => {
      const uv = u(vx, p);
      return { x: vx, y: yFromU(uv) };
    });

    const yExtent = d3.extent(data, (d) => d.y);
    const yPad = Math.max(0.5, (yExtent[1] - yExtent[0]) * 0.15);

    const { plot, xScale, yScale, palette } = createChart(canvas, {
      xDomain: [xMin, xMax],
      yDomain: [yExtent[0] - yPad, yExtent[1] + yPad]
    });

    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    plot
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", palette.curve)
      .attr("stroke-width", 2.2)
      .attr("d", line);

    const uValue = u(x, p);
    const y = yFromU(uValue);
    const dydu = 2 * uValue;
    const dudx = p;
    const dydx = dydu * dudx;

    plot
      .append("circle")
      .attr("cx", xScale(x))
      .attr("cy", yScale(y))
      .attr("r", 4.2)
      .attr("fill", palette.primary);

    summary.textContent = `u=${uValue.toFixed(3)}, dy/du=${dydu.toFixed(3)}, du/dx=${dudx.toFixed(3)} なので dy/dx=${dydx.toFixed(3)}。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => input.addEventListener("input", render));
  render();
}
