<template>
    <div class='layout'>
        <!-- 遮罩 -->
        <div 
            class='layout-mask fixed z-1000 h-screen w-screen bg-black bg-opacity-50'
            :class='{"hidden": menuStatus !== IMenuStatus.PHE }'
            @click='updateCollapsed'
        />
        <el-container>
            <el-aside
                class='layout-aside'
                :class='{
                    "w-42": menuStatus === IMenuStatus.PCE || menuStatus === IMenuStatus.PHE,
                    "w-0": menuStatus === IMenuStatus.PHN, 
                    "w-16": menuStatus === IMenuStatus.PCN, 
                    "relative": !isMenuStatusPhone,
                    "absolute": isMenuStatusPhone,
                }'
            >
                <el-container class='h-screen'>
                    <el-header class='layout-logo h-12'><LayoutLogo /></el-header>
                    <el-main class='layout-menu overflow-x-hidden p-0'><LayoutMenu /></el-main>
                    <el-footer class='layout-info h-10'><LayoutInfo /></el-footer>
                </el-container>
            </el-aside>
            <el-container class='h-screen'>
                <el-header class='layout-header h-12'><LayoutHeader /></el-header>
                <el-header class='layout-tags h-8 flex items-center'><LayoutTag /></el-header>
                <el-main class='layout-content'>
                    <LayoutContent />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup lang='ts'>
import LayoutLogo from './components/logo/index.vue'
import LayoutMenu from './components/menu/index.vue'
import LayoutInfo from './components/info/index.vue'
import LayoutHeader from './components/header/index.vue'
import LayoutContent from './components/content/index.vue'
import LayoutTag from './components/tag/index.vue'
import { IMenuStatus } from '@/store/layout/menu'

const { menuStatus, updateCollapsed } = toRefs(useStoreLayout)
const isMenuStatusPhone = computed(() => menuStatus.value === IMenuStatus.PHE || menuStatus.value === IMenuStatus.PHN)
</script>

<style scoped>
.layout-aside {
    --aside-color: #c8c9cc;

    border-color: var(--el-border-color);
    background-color: #304156;
    color: var(--aside-color);
    z-index: 999;
    transition-property: width;
    transition-duration: 200ms;
    overflow: hidden;
}

.layout-header {
    border-bottom: 1px solid var(--el-border-color);
    background-color: var(--header-bg-color);
    color: var(--header-color);
    -webkit-app-region: drag; /* 可拖动区域 */
    user-select: none;
}

.layout-tags {
    box-sizing: content-box;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%),0 0 3px 0 rgb(0 0 0 / 4%)
}

.layout-content {
    padding: 0;
    overflow-x: hidden;
}
</style>