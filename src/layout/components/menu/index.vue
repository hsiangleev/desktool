<template>
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
    background-color: #304156;

    :deep(.el-menu) {
        color: #ddd;
        background-color: #000;
    }

    :deep(.el-sub-menu__title) {
        color: #ddd;
        background-color: #304156;
    }

    :deep(.el-menu-item) {
        color: #ddd;

        &:hover {
            background-color: #000;
            color: var(--el-color-primary);
        }
    }

    :deep(.el-menu-item.is-active) {
        background-color: var(--el-color-primary);
        color: #fff;
    }
}

</style>