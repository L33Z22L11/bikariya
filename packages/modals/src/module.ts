import { addImportsDir, addPlugin, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export interface ModuleOptions {
    overlayClass?: string;
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: packageJson.name,
        configKey: "modal",
    },
    moduleDependencies: {
        "@pinia/nuxt": {},
        "@vueuse/nuxt": {},
    },
    defaults: {
        overlayClass: "bikariya-overlay",
    },
    setup(options) {
        const resolver = createResolver(import.meta.url);

        addImportsDir(resolver.resolve("runtime/stores"));
        addPlugin(resolver.resolve("runtime/plugin.ts"));
        addTemplate({
            filename: "nuxt-modal.mjs",
            getContents: () => /* TS */`
export const overlayClass = \`${options.overlayClass}\`;
`.trimStart(),
        });
    },
});
