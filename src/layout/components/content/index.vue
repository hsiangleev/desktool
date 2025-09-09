<template>
    <router-view v-slot='{ Component, route }'>
        <template v-if='Component'>
            <transition name='fade-transform' mode='out-in'>
                <keep-alive :include='useStoreLayout.cacheView'>
                    <component
                        :is='wrap(route, Component)'
                        :key='route.fullPath'
                        class='page relative h-full p-3'
                    />
                </keep-alive>
            </transition>
        </template>
    </router-view>
</template>
<script setup lang='ts'>
import type { RouteLocationNormalized } from 'vue-router'

const wrapperMap = new Map()
const wrap = (route:RouteLocationNormalized, component:any) => {
    let wrapper
    // 重点就是这里，这个组件的名字是完全可控的，
    // 只要自己写好逻辑，每次能找到对应的外壳组件就行，完全可以写成任何自己想要的名字.
    // 这就能配合 keep-alive 的 include 属性可控地操作缓存.
    // const wrapperName = route.name || route.fullPath 
    const wrapperName = route.fullPath
    if (wrapperMap.has(wrapperName)) {
        wrapper = wrapperMap.get(wrapperName)
    } else {
        wrapper = {
            name: wrapperName,
            render() {
                return h('div', { }, component)
            }
        }
        wrapperMap.set(wrapperName, wrapper)
    }
    return h(wrapper)
}
</script>

<style scoped>
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.3s;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>