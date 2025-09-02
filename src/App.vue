<template>
    <el-config-provider :locale='locale' size='default'>
        <router-view />
    </el-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import locale from 'element-plus/es/locale/lang/zh-cn'

</script>
