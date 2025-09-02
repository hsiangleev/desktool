<template>
    <div class='flex items-center'>
        <eps-icon
            class='layout-header-left-icon' 
            :type='isFullscreen ? "ant-design:fullscreen-exit-outlined" : "ant-design:fullscreen-outlined"'
            :title='isFullscreen ? "退出全屏" : "全屏"'
            @click='toggle'
        />
        <!-- <eps-icon class='layout-header-left-icon' type='ep:bell' /> -->
    </div>
</template>
<script setup lang='ts'>
const isFullscreen = ref(false)
const toggle = async() => {
    
}
</script>