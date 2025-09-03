<template>
    <el-input v-model='dir' readonly placeholder='请选择文件夹'>
        <template #append><div class='cursor-pointer' @click='sellectDir'>选择文件夹</div></template>
    </el-input>
</template>
<script setup lang='ts'>
const dir = defineModel<string>({ required: true })
const emit = defineEmits(['change'])
const sellectDir = async() => {
    dir.value = await window.electronAPI.invoke('sellectDir')
    emit('change', dir.value)
}
</script>