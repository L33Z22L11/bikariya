import { addImportsSources, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export default defineNuxtModule({
    meta: {
        name: packageJson.name,
        configKey: "shiki",
    },
    moduleDependencies: {
        "@bikariya/core": {},
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        addImportsSources({
            from: resolver.resolve("runtime/store"),
            imports: [
                "useShikiStore",
            ],
        });

        nuxt.options.alias["#shiki/config"] = resolver.resolve("runtime/config");
    },
});
