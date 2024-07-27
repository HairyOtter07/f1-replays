<template>
<div class="flex justify-center w-full h-full">
    <Select 
      v-model="year" 
      :options="years" 
      placeholder="Year" 
      class="flex items-center space-x-2 p-2 rounded-lg border-2 border-zinc-300 w-fit hover:bg-zinc-100 hover:cursor-pointer" 
      pt:list="rounded-lg flex flex-col bg-zinc-200 border-2 border-zinc-300 py-1 px-2"
      pt:option="p-1 w-full hover:bg-zinc-300 hover:cursor-pointer"
    />
    <Select 
      v-model="race" 
      :options="races" 
      placeholder="Select a Race" 
      class="flex items-center justify-between p-2 rounded-lg border-2 border-zinc-300 w-full max-w-60 hover:bg-zinc-100 hover:cursor-pointer" 
      pt:list="rounded-lg flex flex-col bg-zinc-200 border-2 border-zinc-300 py-1 px-2 max-h-80 overflow-y-auto"
      pt:option="p-1 w-full hover:bg-zinc-300 hover:cursor-pointer"
    />
    <NuxtLink class="flex items-center px-4 py-2 rounded-lg border-2 border-zinc-300 hover:bg-zinc-100" :to="`/replays/${path}`">
      Go
    </NuxtLink>
  </div>
</template>
<script setup>
import Select from 'primevue/select';

