<template>
    <p v-if='!useStoreLayout.isCollapsed' class='footer-color w-full flex items-center text-center text-xs tracking-wider'>
        <el-image class='layout-img' :src='logo' /> 
        <span>&nbsp;2025&nbsp;</span> 
        <el-text class='footer-color text-xs'>hsianglee</el-text>
        <!-- <span>&nbsp;开发维护</span> -->
    </p>
</template>
<script setup lang='ts'>
import logo from '/favicon.ico'
</script>

<style scoped>
    .layout-img{
        width: 12px;
        position: relative;
        top: 2px;
    }

    .footer-color{
        color: var(--aside-color);
    }
</style>