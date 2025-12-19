<script lang="tsx" setup>
    import { LazySimpleModal } from "#components";

    const modalStore = useModalStore();

    const { open } = modalStore.use(() => h(LazySimpleModal));
</script>

<template>
    <button @click="open">Click Me</button>
</template>

<style>
    .bikariya-overlay {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;

        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }
</style>
