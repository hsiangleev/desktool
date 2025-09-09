<template>
    <ul
        v-if='isShow'
        ref='epsMenu'
        class='eps-menu fixed z-10 border rounded-lg py-0.5 text-sm leading-none' 
        :style='{
            "left": `${left}px`,
            "top": `${top}px`,
        }'
    >
        <slot />
    </ul>
</template>
<script setup lang='ts'>
const epsMenu = ref()

const isShow = ref(false)
const left = ref(0)
const top = ref(0)

const bodyClickEvent = (event: MouseEvent) => {
    // 判断如果点击的是菜单，则延时之后再隐藏，防止click事件不触发(mouseup>click)
    if(epsMenu.value?.contains(event.target)) {
        setTimeout(() => isShow.value = false, 0)
    }else{
        isShow.value = false
    }
}
onMounted(() => document.body.addEventListener('mouseup', bodyClickEvent))
onUnmounted(() => document.body.removeEventListener('mouseup', bodyClickEvent))


const updateMenu = (event: MouseEvent) => {
    isShow.value = true
    left.value = event.clientX
    top.value = event.clientY
    nextTick(() => {
        if(!epsMenu.value) return
        if(left.value + epsMenu.value.offsetWidth > window.document.body.offsetWidth) {
            left.value = left.value - epsMenu.value.offsetWidth
        }
        if(top.value + epsMenu.value.offsetHeight > window.document.body.offsetHeight) {
            top.value = top.value - epsMenu.value.offsetHeight
        }
    })
}

defineExpose({
    updateMenu,
    isShow
})
</script>

<style scoped>
    .eps-menu {
        min-width: 100px;
        background-color: var(--el-color-white);
        box-shadow: var(--el-box-shadow-light);
        border: 1px solid var(--el-border-color-light);
        z-index: 1000;

        :deep(li) {
            color: var(--el-color-black);
            padding: 8px 16px;
            cursor: pointer;

            &:hover {
                background-color: var(--el-color-primary-light-7);
                color: var(--el-color-primary);
            }
        }
    }
</style>