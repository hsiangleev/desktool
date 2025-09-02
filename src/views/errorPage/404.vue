<template>
    <el-result title='找不到该页面...' sub-title='请检查您输入的网址是否正确，或点击以下按钮返回主页'>
        <template #icon>
            <el-text type='primary' class='text-6xl'>404</el-text>
        </template>
        <template #extra>
            <el-link href='/' type='primary'>回到主页</el-link>
        </template>
    </el-result>
</template>
<script lang='ts' setup>
</script>