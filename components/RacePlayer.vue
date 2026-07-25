<template>
    <div class="flex flex-col w-full p-12 items-center bg-zinc-50">
        <div class="flex w-full justify-between items-center">
            <div class="flex w-full justify-center" ref="d3Chart"></div>
            <div
                class="flex flex-col items-center bg-zinc-200 border-zinc-900 border-[1px] w-full max-w-96 rounded-xl overflow-clip"
            >
                <p class="m-4">Lap {{ currentLap }}/{{ totalLaps }}</p>
                <hr class="w-full border-zinc-900" />
                <Leaderboard
                    :drivers="sortedDrivers"
                    class="h-[400px] overflow-y-auto"
                />
            </div>
        </div>
        <PlayerControls
            ref="controls"
            v-model="index"
            :data-length="data.length"
            :lap-indices="lapIndices"
            @pause="onPause"
            @play="onPlay"
        />
    </div>
    <div
        class="hidden flex-col text-sm bg-zinc-800 text-zinc-200 rounded-md py-2 px-3 !m-0"
        ref="tooltip"
    >
        <p><strong>name: </strong>{{ hoverDriverName }}</p>
        <p><strong>team: </strong>{{ hoverDriverTeam }}</p>
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
    const refDriver = data.value
        ? Object.keys(data.value[0].drivers)[0]
        : undefined;
    const minX =
        Math.min(...data.value.map((d) => d.drivers[refDriver].x)) - 500;
    const maxX =
        Math.max(...data.value.map((d) => d.drivers[refDriver].x)) + 500;
    const minY =
        Math.min(...data.value.map((d) => d.drivers[refDriver].y)) - 500;
    const maxY =
        Math.max(...data.value.map((d) => d.drivers[refDriver].y)) + 500;
    const width = maxX - minX;
    const height = maxY - minY;

    const scaleFactor = Math.max(height / 640, width / 750);

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

const controls = ref(null);
const isRendered = ref(false);
const nextUpdateTimeout = ref(null);
const index = ref(0);
const lapIndices = ref([]);
const sortedDrivers = computed(() =>
    data.value[index.value]
        ? Object.keys(data.value[index.value].drivers)
              .map((key) => data.value[index.value].drivers[key])
              .sort((a, b) => a.position - b.position)
        : [],
);
const currentLap = ref(0);
const totalLaps = computed(() =>
    data.value.length > 0 ? data.value[data.value.length - 1].lap : 0,
);

const onPause = () => {
    if (nextUpdateTimeout.value) {
        clearTimeout(nextUpdateTimeout.value);
    }
    if (svg) {
        svg.selectAll("g>circle").interrupt();
    }
};

const onPlay = () => {
    index.value--;
    updateRace(true);
};

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
                svg.selectAll("g>circle").attr(
                    "r",
                    e.transform.k >= 2 ? 150 / e.transform.k : 75,
                );
            }
        });

    d3.select(d3Chart.value).selectChildren("*").remove();

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
                showTooltip(closestDriver);
            } else {
                hideTooltip();
            }
        })
        .append("g");

    const pathRefDriver = Object.keys(data.value[0].drivers)[0];
    const path = d3.path();
    path.moveTo(
        data.value[0].drivers[pathRefDriver].x,
        data.value[0].drivers[pathRefDriver].y,
    );
    for (const point of data.value.slice(1)) {
        path.lineTo(
            point.drivers[pathRefDriver].x,
            point.drivers[pathRefDriver].y,
        );
    }

    svg.append("path")
        .attr("d", path.toString())
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "5px");

    svg.selectAll("g>circle")
        .data(Object.keys(data.value[0].drivers))
        .join((enter) => initDriverPoint(enter, data.value[0].drivers));
};

const updateRace = (jump = false) => {
    index.value++;
    if (index.value >= data.value.length) {
        index.value = data.value.length - 1;
        controls.value.externalPause();
        return;
    }
    const { timestamp, drivers, lap } = data.value[index.value];
    const duration = jump
        ? 0
        : timestamp - data.value[index.value - 1].timestamp;

    svg.selectAll("g>circle")
        .data(Object.keys(drivers))
        .join(
            (enter) => initDriverPoint(enter, drivers),
            (update) => updateDriverPoint(update, duration, drivers),
        );

    currentLap.value = lap;

    nextUpdateTimeout.value = setTimeout(updateRace, duration);
};

const getLapIndices = () => {
    const indices = [];
    let currentLap = 1;
    for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].lap != currentLap) {
            indices.push(i);
            currentLap++;
        }
    }
    lapIndices.value = indices;
};

watch(data, () => {
    if (data.value.length > 0) {
        renderRace();
        getLapIndices();
    }
});
</script>
