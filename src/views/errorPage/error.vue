<template>
    <div>
        <el-empty :image-size='300' :description='description' />
    </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const description = ref('')
description.value = `该页面功能地址${route.meta.filePath ? `(${route.meta.filePath})` : ''}配置错误，页面找不到！`

</script>