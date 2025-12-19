import { addComponent, addImportsDir, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export default defineNuxtModule({
    meta: {
        name: packageJson.name,
        configKey: "modals",
    },
    moduleDependencies: {
        "@bikariya/core": {},
    },
    setup(options) {
        const resolver = createResolver(import.meta.url);

        addImportsDir(resolver.resolve("runtime/stores"));

        addComponent({
            name: "BikariyaModals",
            filePath: resolver.resolve("runtime/modals.vue"),
        });

        addTemplate({
            filename: "nuxt-modal.mjs",
            getContents: () => /* TS */`
export const overlayClass = \`${options.overlayClass}\`;
`.trimStart(),
        });
    },
});
