<template>
    <div
        ref="slider"
        class="relative flex flex-row items-center w-full gap-0 h-2 bg-zinc-500 rounded-md hover:cursor-pointer"
        @mousedown="onMouseDown"
    >
        <div :style="`width: calc(100% * ${widthFraction});`">
            <SliderSelected />
        </div>
        <SliderHandle ref="handleRef" class="absolute" />
    </div>
</template>
<script setup>
const min = 0;
const max = 1000;
const current = ref(500);
const slider = ref(null);
const handleRef = ref(null);
const handleEl = computed(() =>
    handleRef.value ? handleRef.value.$el : undefined,
);

const widthFraction = computed(() => (current.value - min) / (max - min));

const updateSliderPosition = (event) => {
    const sliderRect = slider.value.getBoundingClientRect();
    const fraction =
        (event.clientX - sliderRect.left) /
        (sliderRect.right - sliderRect.left);

    const handleRect = handleEl.value.getBoundingClientRect();
    const handleWidth = handleRect.right - handleRect.left;

    const tentativeValue = fraction * (max - min) + min;
    if (tentativeValue < min) {
        current.value = min;
        handleEl.value.style.left = `calc(0% - ${handleWidth / 2}px`;
    } else if (tentativeValue > max) {
        current.value = max;
        handleEl.value.style.left = `calc(100% - ${handleWidth / 2}px`;
    } else {
        current.value = tentativeValue;
        handleEl.value.style.left = `calc(100% * ${fraction} - ${handleWidth / 2}px`;
    }
};

const onMouseDown = (event) => {
    event.preventDefault();

    updateSliderPosition(event);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (event) => {
    updateSliderPosition(event);
};

const onMouseUp = (event) => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
};

onMounted(() => {
    const handleRect = handleEl.value.getBoundingClientRect();
    const handleWidth = handleRect.right - handleRect.left;
    handleEl.value.style.left = `calc(100% * ${widthFraction.value} - ${handleWidth / 2}px`;
});
</script>
