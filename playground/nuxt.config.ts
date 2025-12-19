export default defineNuxtConfig({
    compatibilityDate: "latest",
    css: [
        "~/assets/index.scss",
    ],
    experimental: {
        typescriptPlugin: true,
    },
    future: {
        compatibilityVersion: 5,
    },
    modules: [
        "@bikariya/image-viewer",
        "@bikariya/modals",
        "@nuxt/image",
        "@pinia/nuxt",
        "@unocss/nuxt",
        "@vueuse/nuxt",
    ],
});
