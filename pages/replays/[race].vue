<template>
  <div class="flex flex-col items-center w-full h-full">
    <RaceWrapper class="w-full h-full" :race="race" />
  </div>
</template>
<script setup>
const { race } = useRoute().params;
</script>