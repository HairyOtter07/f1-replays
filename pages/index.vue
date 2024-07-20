<template>
  <div>
    <h1 class="text-4xl">Hello, World!</h1>
  </div>
</template>
<script setup>
import pako from "pako";
import { Buffer } from "buffer";

// const race = "2023-09-17_Singapore"
// const race = "2024-07-07_British"
const race = "2024-06-23_Spanish";

const sessionToComponents = (sessionTimestamp) => {
  let [h, m, sms] = sessionTimestamp.split(":");
  let [s, ms] = sms.split(".");
  return [Number(h), Number(m), Number(s), Number(ms)];
}

const getInitialTime = async () => {
  const { data } = await useFetch(
    `https://livetiming.formula1.com/static/${race.split("-")[0]}/${race}_Grand_Prix/${race.split("_")[0]}_Race/Heartbeat.jsonStream`,
    {
      responseType: "text",
    },
  );

  const heartbeatRecord = data.value.split("\r\n")[0];
  const [sessionTimestamp, raw] = [
    heartbeatRecord.slice(0, heartbeatRecord.indexOf("{")),
    heartbeatRecord.slice(heartbeatRecord.indexOf("{")),
  ];

  const [firstHours, firstMinutes, firstSeconds, firstMilliseconds] = sessionToComponents(sessionTimestamp);
  const heartbeat = new Date(JSON.parse(raw).Utc);
  const t0 = new Date(new Date(heartbeat).setUTCHours(heartbeat.getUTCHours() - firstHours, heartbeat.getUTCMinutes() - firstMinutes, heartbeat.getUTCSeconds() - firstSeconds, heartbeat.getUTCMilliseconds() - firstMilliseconds));
  return t0;
}

const sessionToUtc = (sessionTimestamp, initialTime) => {
  const [h, m, s, ms] = sessionToComponents(sessionTimestamp);
  const utc = new Date(new Date(initialTime).setUTCHours(initialTime.getUTCHours() + h, initialTime.getUTCMinutes() + m, initialTime.getUTCSeconds() + s, initialTime.getUTCMilliseconds() + ms));
  return utc;
}

const t0 = await getInitialTime();

const fetchEndpoint = async (endpoint) => {
  const { data } = await useFetch(
    `https://livetiming.formula1.com/static/${race.split("-")[0]}/${race}_Grand_Prix/${race.split("_")[0]}_Race/${endpoint}`,
    {
      responseType: "text",
    },
  );
  if (data.value.startsWith("<Error>")) {
    return {
      error: `Error fetching data: endpoint "${endpoint}" not found.`,
    };
  }

  if (/\.json$/.test(endpoint)) {
    return JSON.parse(data.value);
  } else if (/\.z\.jsonStream$/.test(endpoint)) {
    const records = data.value.split('"\r\n').slice(0, -1);
    let out = [];
    for (const record of records) {
      const [sessionTimestamp, rawData] = record.split('"');
      const decompressed = pako.inflateRaw(Buffer.from(rawData, "base64"), {
        to: "string",
      });
      out.push({ timestamp: sessionToUtc(sessionTimestamp, t0), data: JSON.parse(decompressed) });
    }
    return out;
  } else {
    //.jsonStream
    const records = data.value.split("\r\n").slice(0, -1);
    let out = [];
    for (const record of records) {
      const [sessionTimestamp, raw] = [
        record.slice(0, record.indexOf("{")),
        record.slice(record.indexOf("{")),
      ];
      out.push({ timestamp: sessionToUtc(sessionTimestamp, t0), data: JSON.parse(raw) });
    }
    return out;
  }
};
</script>