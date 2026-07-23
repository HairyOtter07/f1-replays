<template>
    <div
        ref="slider"
        class="relative flex flex-row items-center gap-0 hover:cursor-pointer"
        @mousedown="onMouseDown"
    >
        <div :style="`width: calc(100% * ${widthFraction});`">
            <slot name="selected-range" />
        </div>
        <div ref="handle" class="absolute">
            <slot name="handle" />
        </div>
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
const emit = defineEmits(["slideStart", "slideEnd"]);

const slider = ref(null);
const handle = ref(null);

const widthFraction = computed(
    () => (current.value - props.min) / (props.max - props.min),
);

watch(widthFraction, () => {
    const handleRect = handle.value.getBoundingClientRect();
    const handleWidth = handleRect.right - handleRect.left;

    handle.value.style.left = `calc(100% * ${widthFraction.value} - ${handleWidth / 2}px`;
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
    emit("slideStart");
};

const onMouseMove = (event) => {
    updateSliderPosition(event);
};

const onMouseUp = (event) => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    emit("slideEnd");
};
</script>
