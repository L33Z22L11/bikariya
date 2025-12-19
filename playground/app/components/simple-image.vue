<script lang="ts" setup>
    import type { ImgHTMLAttributes } from "vue";
    import { LazyImageViewer } from "#components";

    defineProps<{
        src: ImgHTMLAttributes["src"];
    }>();

    const modalStore = useModalStore();
    const rootComp = useTemplateRef("root");
    const rootEl = computed<HTMLImageElement>(() => rootComp.value?.imgEl);

    const { open } = modalStore.use(() => h(LazyImageViewer, {
        target: rootEl.value,
    }));
</script>

<template>
    <nuxt-img ref="root" :src @click="open"/>
</template>