const data = {
  2018: [
    {
      "name": "Bahrain Grand Prix",
      "path": "2018-04-08_Bahrain_Grand_Prix"
    },
    {
      "name": "Chinese Grand Prix",
      "path": "2018-04-15_Chinese_Grand_Prix"
    },
    {
      "name": "Azerbaijan Grand Prix",
      "path": "2018-04-29_Azerbaijan_Grand_Prix"
    },
    {
      "name": "Spanish Grand Prix",
      "path": "2018-05-13_Spanish_Grand_Prix"
    },
    {
      "name": "Monaco Grand Prix",
      "path": "2018-05-27_Monaco_Grand_Prix"
    },
    {
      "name": "Canadian Grand Prix",
      "path": "2018-06-10_Canadian_Grand_Prix"
    },
    {
      "name": "French Grand Prix",
      "path": "2018-06-24_French_Grand_Prix"
    },
    {
      "name": "Austrian Grand Prix",
      "path": "2018-07-01_Austrian_Grand_Prix"
    },
    {
      "name": "British Grand Prix",
      "path": "2018-07-08_British_Grand_Prix"
    },
    {
      "name": "German Grand Prix",
      "path": "2018-07-22_German_Grand_Prix"
    },
    {
      "name": "Hungarian Grand Prix",
      "path": "2018-07-29_Hungarian_Grand_Prix"
    },
    {
      "name": "Belgian Grand Prix",
      "path": "2018-08-26_Belgian_Grand_Prix"
    },
    {
      "name": "Italian Grand Prix",
      "path": "2018-09-02_Italian_Grand_Prix"
    },
    {
      "name": "Singapore Grand Prix",
      "path": "2018-09-16_Singapore_Grand_Prix"
    },
    {
      "name": "Russian Grand Prix",
      "path": "2018-09-30_Russian_Grand_Prix"
    },
    {
      "name": "Japanese Grand Prix",
      "path": "2018-10-07_Japanese_Grand_Prix"
    },
    {
      "name": "United States Grand Prix",
      "path": "2018-10-21_United_States_Grand_Prix"
    },
    {
      "name": "Mexican Grand Prix",
      "path": "2018-10-28_Mexican_Grand_Prix"
    },
    {
      "name": "Brazilian Grand Prix",
      "path": "2018-11-11_Brazilian_Grand_Prix"
    },
    {
      "name": "Abu Dhabi Grand Prix",
      "path": "2018-11-25_Abu_Dhabi_Grand_Prix"
    }
  ],
  2019: [
    {
      "name": "Australian Grand Prix",
      "path": "2019-03-17_Australian_Grand_Prix"
    },
    {
      "name": "Bahrain Grand Prix",
      "path": "2019-03-31_Bahrain_Grand_Prix"
    },
    {
      "name": "Chinese Grand Prix",
      "path": "2019-04-14_Chinese_Grand_Prix"
    },
    {
      "name": "Azerbaijan Grand Prix",
      "path": "2019-04-28_Azerbaijan_Grand_Prix"
    },
    {
      "name": "Spanish Grand Prix",
      "path": "2019-05-12_Spanish_Grand_Prix"
    },
    {
      "name": "Monaco Grand Prix",
      "path": "2019-05-26_Monaco_Grand_Prix"
    },
    {
      "name": "Canadian Grand Prix",
      "path": "2019-06-09_Canadian_Grand_Prix"
    },
    {
      "name": "French Grand Prix",
      "path": "2019-06-23_French_Grand_Prix"
    },
    {
      "name": "Austrian Grand Prix",
      "path": "2019-06-30_Austrian_Grand_Prix"
    },
    {
      "name": "British Grand Prix",
      "path": "2019-07-14_British_Grand_Prix"
    },
    {
      "name": "German Grand Prix",
      "path": "2019-07-28_German_Grand_Prix"
    },
    {
      "name": "Hungarian Grand Prix",
      "path": "2019-08-04_Hungarian_Grand_Prix"
    },
    {
      "name": "Belgian Grand Prix",
      "path": "2019-09-01_Belgian_Grand_Prix"
    },
    {
      "name": "Italian Grand Prix",
      "path": "2019-09-08_Italian_Grand_Prix"
    },
    {
      "name": "Singapore Grand Prix",
      "path": "2019-09-22_Singapore_Grand_Prix"
    },
    {
      "name": "Russian Grand Prix",
      "path": "2019-09-29_Russian_Grand_Prix"
    },
    {
      "name": "Japanese Grand Prix",
      "path": "2019-10-13_Japanese_Grand_Prix"
    },
    {
      "name": "Mexican Grand Prix",
      "path": "2019-10-27_Mexican_Grand_Prix"
    },
    {
      "name": "United States Grand Prix",
      "path": "2019-11-03_United_States_Grand_Prix"
    },
    {
      "name": "Brazilian Grand Prix",
      "path": "2019-11-17_Brazilian_Grand_Prix"
    },
    {
      "name": "Abu Dhabi Grand Prix",
      "path": "2019-12-01_Abu_Dhabi_Grand_Prix"
    }
  ],
  2020: [
    {
      "name": "Austrian Grand Prix",
      "path": "2020-07-05_Austrian_Grand_Prix"
    },
    {
      "name": "Styrian Grand Prix",
      "path": "2020-07-12_Styrian_Grand_Prix"
    },
    {
      "name": "Hungarian Grand Prix",
      "path": "2020-07-19_Hungarian_Grand_Prix"
    },
    {
      "name": "British Grand Prix",
      "path": "2020-08-02_British_Grand_Prix"
    },
    {
      "name": "70th Anniversary Grand Prix",
      "path": "2020-08-09_70th_Anniversary_Grand_Prix"
    },
    {
      "name": "Spanish Grand Prix",
      "path": "2020-08-16_Spanish_Grand_Prix"
    },
    {
      "name": "Belgian Grand Prix",
      "path": "2020-08-30_Belgian_Grand_Prix"
    },
    {
      "name": "Italian Grand Prix",
      "path": "2020-09-06_Italian_Grand_Prix"
    },
    {
      "name": "Tuscan Grand Prix",
      "path": "2020-09-13_Tuscan_Grand_Prix"
    },
    {
      "name": "Russian Grand Prix",
      "path": "2020-09-27_Russian_Grand_Prix"
    },
    {
      "name": "Eifel Grand Prix",
      "path": "2020-10-11_Eifel_Grand_Prix"
    },
    {
      "name": "Portuguese Grand Prix",
      "path": "2020-10-25_Portuguese_Grand_Prix"
    },
    {
      "name": "Emilia Romagna Grand Prix",
      "path": "2020-11-01_Emilia_Romagna_Grand_Prix"
    },
    {
      "name": "Turkish Grand Prix",
      "path": "2020-11-15_Turkish_Grand_Prix"
    },
    {
      "name": "Bahrain Grand Prix",
      "path": "2020-11-29_Bahrain_Grand_Prix"
    },
    {
      "name": "Sakhir Grand Prix",
      "path": "2020-12-06_Sakhir_Grand_Prix"
    },
    {
      "name": "Abu Dhabi Grand Prix",
      "path": "2020-12-13_Abu_Dhabi_Grand_Prix"
    }
  ],
  2021: [
    {
      "name": "Bahrain Grand Prix",
      "path": "2021-03-28_Bahrain_Grand_Prix"
    },
    {
      "name": "Emilia Romagna Grand Prix",
      "path": "2021-04-18_Emilia_Romagna_Grand_Prix"
    },
    {
      "name": "Portuguese Grand Prix",
      "path": "2021-05-02_Portuguese_Grand_Prix"
    },
    {
      "name": "Spanish Grand Prix",
      "path": "2021-05-09_Spanish_Grand_Prix"
    },
    {
      "name": "Monaco Grand Prix",
      "path": "2021-05-23_Monaco_Grand_Prix"
    },
    {
      "name": "Azerbaijan Grand Prix",
      "path": "2021-06-06_Azerbaijan_Grand_Prix"
    },
    {
      "name": "French Grand Prix",
      "path": "2021-06-20_French_Grand_Prix"
    },
    {
      "name": "Styrian Grand Prix",
      "path": "2021-06-27_Styrian_Grand_Prix"
    },
    {
      "name": "Austrian Grand Prix",
      "path": "2021-07-04_Austrian_Grand_Prix"
    },
    {
      "name": "British Grand Prix",
      "path": "2021-07-18_British_Grand_Prix"
    },
    {
      "name": "Hungarian Grand Prix",
      "path": "2021-08-01_Hungarian_Grand_Prix"
    },
    {
      "name": "Belgian Grand Prix",
      "path": "2021-08-29_Belgian_Grand_Prix"
    },
    {
      "name": "Dutch Grand Prix",
      "path": "2021-09-05_Dutch_Grand_Prix"
    },
    {
      "name": "Italian Grand Prix",
      "path": "2021-09-12_Italian_Grand_Prix"
    },
    {
      "name": "Russian Grand Prix",
      "path": "2021-09-26_Russian_Grand_Prix"
    },
    {
      "name": "Turkish Grand Prix",
      "path": "2021-10-10_Turkish_Grand_Prix"
    },
    {
      "name": "United States Grand Prix",
      "path": "2021-10-24_United_States_Grand_Prix"
    },
    {
      "name": "Mexico City Grand Prix",
      "path": "2021-11-07_Mexico_City_Grand_Prix"
    },
    {
      "name": "São Paulo Grand Prix",
      "path": "2021-11-14_São_Paulo_Grand_Prix"
    },
    {
      "name": "Qatar Grand Prix",
      "path": "2021-11-21_Qatar_Grand_Prix"
    },
    {
      "name": "Saudi Arabian Grand Prix",
      "path": "2021-12-05_Saudi_Arabian_Grand_Prix"
    },
    {
      "name": "Abu Dhabi Grand Prix",
      "path": "2021-12-12_Abu_Dhabi_Grand_Prix"
    }
  ],
  2023: [
    {
      "name": "Bahrain Grand Prix",
      "path": "2023-03-05_Bahrain_Grand_Prix"
    },
    {
      "name": "Saudi Arabian Grand Prix",
      "path": "2023-03-19_Saudi_Arabian_Grand_Prix"
    },
    {
      "name": "Australian Grand Prix",
      "path": "2023-04-02_Australian_Grand_Prix"
    },
    {
      "name": "Azerbaijan Grand Prix",
      "path": "2023-04-30_Azerbaijan_Grand_Prix"
    },
    {
      "name": "Miami Grand Prix",
      "path": "2023-05-07_Miami_Grand_Prix"
    },
    {
      "name": "Monaco Grand Prix",
      "path": "2023-05-28_Monaco_Grand_Prix"
    },
    {
      "name": "Spanish Grand Prix",
      "path": "2023-06-04_Spanish_Grand_Prix"
    },
    {
      "name": "Canadian Grand Prix",
      "path": "2023-06-18_Canadian_Grand_Prix"
    },
    {
      "name": "Austrian Grand Prix",
      "path": "2023-07-02_Austrian_Grand_Prix"
    },
    {
      "name": "British Grand Prix",
      "path": "2023-07-09_British_Grand_Prix"
    },
    {
      "name": "Hungarian Grand Prix",
      "path": "2023-07-23_Hungarian_Grand_Prix"
    },
    {
      "name": "Belgian Grand Prix",
      "path": "2023-07-30_Belgian_Grand_Prix"
    },
    {
      "name": "Dutch Grand Prix",
      "path": "2023-08-27_Dutch_Grand_Prix"
    },
    {
      "name": "Italian Grand Prix",
      "path": "2023-09-03_Italian_Grand_Prix"
    },
    {
      "name": "Singapore Grand Prix",
      "path": "2023-09-17_Singapore_Grand_Prix"
    },
    {
      "name": "Japanese Grand Prix",
      "path": "2023-09-24_Japanese_Grand_Prix"
    },
    {
      "name": "Qatar Grand Prix",
      "path": "2023-10-08_Qatar_Grand_Prix"
    },
    {
      "name": "United States Grand Prix",
      "path": "2023-10-22_United_States_Grand_Prix"
    },
    {
      "name": "Mexico City Grand Prix",
      "path": "2023-10-29_Mexico_City_Grand_Prix"
    },
    {
      "name": "São Paulo Grand Prix",
      "path": "2023-11-05_São_Paulo_Grand_Prix"
    },
    {
      "name": "Las Vegas Grand Prix",
      "path": "2023-11-18_Las_Vegas_Grand_Prix"
    },
    {
      "name": "Abu Dhabi Grand Prix",
      "path": "2023-11-26_Abu_Dhabi_Grand_Prix"
    }
  ],
  2024: [
    {
      "name": "Spanish Grand Prix",
      "path": "2024-06-23_Spanish_Grand_Prix"
    },
    {
      "name": "Austrian Grand Prix",
      "path": "2024-06-30_Austrian_Grand_Prix"
    },
    {
      "name": "British Grand Prix",
      "path": "2024-07-07_British_Grand_Prix"
    },
    {
      "name": "Hungarian Grand Prix",
      "path": "2024-07-21_Hungarian_Grand_Prix"
    }
  ]
}

const race = ref(null);
const path = computed(() => race.value ? data[year.value].find((e) => e.name == race.value).path : null);

const year = ref(null);
const years = Object.keys(data).toReversed();

const races = computed(() => year.value ? data[year.value].map(r => r.name) : []);

const go = () => {
    console.log(path.value);
}

watch(year, () => {
    race.value = null;
});
</script>
