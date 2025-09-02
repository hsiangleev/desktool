<template>
    <p v-if='!useStoreLayout.isCollapsed' class='footer-color w-full flex items-center text-center text-xs tracking-wider'>
        <el-image class='layout-img' :src='logo' /> 
        <span>&nbsp;2025&nbsp;</span> 
        <el-link type='info' class='footer-color text-xs' underline='never' href='http://hsianglee.cn/' target='_blank'> hsianglee</el-link> 
        <!-- <span>&nbsp;开发维护</span> -->
    </p>
</template>
<script setup lang='ts'>
import logo from '@/assets/images/favicon.ico'
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