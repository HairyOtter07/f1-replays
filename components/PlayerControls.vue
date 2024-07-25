<template>
  <div class="flex w-full space-x-4 items-center">
    <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-8 h-8" @click="toggleIsPlaying" />
    <Slider 
      v-model="value" 
      class="flex items-center w-full h-2 bg-zinc-500 rounded-md" 
      :step="step"
      pt:range="!relative h-2 bg-red-500 rounded-l-md"
      pt:handle="!relative !left-0 w-4 h-4 bg-zinc-900 rounded-full"
    />
  </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import Slider from "primevue/slider";

const value = ref(0);

const isPlaying = defineModel("isPlaying", { default: true });

const toggleIsPlaying = () => {
  isPlaying.value = !isPlaying.value;
}

const step = 0.1;
</script>