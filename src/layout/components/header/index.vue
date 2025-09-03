<template>
    <div class='h-full flex items-center justify-between'>
        <div class='flex items-center'>
            <LayoutLeftIcon />
            <!-- <LayoutBreadcrumb /> -->
        </div>
        <div class='flex items-center'>
            <LayoutRightIcon />
        </div>
    </div>
</template>
<script setup lang='ts'>
import LayoutLeftIcon from './leftIcon.vue'
import LayoutRightIcon from './rightIcon.vue'
// import LayoutBreadcrumb from './breadcrumb.vue'
</script>

<style scoped>
:deep(.layout-header-left-icon) {
    cursor: pointer;
    font-size: 18px;
    -webkit-app-region: no-drag; /* 按钮不可拖动 */

    &:not(:last-child) {
        margin-right: 12px;
    }

    &:hover {
        color: var(--el-color-primary);
    }
}
</style>