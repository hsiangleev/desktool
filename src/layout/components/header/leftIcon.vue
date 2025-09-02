<template>
    <div class='mr-8 flex items-center'>
        <eps-icon class='layout-header-left-icon' :type='!isCollapsed ? "ep:fold" : "ep:expand"' @click='updateCollapsed()' />
        <router-link to='/' class='layout-header-left-icon'><eps-icon type='ant-design:home-outlined' /></router-link>
        <eps-icon class='layout-header-left-icon' type='ep:refresh' @click='refresh()' />
    </div>
</template>
<script setup lang='ts'>
const { isCollapsed, updateCollapsed } = toRefs(useStoreLayout)
const route = useRoute()
const router = useRouter()
const refresh = () => router.replace(`${epsPathRedirect}${route.fullPath}`)
</script>