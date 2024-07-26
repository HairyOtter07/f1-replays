<template>
  <div class="flex w-full space-x-4 items-center">
    <Icon
      :icon="isPlaying ? 'mdi:pause' : 'mdi:play'"
      class="w-8 h-8"
      @click="togglePlayback"
    />
    <Slider
      v-model="value"
      class="flex items-center w-full h-2 bg-zinc-500 rounded-md"
      :min="0"
      :max="dataLength - 1"
      :step="1"
      pt:range="!relative h-2 bg-red-500 rounded-l-md"
      pt:handle="!relative !left-0 w-4 h-4 bg-zinc-900 rounded-full"
      @change="updateValue"
    />
  </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import Slider from "primevue/slider";

const props = defineProps({
  dataLength: Number,
});

const value = ref(0);

const isPlaying = defineModel("isPlaying", { default: true });
const index = defineModel("index", { default: 0 });

const updateValue = () => {
  const originalState = isPlaying.value;
  isPlaying.value = false;
  index.value = value.value;
  if (originalState) {
    setTimeout(() => (isPlaying.value = true), 0);
  } else {
    isPlaying.value = true;
    setTimeout(() => (isPlaying.value = false), 0);
  }
};

const togglePlayback = () => {
  isPlaying.value = !isPlaying.value;
};

watch(index, () => {
  value.value = index.value;
});
</script>
