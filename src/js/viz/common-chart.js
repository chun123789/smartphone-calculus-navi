import * as d3 from "d3";

export function createChart(container, { xDomain, yDomain, width = 360, height = 280 }) {
  container.textContent = "";

  const margin = { top: 16, right: 16, bottom: 34, left: 44 };
  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", "100%");

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const plot = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear().domain(xDomain).range([0, plotWidth]);
  const yScale = d3.scaleLinear().domain(yDomain).nice().range([plotHeight, 0]);

  plot
    .append("g")
    .attr("transform", `translate(0,${plotHeight})`)
    .call(d3.axisBottom(xScale).ticks(6));

  plot.append("g").call(d3.axisLeft(yScale).ticks(6));

  plot
    .append("line")
    .attr("x1", xScale(xDomain[0]))
    .attr("x2", xScale(xDomain[1]))
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", "#cbd5e1");

  plot
    .append("line")
    .attr("x1", xScale(0))
    .attr("x2", xScale(0))
    .attr("y1", yScale(yDomain[0]))
    .attr("y2", yScale(yDomain[1]))
    .attr("stroke", "#cbd5e1");

  return { svg, plot, xScale, yScale, plotWidth, plotHeight };
}

