// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],

  routeRules: {
    "/dashboard/**": { ssr: false },
    "/inbox/**": { ssr: false },
    "/employees/**": { ssr: false },
    "/settings/**": { ssr: false },
    "/profile/**": { ssr: false },
  },
});
