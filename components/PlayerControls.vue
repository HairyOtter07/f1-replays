<template>
    <div class="flex w-full space-x-4 items-center">
        <Icon
            :icon="isPlaying ? 'mdi:pause' : 'mdi:play'"
            class="w-8 h-8 hover:cursor-pointer"
            @click="togglePlayback"
        />
        <Slider
            v-model="index"
            class="flex items-center w-full h-2 bg-zinc-500 rounded-md hover:cursor-pointer"
            :min="0"
            :max="dataLength - 1"
            :step="1"
            pt:range="!relative h-2 bg-red-500 rounded-l-md"
            pt:handle="!relative !-left-2 w-4 h-4 bg-zinc-900 rounded-full"
            @mousedown="handleMouseDown"
        />
    </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import Slider from "primevue/slider";

const props = defineProps({
    dataLength: Number,
});

const originalState = ref(false);

const isPlaying = defineModel("isPlaying", { default: true });
const index = defineModel("index", { default: 0 });

const handleMouseDown = () => {
    originalState.value = isPlaying.value;
    isPlaying.value = false;
    document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseUp = () => {
    isPlaying.value = originalState.value;
    cleanupMouseUp();
};

const cleanupMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp);
};

const togglePlayback = () => {
    isPlaying.value = !isPlaying.value;
};
</script>
