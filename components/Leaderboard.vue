<template>
    <div class="flex flex-col w-full items-start text-zinc-800">
        <div
            class="flex items-center w-full p-0 justify-start h-10"
            v-for="driver in drivers"
            :key="driver.name"
        >
            <!-- <img :src="driver.image" /> -->
            <div
                class="w-2 h-full"
                :style="`background-color: #${driver.color}`"
            ></div>
            <p class="w-8 p-2 bg-zinc-200">{{ driver.position }}</p>
            <div class="flex w-full p-2 bg-zinc-200 justify-between">
                <p class="text-base">{{ driver.name }}</p>
                <p class="text-base">{{ Math.round(driver.speed) }} km/h</p>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps({
    drivers: Array,
});
</script>
