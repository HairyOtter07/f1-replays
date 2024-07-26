<template>
  <div class="flex flex-col items-center w-full h-full">
    <Select 
      v-model="race" 
      :options="races" 
      placeholder="Select a Race" 
      class="flex items-center justify-between p-2 rounded-lg border-2 border-zinc-300 w-full md:w-56" 
      pt:list="rounded-lg flex flex-col bg-zinc-200 border-2 border-zinc-300 py-1 px-2"
      pt:option="p-1 w-full hover:bg-zinc-300 hover:cursor-pointer"
    />
    <RaceWrapper class="w-full h-full" :race="race" />
  </div>
</template>
<script setup>
import Select from 'primevue/select';

const race = ref("2024-06-23_Spanish");
const selectedRace = ref("2024-06-23_Spanish");

const races = [
  "2023-09-03_Italian",
  "2023-09-17_Singapore",
  "2024-05-26_Monaco",
  "2024-06-23_Spanish",
  "2024-06-30_Austrian",
  "2024-07-07_British",
];

// setTimeout(() => {
//   race.value = "2023-09-17_Singapore";
//   setTimeout(() => {
//     race.value = "2024-05-26_Monaco";
//   }, 20000);
// }, 25000);
// "2023-09-03_Italian"
// "2023-09-17_Singapore"
// "2024-05-26_Monaco"
// "2024-06-23_Spanish"
// "2024-06-30_Austrian"
// "2024-07-07_British"
</script>
