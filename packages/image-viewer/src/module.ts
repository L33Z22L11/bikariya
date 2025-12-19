import { addComponent, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export default defineNuxtModule({
    meta: {
        name: packageJson.name,
        configKey: "image-viewer",
    },
    moduleDependencies: {
        "@bikariya/modals": {},
    },
    setup() {
        const resolver = createResolver(import.meta.url);

        addComponent({
            name: "BikariyaImageViewer",
            filePath: resolver.resolve("runtime/image-viewer.vue"),
        });
    },
});
