<template>
  <div>
    <div class="flex items-center justify-center w-full h-full" :class="!isLoading && 'hidden'">
      <p>{{ loadingMessage }}</p>
    </div>
    <div :class="isLoading && 'hidden'">
      <RacePlayer :data="raceData" />
    </div>
  </div>
</template>
<script setup>
import pako from "pako";
import { Buffer } from "buffer";

const props = defineProps({
  race: String
});

const race = computed(() => props.race);
const raceData = ref([]);

const t0 = ref(null);

const loadingMessage = ref("Loading...");
const isLoading = ref(true);

const reactToRef = (reference, handler, handlerArgs = []) => {
  if (reference.value) {
    handler(...handlerArgs);
  } else {
    watch(reference, () => {
      handler(...handlerArgs);
    }, {
      once: true
    });
  }
};

const sessionToComponents = (sessionTimestamp) => {
  let [h, m, sms] = sessionTimestamp.split(":");
  let [s, ms] = sms.split(".");
  return [Number(h), Number(m), Number(s), Number(ms)];
};

const getInitialTime = () => {
  const { data } = useLazyAsyncData("heartbeat", async () => {
    const res = await $fetch(
      `/api/${race.value.split("-")[0]}/${race.value}_Grand_Prix/${race.value.split("_")[0]}_Race/Heartbeat.jsonStream`,
      {
        responseType: "text",
      },
    );
    return res;
  });

  const t0 = ref(null);

  const heartbeatHandler = () => {
    const heartbeatRecord = data.value.split("\r\n")[0];
    const [sessionTimestamp, raw] = [
      heartbeatRecord.slice(0, heartbeatRecord.indexOf("{")),
      heartbeatRecord.slice(heartbeatRecord.indexOf("{")),
    ];

    const [firstHours, firstMinutes, firstSeconds, firstMilliseconds] =
      sessionToComponents(sessionTimestamp);
    console.log(JSON.parse(raw));
    console.log(sessionTimestamp);
    console.log(sessionToComponents(sessionTimestamp));
    const heartbeat = new Date(JSON.parse(raw).Utc);
    t0.value = new Date(
      new Date(heartbeat).setUTCHours(
        heartbeat.getUTCHours() - firstHours,
        heartbeat.getUTCMinutes() - firstMinutes,
        heartbeat.getUTCSeconds() - firstSeconds,
        heartbeat.getUTCMilliseconds() - firstMilliseconds,
      ),
    );
  };

  reactToRef(data, heartbeatHandler);

  return t0;
};

const sessionToUtc = (sessionTimestamp, initialTime) => {
  const [h, m, s, ms] = sessionToComponents(sessionTimestamp);
  const utc = new Date(
    new Date(initialTime).setUTCHours(
      initialTime.getUTCHours() + h,
      initialTime.getUTCMinutes() + m,
      initialTime.getUTCSeconds() + s,
      initialTime.getUTCMilliseconds() + ms,
    ),
  );
  return utc;
};

t0.value = getInitialTime();

const fetchEndpoint = (endpoint) => {
  const { data, status, error } = useLazyAsyncData(endpoint, async () => {
    const res = await $fetch(
      `/api/${race.value.split("-")[0]}/${race.value}_Grand_Prix/${race.value.split("_")[0]}_Race/${endpoint}`,
      {
        responseType: "text",
      },
    );
    return res;
  });

  const parsed = ref(null);

  watch(data, () => {
    if (data.value.startsWith("<Error>")) {
      return {
        error: `Error fetching data: endpoint "${endpoint}" not found.`,
      };
    }

    if (/\.json$/.test(endpoint)) {
      parsed.value = JSON.parse(data.value);
    } else if (/\.z\.jsonStream$/.test(endpoint)) {
      const records = data.value.split('"\r\n').slice(0, -1);
      let out = [];
      for (const record of records) {
        const [sessionTimestamp, rawData] = record.split('"');
        const decompressed = pako.inflateRaw(Buffer.from(rawData, "base64"), {
          to: "string",
        });
        out.push({
          timestamp: sessionToUtc(sessionTimestamp, t0.value.value),
          data: JSON.parse(decompressed),
        });
      }
      parsed.value = out;
    } else {
      //.jsonStream
      const records = data.value.split("\r\n").slice(0, -1);
      let out = [];
      for (const record of records) {
        const [sessionTimestamp, raw] = [
          record.slice(0, record.indexOf("{")),
          record.slice(record.indexOf("{")),
        ];
        out.push({
          timestamp: sessionToUtc(sessionTimestamp, t0.value.value),
          data: JSON.parse(raw),
        });
      }
      parsed.value = out;
    }
  });

  return parsed;
};

