<template>
    <div class='el-empty'>
        <div class='el-empty__image'>😁</div>
        <div class='el-empty__description'><p>{{ text }}</p></div>
    </div>
</template>
<script setup lang='ts'>
const text = ref('')
fetch('https://v1.hitokoto.cn/')
    .then(async(d) => text.value = (await d.json()).hitokoto)
    .catch(() => text.value = '我有故人抱剑去，斩尽春风未曾归。')
</script>

<style scoped>
    .el-empty__image{
        margin: 50px 0 10px;
        font-size: 100px;
        opacity: 0.3;
    }
</style>