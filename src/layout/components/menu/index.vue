<template>
    <el-scrollbar class='h-full'>
        <el-menu
            :default-active='activeMenu'
            class='layout-menu-content'
            :collapse='useStoreLayout.isCollapsed'
            :collapse-transition='false'
            :unique-opened='true'
            router
        >
            <MenuItem v-for='v in menu' :key='v.id' :menu='v' />
        </el-menu>
    </el-scrollbar>
</template>
<script setup lang='ts'>
import MenuItem from './menuItem.vue'
import menu from '@/data/menu'
const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.layout-menu-content{
    border: 0;
    background-color: var(--aside-bg-color);

    :deep(.el-menu) {
        color: var(--aside-color);
        background-color: #fff;
    }

    :deep(.el-sub-menu__title) {
        color: var(--aside-color);
        background-color: var(--aside-bg-color);
    }

    :deep(.el-menu-item) {
        color: var(--aside-color);

        &:hover {
            background-color: #fff;
            color: var(--el-color-primary);
        }
    }

    :deep(.el-menu-item.is-active) {
        background-color: var(--el-color-primary-light-8);
    }
}
</style>