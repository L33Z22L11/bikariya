<script lang="ts" setup>
    defineProps<{
        isOpening?: boolean;
    }>();
    defineEmits<{
        close: [];
    }>();
</script>

<template>
    <transition>
        <div v-if="isOpening" class="simple-modal">
            <span>I'm simple modal.</span>
            <button @click="$emit(`close`)">close</button>
        </div>
    </transition>
</template>

<style scoped>
    .simple-modal {
        display: flex;
        align-items: center;
        gap: 8px;
        position: fixed;
        inset: 0;
        width: fit-content;
        height: fit-content;
        margin: auto;
        padding: 8px;
        border: 1px solid black;

        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }
</style>
