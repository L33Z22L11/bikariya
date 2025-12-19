<script lang="ts" setup>
    import { overlayClass } from "#build/nuxt-modal.mjs";

    const modalStore = useModalStore();
    const { modals } = storeToRefs(modalStore);
</script>

<template>
    <template v-for="{ vnode, zIndex, isOpening, close } in modals" :key="zIndex">
        <transition>
            <div
                v-if="isOpening.value"
                :class="overlayClass"
                :style="{ zIndex: zIndex - 1 }"
                @click="close.value"
            ></div>
        </transition>
        <component :is="vnode.value" :is-opening="isOpening.value" :style="{ zIndex }"/>
    </template>
</template>
