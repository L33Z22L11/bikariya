import { addComponent, addImportsDir, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export default defineNuxtModule({
    meta: {
        name: packageJson.name,
        configKey: "modals",
    },
    moduleDependencies: {
        "@bikariya/core": {},
    },
    setup() {
        const resolver = createResolver(import.meta.url);

        addImportsDir(resolver.resolve("runtime/stores"));

        addComponent({
            name: "BikariyaModals",
            filePath: resolver.resolve("runtime/modals.vue"),
        });
    },
});
