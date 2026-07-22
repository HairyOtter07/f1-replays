<template>
    <div
        ref="slider"
        class="flex flex-row items-center w-full gap-0 h-2 bg-zinc-500 rounded-md hover:cursor-pointer"
        @mousedown="onMouseDown"
    >
        <div :style="`width: calc(100% * ${widthFraction});`">
            <SliderSelected />
        </div>
        <SliderHandle />
    </div>
</template>
<script setup>
const min = 0;
const max = 1000;
const current = ref(500);
const slider = ref(null);

const widthFraction = computed(() => (current.value - min) / (max - min));

const onMouseDown = (event) => {
    event.preventDefault();
    const rect = slider.value.getBoundingClientRect();
    const clickFraction =
        (event.clientX - rect.left) / (rect.right - rect.left);
    current.value = clickFraction * (max - min) + min;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (event) => {
    const rect = slider.value.getBoundingClientRect();
    const moveFraction = (event.clientX - rect.left) / (rect.right - rect.left);
    current.value = Math.min(
        Math.max(moveFraction * (max - min) + min, min),
        max,
    );
};

const onMouseUp = (event) => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
};
</script>
