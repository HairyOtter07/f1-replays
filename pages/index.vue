<template>
  <div class="w-full h-full">
    <RaceWrapper class="h-full" :race="race" />
  </div>
</template>
<script setup>
const race = ref("2024-06-23_Spanish");

setTimeout(() => {
  race.value = "2023-09-17_Singapore";
}, 25000);
// "2023-09-03_Italian"
// "2023-09-17_Singapore"
// "2024-05-26_Monaco"
// "2024-06-23_Spanish"
// "2024-06-30_Austrian"
// "2024-07-07_British"
</script>
