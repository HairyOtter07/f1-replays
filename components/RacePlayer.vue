<template>
  <div>
    <div ref="d3Chart"></div>
  </div>
</template>
<script setup>
const props = defineProps({
  data: Array,
});
import * as d3 from "d3";

const d3Chart = ref(null);
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

const isRendered = ref(false);

let svg = d3.select(d3Chart.value);

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
  console.log(duration);

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
        // svgTransform = e.transform;
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
    // .on("mouseover", (event) => {
    //     const [x, y] = d3.pointer(event);
    //     const closestDriver = closestPoint({x, y}, 125);
    //     if (closestDriver) {
    //         showTooltip(closestDriver);
    //     }
    // })
    // .on("mousemove", (event) => {
    //     const [x, y] = d3.pointer(event);
    //     const closestDriver = closestPoint({x, y}, 125);
    //     if (closestDriver) {
    //         showTooltip(closestDriver);
    //     } else {
    //         hideTooltip();
    //     }
    // })
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

  setTimeout(() => updateRace(1), 0);
};

const updateRace = (i) => {
  const { drivers } = data.value[i];
  const duration = data.value[i].timestamp - data.value[i - 1].timestamp;

  svg
    .selectAll("g>circle")
    .data(Object.keys(drivers))
    .join(
      (enter) => initDriverPoint(enter, drivers),
      (update) => updateDriverPoint(update, duration, drivers),
    );

  setTimeout(() => updateRace(i + 1), duration);
};

watch(data, () => {
  renderRace();
});
</script>