const endpoints = [
  "SessionStatus.jsonStream",
  "LapCount.jsonStream",
  "TimingData.jsonStream",
  "DriverList.json",
  "Position.z.jsonStream",
  "CarData.z.jsonStream",
];

const fetchAllEndpoints = (endpoints) => {
  const data = ref(null);
  const status = ref(false);

  const endpoint = endpoints[0].split(".")[0].toLowerCase();

  if (endpoints.length > 1) {
    const fetchedData = fetchEndpoint(endpoints[0]);
    reactToRef(fetchedData, () => {
      const { data: rest } = fetchAllEndpoints(endpoints.slice(1));
      reactToRef(rest, () => {
        const combined = [{ endpoint, data: fetchedData.value }, ...rest.value];
        data.value = combined;
        status.value = true;
        console.log(data.value);
      });
    });
  } else {
    const fetchedData = fetchEndpoint(endpoints[0]);
    reactToRef(fetchedData, () => {
      data.value = [{ endpoint, data: fetchedData.value }];
      status.value = true;
    });
  }

  return { data, status };
};

const interpolateValue = (min, max, percent) => {
  if (min == max) return min;
  return min + (max - min) * percent;
};

const processData = async (dataArray) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sessionStatus = dataArray.find(
    (e) => e.endpoint == "sessionstatus",
  ).data;
  const lapCount = dataArray.find((e) => e.endpoint == "lapcount").data;
  const timingData = dataArray
    .find((e) => e.endpoint == "timingdata")
    .data.filter(
      (e) =>
        Object.keys(e.data.Lines)
          .map((key) => e.data.Lines[key])
          .filter((e) => Object.keys(e).includes("Line")).length > 0,
    );
  const driverList = dataArray.find((e) => e.endpoint == "driverlist").data;
  const position = dataArray.find((e) => e.endpoint == "position").data;
  const carData = dataArray.find((e) => e.endpoint == "cardata").data;

  const data = [];

  const startTime = sessionStatus.find(
    (e) => e.data.Status == "Started",
  ).timestamp;
  const endTime = sessionStatus.find((e) => e.data.Status == "Ends").timestamp;

  const flattenedPosition = (() => {
    const out = [];
    for (const record of position) {
      if (record.timestamp < startTime || record.timestamp > endTime) {
        continue;
      }

      for (const pos of record.data.Position) {
        out.push({
          sessionTime: record.timestamp,
          timestamp: new Date(pos.Timestamp),
          data: pos.Entries,
        });
      }
    }
    return out;
  })();

  const flattenedCarData = (() => {
    const out = [];
    for (const record of carData) {
      if (record.timestamp < startTime || record.timestamp > endTime) {
        continue;
      }

      for (const entry of record.data.Entries) {
        out.push({
          sessionTime: record.timestamp,
          timestamp: new Date(entry.Utc),
          data: entry.Cars,
        });
      }
    }
    return out;
  })();

  const leaderboard = {};
  for (const key of Object.keys(driverList)) {
    leaderboard[key] = 0;
  }

  let posIndex = 0;
  let carIndex = 0;
  let lap = 0;
  let leaderboardIndex = 0;
  let lastUpdate = new Date();

  while (
    posIndex < flattenedPosition.length ||
    carIndex < flattenedCarData.length
  ) {
    const driversData = {};
    let timestamp = new Date();
    let sessionTime = new Date();

    if (
      carIndex >= flattenedCarData.length ||
      (posIndex < flattenedPosition.length &&
        flattenedPosition[posIndex].timestamp <
          flattenedCarData[carIndex].timestamp)
    ) {
      const pos = flattenedPosition[posIndex];
      const prevCarData =
        carIndex > 0 ? flattenedCarData[carIndex - 1] : flattenedCarData[0];
      const nextCarData =
        carIndex < flattenedCarData.length
          ? flattenedCarData[carIndex]
          : flattenedCarData[flattenedCarData.length - 1];
      timestamp = pos.timestamp;
      sessionTime = pos.sessionTime;

      for (const driverKey of Object.keys(pos.data)) {
        if (
          !Object.keys(driverList).includes(driverKey) ||
          !Object.keys(prevCarData.data).includes(driverKey) ||
          !Object.keys(nextCarData.data).includes(driverKey)
        )
          continue;

        const interpolatedSpeed = interpolateValue(
          prevCarData.data[driverKey].Channels[2],
          nextCarData.data[driverKey].Channels[2],
          (timestamp - prevCarData.timestamp) /
            (nextCarData.timestamp - prevCarData.timestamp),
        );

        if (
          Object.keys(timingData[leaderboardIndex].data.Lines).includes(
            driverKey,
          ) &&
          Object.keys(
            timingData[leaderboardIndex].data.Lines[driverKey],
          ).includes("Line")
        ) {
          leaderboard[driverKey] =
            timingData[leaderboardIndex].data.Lines[driverKey].Line;
        }

        const driver = driverList[driverKey];

        driversData[driverKey] = {
          x: pos.data[driverKey].X,
          y: -pos.data[driverKey].Y,
          speed: interpolatedSpeed,
          position: leaderboard[driverKey],
          color: driver.TeamColour,
          name: driver.FullName,
          number: driver.RacingNumber,
          team: driver.TeamName,
          image: driver.HeadshotUrl,
        };
      }

      posIndex++;
    } else {
      const car = flattenedCarData[carIndex];
      const prevPos =
        posIndex > 0 ? flattenedPosition[posIndex - 1] : flattenedPosition[0];
      const nextPos =
        posIndex < flattenedPosition.length
          ? flattenedPosition[posIndex]
          : flattenedPosition[flattenedPosition.length - 1];
      timestamp = car.timestamp;
      sessionTime = car.sessionTime;

      for (const driverKey of Object.keys(car.data)) {
        if (
          !Object.keys(driverList).includes(driverKey) ||
          !Object.keys(prevPos.data).includes(driverKey) ||
          !Object.keys(nextPos.data).includes(driverKey)
        )
          continue;

        const interpolatedX = interpolateValue(
          prevPos.data[driverKey].X,
          nextPos.data[driverKey].X,
          (timestamp - prevPos.timestamp) /
            (nextPos.timestamp - prevPos.timestamp),
        );
        const interpolatedY = interpolateValue(
          prevPos.data[driverKey].Y,
          nextPos.data[driverKey].Y,
          (timestamp - prevPos.timestamp) /
            (nextPos.timestamp - prevPos.timestamp),
        );

        if (
          Object.keys(timingData[leaderboardIndex].data.Lines).includes(
            driverKey,
          ) &&
          Object.keys(
            timingData[leaderboardIndex].data.Lines[driverKey],
          ).includes("Line")
        ) {
          leaderboard[driverKey] =
            timingData[leaderboardIndex].data.Lines[driverKey].Line;
        }

        const driver = driverList[driverKey];

        driversData[driverKey] = {
          x: interpolatedX,
          y: -interpolatedY,
          speed: car.data[driverKey].Channels[2],
          position: leaderboard[driverKey],
          color: driver.TeamColour,
          name: driver.FullName,
          number: driver.RacingNumber,
          team: driver.TeamName,
          image: driver.HeadshotUrl,
        };
      }

      carIndex++;
    }

    if (lap < lapCount.length && lapCount[lap].timestamp < sessionTime) {
      lap++;
    }

    if (
      leaderboardIndex + 1 < timingData.length &&
      timingData[leaderboardIndex + 1].timestamp < sessionTime
    ) {
      leaderboardIndex++;
    }

    data.push({
      timestamp,
      drivers: driversData,
      lap,
    });

    if (new Date() - lastUpdate > 150) {
      lastUpdate = new Date();
      loadingMessage.value = `Processing...${posIndex + carIndex}/${flattenedPosition.length + flattenedCarData.length}`;
      await delay(0);
    }
  }

  console.log(data);
  return data;
};

const loadData = () => {
  const { data, status } = fetchAllEndpoints(endpoints);
  reactToRef(status, async () => {
    if (status.value) {
      const d = await processData(data.value);
      loadingMessage.value = "Rendering...";
      setTimeout(() => {
        raceData.value = d
        isLoading.value = false;
      }, 0);
    }
  });
};

reactToRef(t0.value, loadData);

watch(race, () => {
  isLoading.value = true;
  loadingMessage.value = "Loading...";
  setTimeout(() => raceData.value = [], 0);
  t0.value = getInitialTime();
  reactToRef(t0.value, loadData);
})
</script>
