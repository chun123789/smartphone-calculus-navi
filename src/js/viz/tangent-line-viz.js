import * as d3 from "d3";
import { createChart } from "./common-chart.js";
import { computeTangentSlope, evaluateQuadratic } from "../calc/index.js";

export function initTangentLineViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { k, a } = readValues();
    const f = (x) => evaluateQuadratic({ k, x });
    const xMin = -4;
    const xMax = 4;
    const data = d3.range(xMin, xMax + 0.01, 0.05).map((x) => ({ x, y: f(x) }));
    const yExtent = d3.extent(data, (d) => d.y);
    const yPad = Math.max(1, (yExtent[1] - yExtent[0]) * 0.2);

    const { plot, xScale, yScale, palette } = createChart(canvas, {
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
      .attr("stroke", palette.curve)
      .attr("stroke-width", 2.2)
      .attr("d", curve);

    const point = { x: a, y: f(a) };
    const slope = computeTangentSlope({ k, a });
    const tangentY = (x) => point.y + slope * (x - a);

    plot
      .append("line")
      .attr("x1", xScale(xMin))
      .attr("x2", xScale(xMax))
      .attr("y1", yScale(tangentY(xMin)))
      .attr("y2", yScale(tangentY(xMax)))
      .attr("stroke", palette.primary)
      .attr("stroke-width", 2.1);

    plot
      .append("circle")
      .attr("cx", xScale(point.x))
      .attr("cy", yScale(point.y))
      .attr("r", 4.4)
      .attr("fill", palette.secondary);

    summary.textContent = `接線の傾き f'(a) = ${slope.toFixed(4)}。点aを動かすと傾きが更新されます。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => input.addEventListener("input", render));
  render();
}
