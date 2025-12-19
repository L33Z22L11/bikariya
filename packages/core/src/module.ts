import { addImportsDir, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export default defineNuxtModule({
    meta: {
        name: packageJson.name,
        configKey: "bikariya",
    },
    moduleDependencies: {
        "@pinia/nuxt": {},
        "@vueuse/nuxt": {},
    },
    setup() {
        const resolver = createResolver(import.meta.url);

        addImportsDir(resolver.resolve("runtime/composables"));
    },
});
