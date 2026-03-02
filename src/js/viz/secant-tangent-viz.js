import * as d3 from "d3";
import { createChart } from "./common-chart.js";
import { computeSecantSlope, computeTangentSlope, evaluateQuadratic } from "../calc/index.js";

export function initSecantTangentViz({ root, readValues }) {
  const canvas = root.querySelector("#viz-canvas");
  const summary = root.querySelector("#interactive-summary");

  const render = () => {
    const { k, a, dx } = readValues();
    const f = (x) => evaluateQuadratic({ k, x });
    const xMin = Math.min(-4, a - 2);
    const xMax = Math.max(4, a + dx + 2);
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

    const pointA = { x: a, y: f(a) };
    const pointB = { x: a + dx, y: f(a + dx) };
    const secantSlope = computeSecantSlope({ k, a, dx });
    const tangentSlope = computeTangentSlope({ k, a });

    const secantY = (x) => pointA.y + secantSlope * (x - pointA.x);
    const tangentY = (x) => pointA.y + tangentSlope * (x - pointA.x);

    plot
      .append("line")
      .attr("x1", xScale(xMin))
      .attr("x2", xScale(xMax))
      .attr("y1", yScale(secantY(xMin)))
      .attr("y2", yScale(secantY(xMax)))
      .attr("stroke", palette.danger)
      .attr("stroke-width", 2);

    plot
      .append("line")
      .attr("x1", xScale(xMin))
      .attr("x2", xScale(xMax))
      .attr("y1", yScale(tangentY(xMin)))
      .attr("y2", yScale(tangentY(xMax)))
      .attr("stroke", palette.primary)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,4");

    plot
      .append("circle")
      .attr("cx", xScale(pointA.x))
      .attr("cy", yScale(pointA.y))
      .attr("r", 4.2)
      .attr("fill", palette.primary);

    plot
      .append("circle")
      .attr("cx", xScale(pointB.x))
      .attr("cy", yScale(pointB.y))
      .attr("r", 4.2)
      .attr("fill", palette.danger);

    summary.textContent =
      `割線の傾き: ${secantSlope.toFixed(4)} / 接線の傾き: ${tangentSlope.toFixed(4)}。` +
      `dxを小さくすると2つが近づきます。`;
  };

  root.querySelectorAll(".slider-input").forEach((input) => {
    input.addEventListener("input", render);
  });
  render();
}
