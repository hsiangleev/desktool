<template>
    <el-empty :description='text' />
</template>
<script setup lang='ts'>
const text = ref('心有猛虎，细嗅蔷薇')
fetch('https://v1.hitokoto.cn/').then(async(d) => text.value = (await d.json()).hitokoto)
</script>