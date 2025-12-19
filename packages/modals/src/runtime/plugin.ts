import { defineNuxtPlugin } from "nuxt/app";
import { createVNode, render } from "vue";
import Modals from "./modals.vue";

export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.server) {
        return;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);

    const vnode = createVNode(Modals);
    vnode.appContext = nuxtApp.vueApp._context;
    render(vnode, container);
});
