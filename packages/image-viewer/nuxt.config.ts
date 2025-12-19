export default defineNuxtConfig({
    typescript: {
        tsConfig: {
            compilerOptions: {
                noUncheckedIndexedAccess: false,
                strictFunctionTypes: false,
            },
        },
    },
});
