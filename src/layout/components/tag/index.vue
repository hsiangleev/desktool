<template>
    <el-scrollbar ref='scrollbarRef' @wheel.prevent='handleScroll'>
        <div class='whitespace-nowrap'>
            <el-tag
                v-for='tag in useStoreLayout.tagList'
                :key='tag.path'
                ref='tagsRef'
                class='m-1 cursor-pointer rounded-none'
                :closable='tag.path !== epsPathRoot'
                :disable-transitions='false'
                :effect='tag.isActive ? "dark" : "plain"'
                @close='useStoreLayout.closeTag(tag.path)'
            >
                <router-link :to='tag.path'>{{ tag.title }}</router-link>
            </el-tag>
        </div>
    </el-scrollbar>
</template>
<script setup lang='ts'>
import type { ElScrollbar } from 'element-plus'

const tagsRef = ref()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const handleScroll = (e:any) => scrollbarRef.value?.setScrollLeft(-e.wheelDelta / 4 + (scrollbarRef.value?.wrapRef?.scrollLeft || 0))

const tagAndTagSpacing = 4
// 添加nextTick为了更新最新的tagsRef的值
watch(useStoreLayout.tagList, (v) => nextTick(() => {
    // 获取高亮的标签索引
    const currentIndex = v.findIndex(val => val.isActive)
    if(currentIndex === -1 || !scrollbarRef.value || !scrollbarRef.value.wrapRef) return
    const scrollWrapper = scrollbarRef.value.wrapRef
    const contentWidth = scrollWrapper.offsetWidth // 可视宽度
    // 第一个变化
    if(currentIndex === 0) {
        scrollbarRef.value.setScrollLeft(0)
        return
    }
    // 最后一个变化
    if(currentIndex === v.length - 1) {
        const lastTag = tagsRef.value[v.length - 1]
        const lastTagOffsetLeft = lastTag.$el.offsetLeft + lastTag.$el.offsetWidth + tagAndTagSpacing // 左距+自宽
        scrollbarRef.value.setScrollLeft(lastTagOffsetLeft - contentWidth)
        return
    }
    const prevTag = tagsRef.value[currentIndex - 1] // 前一个标签
    const nextTag = tagsRef.value[currentIndex + 1] // 后一个标签
    const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing // 左距+自宽
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing // 左距
    
    if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + contentWidth) {
        scrollbarRef.value.setScrollLeft(afterNextTagOffsetLeft - contentWidth)
    } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
        scrollbarRef.value.setScrollLeft(beforePrevTagOffsetLeft)
    }
}))
</script>