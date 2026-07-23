<template>
    <div class="flex w-full space-x-4 items-center">
        <Icon
            :icon="isPlaying ? 'mdi:pause' : 'mdi:play'"
            class="w-8 h-8 hover:cursor-pointer"
            @click="togglePlayback"
        />
        <!-- <PrimeSlider
            v-model="index"
            class="flex items-center w-full h-2 bg-zinc-500 rounded-md hover:cursor-pointer"
            :min="0"
            :max="dataLength - 1"
            :step="1"
            pt:range="!relative h-2 bg-red-500 rounded-l-md"
            pt:handle="!relative !-left-2 w-4 h-4 bg-zinc-900 rounded-full"
            @mousedown="handleMouseDown"
        /> -->
        <Slider
            v-model="index"
            class="w-full h-2 bg-zinc-500 rounded-md"
            :min="0"
            :max="dataLength - 1"
            :step="1"
            @slide-start="handleSlideStart"
            @slide-end="handleSlideEnd"
        >
            <template #selected-range>
                <div class="h-2 bg-red-500 rounded-md" />
            </template>
            <template #handle>
                <div class="w-4 h-4 bg-zinc-900 rounded-full" />
            </template>
        </Slider>
    </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
    dataLength: Number,
});

const emit = defineEmits(["pause", "play"]);

const index = defineModel({ default: 0 });

const externalPause = () => {
    isPlaying.value = false;
};
defineExpose({
    externalPause,
});

const originalState = ref(false);
const isPlaying = ref(false);

const handleSlideStart = () => {
    originalState.value = isPlaying.value;
    isPlaying.value = false;
    emit("pause");
};

const handleSlideEnd = () => {
    // delays here are so that the Slider component can update the index value before RacePlayer attempts to process it
    if (originalState.value) {
        setTimeout(() => emit("play"), 20);
    } else {
        setTimeout(() => {
            emit("play");
            // delay to allow processing a single frame
            setTimeout(() => emit("pause"), 20);
        }, 20);
    }
    isPlaying.value = originalState.value;
};

const togglePlayback = () => {
    if (isPlaying.value) {
        emit("pause");
    } else {
        emit("play");
    }
    isPlaying.value = !isPlaying.value;
};
</script>
