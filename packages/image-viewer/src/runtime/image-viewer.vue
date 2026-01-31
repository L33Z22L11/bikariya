<script lang="ts" setup>
    import type { BaseTransitionProps } from "vue";
    import { computed, ref, useEventListener, usePointer, useTemplateRef } from "#imports";

    const { target, duration = 400, rate = 0.9, clamp } = defineProps<{
        /**
         * 目标 `<img>` 元素
         */
        target: HTMLImageElement;
        /**
         * 过渡动画时长 (ms)
         * @default 400
         */
        duration?: number;
        /**
         * 放大后占窗口比率
         * @default 0.9
         */
        rate?: number;
        /**
         * 是否限制缩放比例
         * @default false
         */
        clamp?: boolean;
        open?: boolean;
    }>();
    const emit = defineEmits<{
        close: [];
    }>();

    const rootEl = useTemplateRef("root");

    // 按下 ESC 键关闭
    useEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            emit("close");
        }
    });

    // 动画配置
    const options = computed<KeyframeAnimationOptions>(() => {
        return {
            duration,
            easing: "ease",
            fill: "forwards",
        };
    });

    interface Pointer {
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
    }

    // 起始位置和尺寸
    let startRect: DOMRect;

    // 起始中心位置
    let startCenter: typeof center.value;

    // 起始两指距离
    let startDistance: typeof distance.value;

    // 指针数据
    const pointers = ref<Record<number, Pointer>>({});

    // 双指数据
    const fingers = computed(() => Object.values(pointers.value).slice(0, 2));

    // 当前中心位置
    const center = computed(() => getCenter("current"));

    // 当前两指距离
    const distance = computed(() => getDistance("current"));

    // 获取中心位置
    function getCenter(mode: "start" | "current") {
        return {
            x: fingers.value.reduce((sum, finger) => sum + finger[`${mode}X`], 0) / fingers.value.length,
            y: fingers.value.reduce((sum, finger) => sum + finger[`${mode}Y`], 0) / fingers.value.length,
        };
    }

    // 获取两指距离
    function getDistance(mode: "start" | "current") {
        const [finger1, finger2] = fingers.value;
        return finger2 ? Math.hypot(
            finger1[`${mode}X`] - finger2[`${mode}X`],
            finger1[`${mode}Y`] - finger2[`${mode}Y`],
        ) : 0;
    }

    // 初始化
    function initialize() {
        for (const pointer of Object.values(pointers.value)) {
            pointer.startX = pointer.currentX;
            pointer.startY = pointer.currentY;
        }

        startRect = rootEl.value!.getBoundingClientRect();
        startCenter = getCenter("start");
        startDistance = getDistance("start");
    }

    // 鼠标拖动时
    const { isHolding } = usePointer(rootEl, {
        onPointerdown(event) {
            pointers.value[event.pointerId] = {
                startX: event.screenX,
                startY: event.screenY,
                currentX: event.screenX,
                currentY: event.screenY,
            };
            initialize();
        },
        onPointermove(event) {
            const pointer = pointers.value[event.pointerId];
            if (!pointer) {
                return;
            }
            pointer.currentX = event.screenX;
            pointer.currentY = event.screenY;

            const rate = distance.value / startDistance || 1;
            const left = startRect.left + center.value.x - startCenter.x;
            const top = startRect.top + center.value.y - startCenter.y;
            const finalLeft = left - (center.value.x - left) * (rate - 1);
            const finalTop = top - (center.value.y - top) * (rate - 1);
            const finalWidth = startRect.width * rate;
            const finalHeight = startRect.height * rate;

            if (isOverLimit(finalWidth, finalHeight, rate)) {
                return;
            }

            rootEl.value!.animate({
                left: finalLeft + "px",
                top: finalTop + "px",
                width: finalWidth + "px",
                height: finalHeight + "px",
            }, {
                duration: 0,
                fill: "forwards",
            });
        },
        onPointerup(event) {
            delete pointers.value[event.pointerId];
            if (Object.keys(pointers.value).length) {
                initialize();
                return false;
            }
        },
    });

    // 鼠标滚动时
    function onWheel(event: WheelEvent) {
        if (isHolding.value) {
            return;
        }

        // 缩放比率
        let rate = 1 + Math.abs(event.deltaY) / (event.ctrlKey ? 20 : 200);
        if (event.deltaY > 0) {
            rate = 1 / rate;
        }

        const { left, top, width, height } = rootEl.value!.getBoundingClientRect();
        const finalLeft = left - (event.clientX - left) * (rate - 1);
        const finalTop = top - (event.clientY - top) * (rate - 1);
        const finalWidth = width * rate;
        const finalHeight = height * rate;

        if (isOverLimit(finalWidth, finalHeight, rate)) {
            return;
        }

        rootEl.value!.animate({
            left: finalLeft + "px",
            top: finalTop + "px",
            width: finalWidth + "px",
            height: finalHeight + "px",
        }, options.value);
    }

    // 鼠标双击时
    function onDoubleClick(event: MouseEvent) {
        const { left, top, width, height } = rootEl.value!.getBoundingClientRect();
        const { size: [coverWidth, coverHeight], advantageSide } = getFitSize("cover");

        if (width < coverWidth && height < coverHeight) {
            const [finalLeft, finalTop] = advantageSide === "height" ? [
                `calc(50% - ${Math.round(coverWidth / 2)}px)`,
                `${top - (event.clientY - top) * (coverHeight / height - 1)}px`,
            ] : [
                `${left - (event.clientX - left) * (coverWidth / width - 1)}px`,
                `calc(50% - ${Math.round(coverHeight / 2)}px)`,
            ];

            rootEl.value!.animate({
                left: finalLeft,
                top: finalTop,
                width: Math.ceil(coverWidth) + "px",
                height: Math.ceil(coverHeight) + "px",
            }, options.value);
        }
        else {
            const { size: [containWidth, containHeight] } = getFitSize("contain");

            rootEl.value!.animate({
                left: `calc(50% - ${Math.round(containWidth / 2)}px)`,
                top: `calc(50% - ${Math.round(containHeight / 2)}px)`,
                width: Math.floor(containWidth) + "px",
                height: Math.floor(containHeight) + "px",
            }, options.value);
        }
    }

    // 打开时
    const onEnter: BaseTransitionProps<HTMLImageElement>["onEnter"] = (el) => {
        const { size: [containWidth, containHeight] } = getFitSize("contain");

        // 移动至屏幕中心
        el.animate([getOriginalKeyframe(), {
            top: `calc(50% - ${Math.round(containHeight / 2)}px)`,
            left: `calc(50% - ${Math.round(containWidth / 2)}px)`,
            width: Math.floor(containWidth) + "px",
            height: Math.floor(containHeight) + "px",
            clipPath: "inset(0)",
        }], options.value);
    };

    // 关闭时
    const onLeave: BaseTransitionProps<HTMLImageElement>["onLeave"] = (el, done) => {
        const { left: elLeft, top: elTop } = el.getBoundingClientRect();
        const { scrollX: x, scrollY: y } = window;

        // 回到原位
        const animation = el.animate([{
            top: 2 * y + elTop + "px",
            left: 2 * x + elLeft + "px",
            clipPath: "inset(0)",
        }, getOriginalKeyframe(x, y)], options.value);

        animation.addEventListener("finish", done);
    };

    // 获取适应尺寸
    function getFitSize(mode: "contain" | "cover") {
        const fixedWidth = window.innerWidth * rate;
        const fixedHeight = window.innerHeight * rate;
        const naturalRatio = target.naturalWidth / target.naturalHeight;
        const advantageSide = fixedWidth / fixedHeight > naturalRatio ? "height" : "width";

        return {
            size: +(advantageSide === "height") ^ +(mode === "cover")
                ? [fixedHeight * naturalRatio, fixedHeight]
                : [fixedWidth, fixedWidth / naturalRatio],
            advantageSide,
        };
    }

    // 获取原始位置动画帧
    function getOriginalKeyframe(x = 0, y = 0) {
        const { left, top, width, height } = target.getBoundingClientRect();
        const { naturalWidth, naturalHeight } = target;
        const { objectPosition } = getComputedStyle(target);
        const [horizontal, vertical] = objectPosition.split(" ").map((pos) => Number(pos.slice(0, -1)) / 100);

        const ratio = width / height;
        const naturalRatio = naturalWidth / naturalHeight;

        let clipTop = 0;
        let clipBottom = 0;
        let clipLeft = 0;
        let clipRight = 0;

        if (ratio > naturalRatio) {
            const fullHeight = naturalHeight * width / naturalWidth;
            clipTop = (fullHeight - height) * vertical;
            clipBottom = fullHeight - height - clipTop;
        }
        else {
            const fullWidth = naturalWidth * height / naturalHeight;
            clipLeft = (fullWidth - width) * horizontal;
            clipRight = fullWidth - width - clipLeft;
        }

        return {
            top: (y + top - clipTop) + "px",
            left: (x + left - clipLeft) + "px",
            width: (width + clipLeft + clipRight) + "px",
            height: (height + clipTop + clipBottom) + "px",
            clipPath: `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`,
        };
    }

    // 尺寸是否超出限制
    function isOverLimit(width: number, height: number, rate: number) {
        if (!clamp) {
            return false;
        }
        if (rate > 1) {
            return width > Math.max(window.innerWidth, target.width, target.naturalWidth)
                && height > Math.max(window.innerHeight, target.height, target.naturalHeight);
        }
        else {
            return width < Math.min(window.innerWidth, target.width, target.naturalWidth)
                && height < Math.min(window.innerHeight, target.height, target.naturalHeight);
        }
    }
</script>

<template>
    <transition @enter="onEnter" @leave="onLeave">
        <img
            v-if="open"
            ref="root"
            class="bikariya-image-viewer"
            :src="target.src"
            :draggable="false"
            @dblclick="onDoubleClick"
            @wheel.prevent="onWheel"
        />
    </transition>
</template>

<style>
    .bikariya-image-viewer {
        position: fixed;
        touch-action: none;

        &.v-leave-active {
            position: absolute;
            pointer-events: none;
        }
    }
</style>
