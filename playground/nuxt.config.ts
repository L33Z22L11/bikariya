export default defineNuxtConfig({
    compatibilityDate: "latest",
    experimental: {
        typescriptPlugin: true,
    },
    future: {
        compatibilityVersion: 5,
    },
    typescript: {
        tsConfig: {
            include: [
                "../../packages/*/src/runtime/**/*",
            ],
        },
        nodeTsConfig: {
            include: [
                "../../packages/*/src/**/*",
            ],
            exclude: [
                "../../packages/*/src/runtime/**/*",
            ],
        },
    },
    modules: [
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "../packages/modals/src/module",
    ],
});
