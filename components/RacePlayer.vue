<template>
  <div>
    <div ref="d3Chart"></div>
    <div
      class="hidden flex-col text-sm bg-zinc-800 text-zinc-200 rounded-md py-2 px-3 !m-0"
      ref="tooltip"
    >
      <p><strong>name: </strong>{{ hoverDriverName }}</p>
      <p><strong>team: </strong>{{ hoverDriverTeam }}</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  data: Array,
});
import * as d3 from "d3";

const d3Chart = ref(null);
const tooltip = ref(null);
const data = computed(() => props.data);
const chartInfo = computed(() => {
  const minX = Math.min(...data.value.map((d) => d.drivers[1].x)) - 500;
  const maxX = Math.max(...data.value.map((d) => d.drivers[1].x)) + 500;
  const minY = Math.min(...data.value.map((d) => d.drivers[1].y)) - 500;
  const maxY = Math.max(...data.value.map((d) => d.drivers[1].y)) + 500;
  const width = maxX - minX;
  const height = maxY - minY;

  const scaleFactor = height / 640;

  const scaledWidth = width / scaleFactor;
  const scaledHeight = height / scaleFactor;

  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    scaleFactor,
    scaledWidth,
    scaledHeight,
  };
});

const hoverDriverName = ref("");
const hoverDriverTeam = ref("");

const isRendered = ref(false);
const index = ref(0);

let svg = d3.select(d3Chart.value);
let svgTransform;

const closestPoint = (mousePos, maxDistance) => {
  if (svgTransform) {
    mousePos.x = (mousePos.x - svgTransform.x) / svgTransform.k;
    mousePos.y = (mousePos.y - svgTransform.y) / svgTransform.k;
  }
  let minDistance = Number.MAX_VALUE;
  let driver = null;
  for (const d of Object.keys(data.value[index.value].drivers).map(
    (key) => data.value[index.value].drivers[key],
  )) {
    const dist = Math.sqrt(
      Math.pow(mousePos.x - d.x, 2) + Math.pow(mousePos.y - d.y, 2),
    );
    if (dist < minDistance) {
      minDistance = dist;
      driver = d;
    }
  }
  return maxDistance >= minDistance ? driver : null;
};

const showTooltip = (driver) => {
  hoverDriverName.value = driver.name;
  hoverDriverTeam.value = driver.team;
  const rect = d3
    .select(`#driver-${driver.number}`)
    .node()
    .getBoundingClientRect();
  d3.select(tooltip.value)
    .style("display", "flex")
    .style("position", "absolute");

  const tooltipRect = d3.select(tooltip.value).node().getBoundingClientRect();
  d3.select(tooltip.value)
    .style("left", `${window.scrollX + rect.x - tooltipRect.width / 2}px`)
    .style("top", `${window.scrollY + rect.y - tooltipRect.height - 3}px`);
};

const hideTooltip = () => {
  d3.select(tooltip.value).style("display", "none");
};

const initDriverPoint = (enter, drivers) => {
  return enter
    .append("circle")
    .attr("id", (d) => `driver-${d}`)
    .attr("r", 75)
    .attr("fill", (d) => `#${drivers[d].color}`)
    .attr("cx", (d) => drivers[d].x)
    .attr("cy", (d) => drivers[d].y);
};

const updateDriverPoint = (update, duration, drivers) => {
  return update
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr("cx", (d) => drivers[d].x)
    .attr("cy", (d) => drivers[d].y);
};

const renderRace = () => {
  const { minX, maxX, minY, maxY, scaledWidth, scaledHeight, width, height } =
    chartInfo.value;

  let zoom = d3
    .zoom()
    .scaleExtent([1, 7])
    .translateExtent([
      [minX, minY],
      [minX + width, minY + height],
    ])
    .on("zoom", (e) => {
      if (svg) {
        svgTransform = e.transform;
        svg.attr("transform", e.transform);
        svg
          .selectAll("g>circle")
          .attr("r", e.transform.k >= 2 ? 150 / e.transform.k : 75);
      }
    });

  svg = d3
    .select(d3Chart.value)
    .append("svg")
    .attr("width", `${scaledWidth}px`)
    .attr("height", `${scaledHeight}px`)
    .attr("viewBox", `${minX} ${minY} ${width} ${height}`)
    .call(zoom)
    .on("mouseover", (event) => {
      const [x, y] = d3.pointer(event);
      const closestDriver = closestPoint({ x, y }, 125);
      if (closestDriver) {
        showTooltip(closestDriver);
      }
    })
    .on("mousemove", (event) => {
      const [x, y] = d3.pointer(event);
      const closestDriver = closestPoint({ x, y }, 125);
      if (closestDriver) {
        console.log(closestDriver);
        showTooltip(closestDriver);
      } else {
        hideTooltip();
      }
    })
    .append("g");

  const path = d3.path();
  path.moveTo(data.value[0].drivers[1].x, data.value[0].drivers[1].y);
  for (const point of data.value.slice(1)) {
    path.lineTo(point.drivers[1].x, point.drivers[1].y);
  }

  svg
    .append("path")
    .attr("d", path.toString())
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", "5px");

  svg
    .selectAll("g>circle")
    .data(Object.keys(data.value[0].drivers))
    .join((enter) => initDriverPoint(enter, data.value[0].drivers));

  setTimeout(updateRace, 0);
};

const updateRace = () => {
  index.value++;
  const { drivers } = data.value[index.value];
  const duration =
    data.value[index.value].timestamp - data.value[index.value - 1].timestamp;

  svg
    .selectAll("g>circle")
    .data(Object.keys(drivers))
    .join(
      (enter) => initDriverPoint(enter, drivers),
      (update) => updateDriverPoint(update, duration, drivers),
    );

  setTimeout(updateRace, duration);
};

watch(data, () => {
  renderRace();
});
</script>
