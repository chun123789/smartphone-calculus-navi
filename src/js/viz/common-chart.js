import * as d3 from "d3";

function readCssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function getVizPalette() {
  return {
    curve: readCssVar("--viz-curve", "#1f2937"),
    primary: readCssVar("--viz-primary", "#0b74de"),
    secondary: readCssVar("--viz-secondary", "#f08c00"),
    danger: readCssVar("--viz-danger", "#dc2626"),
    accent: readCssVar("--viz-accent", "#0f766e"),
    point: readCssVar("--viz-point", "#2563eb"),
    fillPrimary: readCssVar("--viz-fill-primary", "rgba(37,99,235,0.2)"),
    fillSecondary: readCssVar("--viz-fill-secondary", "rgba(15,118,110,0.2)"),
    dangerSoft: readCssVar("--viz-danger-soft", "rgba(220,38,38,0.2)"),
    axisLine: readCssVar("--viz-axis-line", "#cbd5e1"),
    axisText: readCssVar("--viz-axis-text", "#475569")
  };
}

function styleAxis(axisGroup, palette) {
  axisGroup.selectAll("path, line").attr("stroke", palette.axisLine);
  axisGroup.selectAll("text").attr("fill", palette.axisText).attr("font-size", 11);
}

export function createChart(container, { xDomain, yDomain, width = 360, height = 280 }) {
  container.textContent = "";

  const palette = getVizPalette();
  const margin = { top: 16, right: 16, bottom: 34, left: 44 };
  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", "100%");

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const plot = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear().domain(xDomain).range([0, plotWidth]);
  const yScale = d3.scaleLinear().domain(yDomain).nice().range([plotHeight, 0]);

  const xAxis = plot
    .append("g")
    .attr("transform", `translate(0,${plotHeight})`)
    .call(d3.axisBottom(xScale).ticks(6));

  const yAxis = plot.append("g").call(d3.axisLeft(yScale).ticks(6));

  styleAxis(xAxis, palette);
  styleAxis(yAxis, palette);

  plot
    .append("line")
    .attr("x1", xScale(xDomain[0]))
    .attr("x2", xScale(xDomain[1]))
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", palette.axisLine);

  plot
    .append("line")
    .attr("x1", xScale(0))
    .attr("x2", xScale(0))
    .attr("y1", yScale(yDomain[0]))
    .attr("y2", yScale(yDomain[1]))
    .attr("stroke", palette.axisLine);

  return { svg, plot, xScale, yScale, plotWidth, plotHeight, palette };
}
