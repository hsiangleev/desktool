<template>
    <div class='flex items-center'>
        <eps-icon class='layout-header-left-icon' type='ant-design:minus-outlined' title='最小化' @click='min' />
        <eps-icon class='layout-header-left-icon' type='ant-design:border-outlined' title='最大化' @click='max' />
        <eps-icon class='layout-header-left-icon' type='ep:close' title='关闭' @click='close' />
    </div>
</template>
<script setup lang='ts'>
const min = async() => await window.electronAPI.send('window-control', 'minimize')
const max = async() => await window.electronAPI.send('window-control', 'maximize')
const close = async() => {
    epsLayerLoading('关闭中...')
    await window.electronAPI.send('window-control', 'close')
}
</script>