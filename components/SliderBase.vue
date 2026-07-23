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
        <!-- <p class="pl-4">{{ current }}</p> -->
    </div>
</template>
<script setup>
const props = defineProps({
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
    step: {
        type: Number,
        required: true,
    },
});
const current = defineModel({ required: true });
const slider = ref(null);
const handleRef = ref(null);
const handleEl = computed(() =>
    handleRef.value ? handleRef.value.$el : undefined,
);

const widthFraction = computed(
    () => (current.value - props.min) / (props.max - props.min),
);
watch(widthFraction, () => {
    const handleRect = handleEl.value.getBoundingClientRect();
    const handleWidth = handleRect.right - handleRect.left;

    handleEl.value.style.left = `calc(100% * ${widthFraction.value} - ${handleWidth / 2}px`;
});

const calcClosestStep = (value) => {
    const base = value - props.min;
    const mod = base % props.step;
    if (mod >= props.step / 2) {
        return base + (props.step - mod);
    }
    return base - mod;
};

const updateSliderPosition = (event) => {
    const sliderRect = slider.value.getBoundingClientRect();
    const fraction =
        (event.clientX - sliderRect.left) /
        (sliderRect.right - sliderRect.left);

    const tentativeValue = fraction * (props.max - props.min) + props.min;
    if (tentativeValue < props.min) {
        current.value = props.min;
    } else if (tentativeValue > props.max) {
        current.value = props.max;
    } else {
        current.value = calcClosestStep(tentativeValue);
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
