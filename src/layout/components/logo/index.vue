<template>
    <router-link to='/' class='h-full flex items-center justify-center'>
        <el-image class='w-8 rounded-full' :src='logo' />
        <div v-if='!useStoreLayout.isCollapsed' class='ml-4 text-lg'>桌面工具</div>
    </router-link>
</template>
<script setup lang='ts'>
import logo from '@/assets/images/me.jpg'
</script>