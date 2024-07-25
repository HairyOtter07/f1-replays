<template>
  <div
    class="hidden flex-col text-sm bg-zinc-800 text-zinc-200 rounded-md py-2 px-3 !m-0"
    ref="tooltip"
  >
    <p><strong>name: </strong>{{ name }}</p>
    <p><strong>team: </strong>{{ team }}</p>
  </div>
</template>
<script setup>
defineProps({
  name: String,
  team: String,
});
</script>