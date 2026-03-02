import * as d3 from "d3";
import { createChart } from "./common-chart.js";

function f(x, p) {
  return x ** 3 - 3 * p * x;
}

function df(x, p) {
  return 3 * x * x - 3 * p;
}

export function initDerivativeSignViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { p, x } = readValues();
    const safeP = Math.max(0.1, p);
    const xMin = -3.2;
    const xMax = 3.2;
    const data = d3.range(xMin, xMax + 0.01, 0.03).map((vx) => ({ x: vx, y: f(vx, safeP) }));
    const yExtent = d3.extent(data, (d) => d.y);
    const yPad = Math.max(1, (yExtent[1] - yExtent[0]) * 0.18);

    const { plot, xScale, yScale } = createChart(canvas, {
      xDomain: [xMin, xMax],
      yDomain: [yExtent[0] - yPad, yExtent[1] + yPad]
    });

    const curve = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    plot
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2.2)
      .attr("d", curve);

    const critical = Math.sqrt(safeP);
    [critical, -critical].forEach((cx) => {
      plot
        .append("line")
        .attr("x1", xScale(cx))
        .attr("x2", xScale(cx))
        .attr("y1", yScale(yExtent[0] - yPad))
        .attr("y2", yScale(yExtent[1] + yPad))
        .attr("stroke", "#e27a00")
        .attr("stroke-dasharray", "4,4");
    });

    const y = f(x, safeP);
    plot
      .append("circle")
      .attr("cx", xScale(x))
      .attr("cy", yScale(y))
      .attr("r", 4.3)
      .attr("fill", "#0b74de");

    const slope = df(x, safeP);
    const signText = slope > 0 ? "増加" : slope < 0 ? "減少" : "停留";
    summary.textContent = `x=${x.toFixed(2)} で f'(x)=${slope.toFixed(3)}。この点の挙動は「${signText}」。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => input.addEventListener("input", render));
  render();
}
