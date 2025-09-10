<template>
    <el-scrollbar ref='scrollbarRef' @wheel.prevent='handleScroll'>
        <div class='whitespace-nowrap'>
            <el-tag
                v-for='tag in useStoreLayout.tagList'
                :key='tag.path'
                ref='tagsRef'
                class='m-1 cursor-pointer rounded-none'
                :closable='tag.path !== "/"'
                :disable-transitions='false'
                :effect='tag.isActive ? "dark" : "plain"'
                @close='useStoreLayout.closeTag(tag.path)'
                @contextmenu.prevent.stop='showMenu(tag, $event)'
            >
                <router-link :to='tag.path'>{{ tag.title }}</router-link>
            </el-tag>
        </div>
        <EpsMenu ref='menuRef'>
            <li @click='useStoreLayout.refresh()'>刷新</li>
            <li @click='useStoreLayout.closeOtherTag(itemTag?.path)'>关闭其它</li>
            <li @click='useStoreLayout.closeAllTag()'>关闭所有</li>
        </EpsMenu>
    </el-scrollbar>
</template>
<script setup lang='ts'>
import type EpsMenu from '@/components/menu/EpsMenu.vue'
import { ITag } from '@/store/layout/tag'
import type { ElScrollbar } from 'element-plus'

const tagsRef = ref()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const handleScroll = (e:any) => scrollbarRef.value?.setScrollLeft(-e.wheelDelta / 4 + (scrollbarRef.value?.wrapRef?.scrollLeft || 0))

const menuRef = ref<InstanceType<typeof EpsMenu>>()
const itemTag = ref<ITag>()
const showMenu = (tag: ITag, event:MouseEvent) => {
    itemTag.value = tag
    menuRef.value?.updateMenu(event)
}
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