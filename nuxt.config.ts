// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module"
  ],
  nitro: {
    routeRules: {
      "/api/**": { proxy: "https://livetiming.formula1.com/static/**" }
    }
  },
  primevue: {
    options: {
      unstyled: true
    }
  }
})